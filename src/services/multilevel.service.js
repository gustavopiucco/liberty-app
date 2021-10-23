const ApiError = require('../utils/ApiError');
const httpStatus = require('http-status');
const cycleService = require('../services/cycle.service');
const multilevelModel = require('../models/multilevel.model');
const userModel = require('../models/user.model');
const planModel = require('../models/plan.model');
const contractModel = require('../models/contract.model');
const multilevelRecordsModel = require('../models/multilevelrecords.model');

const maxLevels = 5;
const bonusPercentageByLevel = [10, 2, 1, 1, 1];

async function getByLevel(userId, level) {
    const multilevel = await multilevelModel.getByLevel(userId, level);

    return multilevel;
}

async function getSponsorsByUserId(rootUserId) {
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

async function payMultilevelBonus(contract, type) {
    const plan = await planModel.getById(contract.plan_id);

    const sponsors = await getSponsorsByUserId(contract.user_id);

    for (let level = 1; level <= sponsors.length; level++) {
        const user = sponsors[level - 1];
        const value = ((bonusPercentageByLevel[level - 1]) / 100) * plan.price;
        const contract = await contractModel.getByUserIdAndPaymentConfirmed(user.id);

        if (!contract) continue; //user does not have an active contract, so he does not receive the bonus

        await userModel.addPendingBalance(user.id, value);

        await cycleService.handleUserCycle(user, contract, plan.price, value);

        await multilevelRecordsModel.create(user.id, contract.user_id, contract.id, type, level, value, new Date());
    }
}

module.exports = {
    getByLevel,
    payMultilevelBonus
}