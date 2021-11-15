const ApiError = require('../utils/ApiError');
const httpStatus = require('http-status');
const { format, subDays } = require('date-fns');
const dailybonusModel = require('../models/dailybonus.model');
const contractModel = require('../models/contract.model');
const dailyBonusRecordModel = require('../models/dailybonusrecord.model');
const userModel = require('../models/user.model');
const multilevelService = require('../services/multilevel.service');

async function payDailyBonus() {
    const todayDate = format(new Date(), 'yyyy-MM-dd HH:mm:00');

    console.log(todayDate)

    const todayBonuses = await dailybonusModel.getAllByDate(todayDate);

    console.log(todayBonuses)

    if (todayBonuses.length == 0) return;

    const contracts = await contractModel.getAllApproved();

    for (const contract of contracts) {
        const bonus = todayBonuses.find((bonus) => {
            return bonus.plan_id == contract.plan_id;
        });

        if (!bonus) return;

        const baseValue = parseFloat((contract.plan_price * (bonus.percentage / 100)).toFixed(2));
        const userValue = parseFloat((baseValue * 0.6).toFixed(2)); //60%
        const multilevelValue = parseFloat((baseValue * 0.2).toFixed(2)); //20%

        const maxUserCycleValue = contract.plan_price * 2; //200%

        if (contract.total_received + userValue < maxUserCycleValue) {
            await contractModel.addTotalReceived(contract.id, userValue);
            await userModel.addPendingBalance(contract.user_id, userValue);
            await dailyBonusRecordModel.create(contract.user_id, contract.id, userValue, new Date());
        }
        else {
            const differenceValue = parseFloat((maxUserCycleValue - contract.total_received).toFixed(2));
            await contractModel.addTotalReceived(contract.id, differenceValue);
            await userModel.addPendingBalance(contract.user_id, differenceValue);
            await contractModel.updateStatus(contract.id, 'completed');
            await dailyBonusRecordModel.create(contract.user_id, contract.id, differenceValue, new Date());
        }

        //se o usuario tiver algum plano de carreira, então paga em 8 niveis

        //await multilevelService.payMultilevelBonus(contract.id, contract.user_id, multilevelValue, 'daily_bonus', 8, [8, 5, 2, 1, 1, 1, 1, 1]);
    }
}

module.exports = {
    payDailyBonus
}