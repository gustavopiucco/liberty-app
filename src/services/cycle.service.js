const userModel = require('../models/user.model');
const contractModel = require('../models/contract.model');

const maxCyclePercentage = 50;

async function handleUserCycle(user, contract, planPrice, value) {
    const maxUserCycleValue = planPrice + (planPrice * (maxCyclePercentage / 100));

    if (contract.total_received + value < maxUserCycleValue) {
        await contractModel.addTotalReceived(contract.id, value);
    }
    else {
        const differenceValue = parseFloat((maxUserCycleValue - contract.total_received).toFixed(2));
        await contractModel.addTotalReceived(contract.id, differenceValue);
        await contractModel.updateStatus(contract.id, 'completed');
    }
}

module.exports = {
    handleUserCycle
}