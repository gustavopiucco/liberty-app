const ApiError = require('../utils/ApiError');
const httpStatus = require('http-status');
const cycleService = require('../services/cycle.service');
const multilevelModel = require('../models/multilevel.model');
const userModel = require('../models/user.model');
const planModel = require('../models/plan.model');
const contractModel = require('../models/contract.model');
const multilevelRecordsModel = require('../models/multilevelrecords.model');

async function getByLevel(userId, level) {
    const multilevel = await multilevelModel.getByLevel(userId, level);

    return multilevel;
}

async function getSponsorsByUserId(rootUserId, maxLevels) {
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
        const value = ((bonusPercentageByLevel[level - 1]) / 100) * baseValue;
        const contract = await contractModel.getByUserIdAndPaymentConfirmed(user.id);

        if (!contract) continue; //user does not have an active contract, so he does not receive the bonus

        const cycleValue = await cycleService.handleUserCycle(contract.id, contract.user_id, contract.total_received, baseValue, value);
        await multilevelRecordsModel.create(user.id, baseContractUserId, baseContractId, type, level, cycleValue, new Date());
    }
}

module.exports = {
    getByLevel,
    payMultilevelBonus
}