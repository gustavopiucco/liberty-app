const ApiError = require('../utils/ApiError');
const httpStatus = require('http-status');
const userModel = require('../models/user.model');
const contractModel = require('../models/contract.model');
const multilevelRecordsModel = require('../models/multilevelrecords.model');

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

    //TODO: adicionar a restrição do teto diario aqui
    //soma todos os value do multilevel_records e daily_bonus_records do userId e do DATE(created_at) = hoje
    //paga até o teto do plano dele

    for (let level = 1; level <= sponsors.length; level++) {
        const user = sponsors[level - 1];
        const value = ((bonusPercentageByLevel[level - 1]) / 100) * baseValue;
        const contract = await contractModel.getByUserIdAndApproved(user.id);

        if (!contract) continue; //user does not have an active contract, so he does not receive the bonus

        //const cycleValue = await cycleService.handleUserCycle(contract.id, contract.user_id, contract.total_received, contract.plan_price, value);

        //await multilevelRecordsModel.create(user.id, baseContractUserId, baseContractId, type, level, cycleValue, new Date());
    }
}

module.exports = {
    payMultilevelBonus
}