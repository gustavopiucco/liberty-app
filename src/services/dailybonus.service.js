const ApiError = require('../utils/ApiError');
const httpStatus = require('http-status');
const dailybonusModel = require('../models/dailybonus.model');

async function getByDate(date) {
    const dailyBonus = await dailybonusModel.getByDate(date);

    if (!dailyBonus) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Não foi encontrado nenhum registro para esta data');
    }

    return dailyBonus;
}

async function getAll() {
    const dailyBonuses = await dailybonusModel.getAll();

    return dailyBonuses;
}

async function create(percentage, date) {
    await dailybonusModel.create(percentage, date);
}

module.exports = {
    getByDate,
    getAll,
    create
}