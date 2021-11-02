const schedule = require('node-schedule');
const dailyBonusService = require('../services/dailybonus.service');
const careerPlanSerivde = require('../services/careerplan.service');
const withdrawModel = require('../models/withdraw.model');

function start() {
    handleAvailableBalances();
    handleDailyBonus();
    handleCareerPlan();
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

function handleCareerPlan() {
    //todo dia as 05:00
    schedule.scheduleJob('0 5 * * *', async () => {
        await careerPlanSerivde.checkCareerPlan();
    });
}

module.exports = {
    start
}