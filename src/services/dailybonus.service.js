const ApiError = require('../utils/ApiError');
const httpStatus = require('http-status');
const { format } = require('date-fns');
const dailybonusModel = require('../models/dailybonus.model');
const contractModel = require('../models/contract.model');
const userModel = require('../models/user.model');
const dailyBonusRecordModel = require('../models/dailybonusrecord.model');
const multilevelService = require('../services/multilevel.service');
const cycleService = require('../services/cycle.service');

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

//essa função vai ser chamada no cron 1x por dia
async function payDailyBonus() {
    const todayDate = format(new Date(), 'yyyy-MM-dd');

    const todayBonus = await dailybonusModel.getByDate(todayDate);

    if (!todayBonus) return;

    const contracts = await contractModel.getAllWithPaymentConfirmed();

    for (const contract of contracts) {
        const baseValue = parseFloat((contract.price * (todayBonus.percentage / 100)).toFixed(2));
        const userValue = parseFloat((baseValue * 0.6).toFixed(2));
        const multilevelValue = parseFloat((baseValue * 0.2).toFixed(2));

        const cycleValue = await cycleService.handleUserCycle(contract, contract.price, userValue);

        await dailyBonusRecordModel.create(contract.user_id, contract.id, cycleValue, new Date());

        //await multilevelService.payMultilevelBonus(contract, 'daily_bonus');
    }
}

module.exports = {
    getByDate,
    getAll,
    create,
    payDailyBonus
}