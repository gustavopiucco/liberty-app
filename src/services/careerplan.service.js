const userModel = require('../models/user.model');
const multilevelModel = require('../models/multilevel.model');
const contractModel = require('../models/contract.model');

const untilLevel = 2;

async function checkCareerPlan() {
    const users = await userModel.getAllWithActiveOrCompletedContract();

    for (let user of users) {
        const network = await multilevelModel.getUntilLevel(user.id, untilLevel);

        let total = 0;

        for (let user of network) {
            const contracts = await contractModel.getAllByUserIdNotPending(user.id);

            for (let contract of contracts) {
                total += contract.plan_price;
            }
        }

        if (total < 5000) {
            await userModel.updateCareerPlan(user.id, null, total);
        }
        else if (total >= 5000 && total < 150000) {
            await userModel.updateCareerPlan(user.id, 'trader', total);
        }
        else if (total >= 150000 && total < 300000) {
            await userModel.updateCareerPlan(user.id, 'trader_vip', total);
        }
        else if (total >= 300000 && total < 1500000) {
            await userModel.updateCareerPlan(user.id, 'broker', total);
        }
        else if (total >= 1500000 && total < 5000000) {
            await userModel.updateCareerPlan(user.id, 'broker_vip', total);
        }
        else if (total >= 5000000) {
            await userModel.updateCareerPlan(user.id, 'diretor', total);
        }
    }
}

module.exports = {
    checkCareerPlan
}