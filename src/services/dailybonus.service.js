const ApiError = require('../utils/ApiError');
const httpStatus = require('http-status');
const { format, subDays } = require('date-fns');
const dailybonusModel = require('../models/dailybonus.model');
const contractModel = require('../models/contract.model');
const dailyBonusRecordModel = require('../models/dailybonusrecord.model');
const planModel = require('../models/plan.model');
const multilevelService = require('../services/multilevel.service');
const cycleService = require('../services/cycle.service');

//essa função vai ser chamada no cron 1x por dia
async function payDailyBonus() {
    const todayDate = format(new Date(), 'yyyy-MM-dd');

    const plans = await planModel.getAll();
    const todayBonuses = await dailybonusModel.getAllByDate(todayDate);

    if (plans.length != todayBonuses.length) {
        return;
    }

    const contracts = await contractModel.getAllApproved();

    for (const contract of contracts) {
        const bonus = todayBonuses.find((bonus) => {
            return bonus.plan_id == contract.plan_id;
        });

        const baseValue = parseFloat((contract.plan_price * (bonus.percentage / 100)).toFixed(2));
        const userValue = parseFloat((baseValue * 0.6).toFixed(2));
        const multilevelValue = parseFloat((baseValue * 0.2).toFixed(2));

        const cycleValue = await cycleService.handleUserCycle(contract.id, contract.user_id, contract.total_received, contract.plan_price, userValue);

        await dailyBonusRecordModel.create(contract.user_id, contract.id, cycleValue, new Date());

        await multilevelService.payMultilevelBonus(contract.id, contract.user_id, multilevelValue, 'daily_bonus', 8, [8, 5, 2, 1, 1, 1, 1, 1]);
    }
}

module.exports = {
    payDailyBonus
}