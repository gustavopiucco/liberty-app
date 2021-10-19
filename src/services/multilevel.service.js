const ApiError = require('../utils/ApiError');
const httpStatus = require('http-status');
const multilevelModel = require('../models/multilevel.model');
const userModel = require('../models/user.model');
const planModel = require('../models/plan.model');

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
        //adiciona o bonus baseado no level para o usuario (saldo pendente)
        //cria o registro de pagamento do bonus
    }
}

module.exports = {
    getByLevel,
    payMultilevelBonus
}