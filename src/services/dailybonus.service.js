const ApiError = require('../utils/ApiError');
const httpStatus = require('http-status');
const { format } = require('date-fns');
const dailybonusModel = require('../models/dailybonus.model');
const contractModel = require('../models/contract.model');
const userModel = require('../models/user.model');

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

    for (contract of contracts) {
        console.log(contract)
    }

    //agora pega todo mundo q tem contrato ativo e paga o todayBonus.percentage baseado no plano dele ativo
    //cria o registro q foi pago na tabela daily_bonus_records q ainda precisa criar no mysql
    //chama o multilevel service pra pagar em 8 niveis
}

module.exports = {
    getByDate,
    getAll,
    create,
    payDailyBonus
}