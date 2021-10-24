require('dotenv/config');
const mysql = require('./src/database/mysql');
const userModel = require('./src/models/user.model');
const multilevelModel = require('./src/models/multilevel.model');
const contractModel = require('./src/models/contract.model');
const userService = require('./src/services/user.service');
const multilevelService = require('./src/services/multilevel.service');
const dailyBonusService = require('./src/services/dailybonus.service');
const contractService = require('./src/services/contract.service');

mysql.testConnection().then(() => {
    console.info('Connected to MySQL');
});

async function test() {
    //await dailyBonusService.payDailyBonus();
    //const contract = await contractModel.getById(3);
    //await multilevelService.payMultilevelBonus(contract.id, contract.user_id, contract.plan_price, 'contract_payment_bonus', 5, [10, 2, 1, 1, 1]);
}

test();