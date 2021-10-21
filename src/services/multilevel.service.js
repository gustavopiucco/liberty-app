const ApiError = require('../utils/ApiError');
const httpStatus = require('http-status');
const contractService = require('../services/contract.service');
const multilevelModel = require('../models/multilevel.model');
const userModel = require('../models/user.model');
const planModel = require('../models/plan.model');
const multilevelRecordsModel = require('../models/multilevelrecords.model');

const maxLevels = 5;
const bonusPercentageByLevel = [10, 2, 1, 1, 1];

async function getByLevel(loggedInUser, level) {
    const multilevel = await multilevelModel.getByLevel(loggedInUser.id, level);

    return multilevel;
}

async function getSponsorsIdByUserId(rootUserId) {
    let sponsors = [];

    const rootUser = await userModel.getById(rootUserId);

    let currentUserId = rootUser.sponsor_id;

    for (let i = 1; i <= maxLevels; i++) {
        const user = await userModel.getById(currentUserId);

        if (!user) break;

        sponsors.push(user.id);

        currentUserId = user.sponsor_id;
    }

    return sponsors;
}

async function payMultilevelBonus(userId, planId) {
    const plan = await planModel.getById(planId);

    const sponsorsId = await getSponsorsIdByUserId(userId);

    for (let level = 1; level <= sponsorsId.length; level++) {
        const fromUserId = sponsorsId[level - 1];
        const value = ((bonusPercentageByLevel[level - 1]) / 100) * plan.price;

        await userModel.addPendingBalance(fromUserId, value);

        await multilevelRecordsModel.create(userId, fromUserId, 'affiliate_program', level, value, new Date());

        await contractService.handleContractCycle(fromUserId, value);
    }
}

module.exports = {
    getByLevel,
    payMultilevelBonus
}