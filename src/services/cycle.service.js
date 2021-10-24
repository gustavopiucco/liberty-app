const userModel = require('../models/user.model');
const contractModel = require('../models/contract.model');

const maxCyclePercentage = 50;

async function handleUserCycle(contract, planPrice, value) {
    const maxUserCycleValue = planPrice + (planPrice * (maxCyclePercentage / 100));

    //TODO: adicionar a restrição do teto diario aqui

    if (contract.total_received + value < maxUserCycleValue) {
        await contractModel.addTotalReceived(contract.id, value);
        await userModel.addPendingBalance(contract.user_id, value);

        return value;
    }
    else {
        const differenceValue = parseFloat((maxUserCycleValue - contract.total_received).toFixed(2));
        await contractModel.addTotalReceived(contract.id, differenceValue);
        await userModel.addPendingBalance(contract.user_id, differenceValue);
        await contractModel.updateStatus(contract.id, 'completed');

        return differenceValue;
    }
}

module.exports = {
    handleUserCycle
}