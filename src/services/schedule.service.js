const schedule = require('node-schedule');
const dailyBonusService = require('../services/dailybonus.service');
const withdrawModel = require('../models/withdraw.model');

function start() {
    handleAvailableBalances();
    handleDailyBonus();
    console.log('Scheduled jobs started');
}

function handleAvailableBalances() {
    //todo dia 3 as 08:00
    schedule.scheduleJob('0 8 3 * *', async () => {
        await withdrawModel.updateAvailableBalanceByPendingBalance();
    });

    //todo dia 18 as 08:00
    schedule.scheduleJob('0 8 18 * *', async () => {
        await withdrawModel.updateAvailableBalanceByPendingBalance();
    });
}

function handleDailyBonus() {
    //todo dia as 12:00
    schedule.scheduleJob('0 12 * * *', async () => {
        await dailyBonusService.payDailyBonus();
    });
}

module.exports = {
    start
}