const ApiError = require('../utils/ApiError');
const httpStatus = require('http-status');
const userModel = require('../models/user.model');
const contractModel = require('../models/contract.model');
const multilevelRecordsModel = require('../models/multilevelrecords.model');

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

    //aqui pegar todos os contratos ativos desse usuario e somar o valor do contrato
    //pegar tb a soma de tudo q ele ganhou no dia de bonus de multinivel
    //e pagar apenas se nao atingiu o teto diario dele q é a soma dos contratos

    for (let level = 1; level <= sponsors.length; level++) {
        const user = sponsors[level - 1];
        const value = parseFloat((((bonusPercentageByLevel[level - 1]) / 100) * baseValue).toFixed(4));
        const userContract = await contractModel.getByUserIdAndApproved(user.id);

        if (!userContract) continue;

        if (type == 'daily_bonus') {
            if (!user.career_plan) continue;
        }

        await userModel.addPendingBalance(user.id, value);

        await multilevelRecordsModel.create(user.id, baseContractUserId, baseContractId, type, level, value, new Date());
    }
}

module.exports = {
    getSponsorsByUserId,
    payMultilevelBonus
}