const userModel = require('../models/user.model');
const contractModel = require('../models/contract.model');

const maxCyclePercentage = 50;

async function handleUserCycle(user, planPrice, value) {
    //a soma do value ao ciclo do usuario, for superior a 100%, então precisa verificar quanto falta pra chegar a 100%, e só pagar essa diferenç
    //caso contrario, apenas soma o ciclo

    const maxUserCycleValue = planPrice + (planPrice * (maxCyclePercentage / 100));

    //E SE ESSE USUARIO NÃO TIVER UM PLANO ATIVO????
    //const contract = await contractModel.getByUserIdAndPaymentConfirmed(user.id);

    //if (totalBalance + value < maxUserCycleValue) {
    //soma o total_received do contrato payment_confirmed desse user.id
    //await contractModel.addTotalReceived(user.id, value);
    //console.log('somar total_received em ', value)
    //}
    //else {
    //calcula a diferença
    //encerra o ciclo
    //console.log('encerrar ciclo')
    //}
}

module.exports = {
    handleUserCycle
}