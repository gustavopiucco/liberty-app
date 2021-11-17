const ApiError = require('../utils/ApiError');
const httpStatus = require('http-status');
const userModel = require('../models/user.model');
const contractModel = require('../models/contract.model');
const multilevelRecordsModel = require('../models/multilevelrecords.model');
const { format } = require('date-fns');

async function getSponsorsByUserId(rootUserId, maxLevels = 0) {
    let sponsors = [];

    const rootUser = await userModel.getById(rootUserId);

    let currentUserId = rootUser.sponsor_id;

    for (let i = 1; i <= maxLevels; i++) {
        const user = await userModel.getById(currentUserId);

        if (!user) break;

        sponsors.push(user);

        currentUserId = user.sponsor_id;
    }

    return sponsors;
}

async function payMultilevelBonus(baseContractId, baseContractUserId, baseValue, type, maxLevels, bonusPercentageByLevel) {
    const sponsors = await getSponsorsByUserId(baseContractUserId, maxLevels);

    for (let level = 1; level <= sponsors.length; level++) {
        const user = sponsors[level - 1];
        const value = parseFloat((((bonusPercentageByLevel[level - 1]) / 100) * baseValue).toFixed(4));

        if (type == 'daily_bonus') {
            if (!user.career_plan) continue;
        }

        const userContracts = await contractModel.getAllByUserIdAndApproved(user.id);

        if (userContracts.length == 0) continue;

        let contractsTotalPrice = 0;

        for (let userContract of userContracts) {
            contractsTotalPrice += userContract.plan_price;
        }

        let multilevelRecordsTotalPrice = 0

        const multilevelRecords = await multilevelRecordsModel.getAllByUserIdAndCreatedAt(user.id, format(new Date(), 'yyyy-MM-dd'));

        for (multilevelRecord of multilevelRecords) {
            multilevelRecordsTotalPrice += multilevelRecord.value;
        }

        console.log(contractsTotalPrice, multilevelRecordsTotalPrice)

        if (multilevelRecordsTotalPrice + value <= contractsTotalPrice) {
            await userModel.addPendingBalance(user.id, value);
            await multilevelRecordsModel.create(user.id, baseContractUserId, baseContractId, type, level, value, new Date());
        }
        else {
            const differenceValue = parseFloat((contractsTotalPrice - multilevelRecordsTotalPrice).toFixed(2));
            if (differenceValue > 0) {
                await userModel.addPendingBalance(user.id, differenceValue);
                await multilevelRecordsModel.create(user.id, baseContractUserId, baseContractId, type, level, differenceValue, new Date());
            }
        }
    }
}

module.exports = {
    getSponsorsByUserId,
    payMultilevelBonus
}