const userModel = require('../models/user.model');

const maxCyclePercentage = 50;

async function handleUserCycle(user, planPrice, value) {
    //a soma do value ao ciclo do usuario, for superior a 100%, então precisa verificar quanto falta pra chegar a 100%, e só pagar essa diferenç
    //caso contrario, apenas soma o ciclo

    const maxUserCycleValue = planPrice + (planPrice * (maxCyclePercentage / 100));
    const totalBalance = user.available_balance + user.pending_balance;

    if (totalBalance + value < maxUserCycleValue) {
        //apenas soma o ciclo
        console.log('somar ciclo em ', value / 100)
    }
    else {
        //calcula a diferença
        //encerra o ciclo
        console.log('encerrar ciclo')
    }
}

module.exports = {
    handleUserCycle
}