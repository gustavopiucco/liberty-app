const { format } = require('date-fns');
const dailybonusModel = require('../models/dailybonus.model');
const contractModel = require('../models/contract.model');
const dailyBonusRecordModel = require('../models/dailybonusrecord.model');
const userModel = require('../models/user.model');
const multilevelService = require('./multilevel.service');
const careerPlanService = require('./careerplan.service');

async function payDailyBonus() {
    const todayDate = format(new Date(), 'yyyy-MM-dd HH:mm:00');

    const todayBonuses = await dailybonusModel.getAllByDate(todayDate);

    if (todayBonuses.length == 0) return;

    await careerPlanService.checkCareerPlan();

    const contracts = await contractModel.getAllApproved();

    for (const contract of contracts) {
        const bonus = todayBonuses.find((bonus) => {
            return bonus.plan_id == contract.plan_id;
        });

        if (!bonus) continue;

        const baseValue = parseFloat((contract.plan_price * (bonus.percentage / 100)).toFixed(4));
        const bonusValue = parseFloat((baseValue * 0.6).toFixed(4)); //60%
        const multilevelValue = parseFloat((baseValue * 0.4).toFixed(4)); //40%

        const maxUserCycleValue = contract.plan_price * 2; //200%

        if (contract.total_received + bonusValue < maxUserCycleValue) {
            await contractModel.addTotalReceived(contract.id, bonusValue);
            await userModel.addPendingBalance(contract.user_id, bonusValue);
            await dailyBonusRecordModel.create(contract.user_id, contract.id, bonusValue, new Date());
        }
        else {
            const differenceValue = parseFloat((maxUserCycleValue - contract.total_received).toFixed(2));
            await contractModel.addTotalReceived(contract.id, differenceValue);
            await userModel.addPendingBalance(contract.user_id, differenceValue);
            await contractModel.updateStatus(contract.id, 'completed');
            await dailyBonusRecordModel.create(contract.user_id, contract.id, differenceValue, new Date());
        }

        await multilevelService.payMultilevelBonus(contract.id, contract.user_id, multilevelValue, 'daily_bonus', 8, [8, 5, 2, 1, 1, 1, 1, 1]);
    }
}

module.exports = {
    payDailyBonus
}