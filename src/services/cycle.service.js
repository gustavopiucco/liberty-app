const userModel = require('../models/user.model');

async function handleContractCycle(userId, value) {
    const cyclePercentage = 50;

    //TODO: otimizar o userCycle, pois o user.cycle pode vir direto no multilevelService.payMultilevelBonus, ao invés só de trazer só o userId

    const userCycle = await userModel.getById(userId);

    //a soma do value ao ciclo do usuario, for superior a 100%, então precisa verificar quanto falta pra chegar a 100%, e só pagar essa diferença
    //caso contrario, apenas soma o ciclo
}

module.exports = {
    handleContractCycle
}