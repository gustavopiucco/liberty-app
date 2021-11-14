require('dotenv/config');
const mysql = require('./src/database/mysql');
const dailyBonusService = require('./src/services/dailybonus.service');
const cycleService = require('./src/services/cycle.service');
const careerPlanService = require('./src/services/careerplan.service');

mysql.testConnection().then(() => {
    console.info('Connected to MySQL');
});

async function test() {
    await dailyBonusService.payDailyBonus();
    //await cycleService.handleUserCycle();
    //await careerPlanService.checkCareerPlan();
    //const contract = await contractModel.getById(3);
    //await multilevelService.payMultilevelBonus(contract.id, contract.user_id, contract.plan_price, 'contract_payment_bonus', 5, [10, 2, 1, 1, 1]);
}

test();