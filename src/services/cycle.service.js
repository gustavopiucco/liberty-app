const userModel = require('../models/user.model');
const contractModel = require('../models/contract.model');

const maxCyclePercentage = 100;

async function handleUserCycle(contractId, contractUserId, contractTotalReceived, contractPlanPrice, value) {
    const maxUserCycleValue = contractPlanPrice + (contractPlanPrice * (maxCyclePercentage / 100));

    //TODO: adicionar a restrição do teto diario aqui
    //soma todos os value do multilevel_records e daily_bonus_records do userId e do DATE(created_at) = hoje
    //paga até o teto do plano dele

    if (contractTotalReceived + value < maxUserCycleValue) {
        await contractModel.addTotalReceived(contractId, value);
        await userModel.addPendingBalance(contractUserId, value);

        return value;
    }
    else {
        const differenceValue = parseFloat((maxUserCycleValue - contractTotalReceived).toFixed(2));
        await contractModel.addTotalReceived(contractId, differenceValue);
        await userModel.addPendingBalance(contractUserId, differenceValue);
        await contractModel.updateStatus(contractId, 'completed');

        return differenceValue;
    }
}

module.exports = {
    handleUserCycle
}