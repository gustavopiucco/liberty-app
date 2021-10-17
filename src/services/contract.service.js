const ApiError = require('../utils/ApiError');
const httpStatus = require('http-status');
const contractModel = require('../models/contract.model');
const planModel = require('../models/plan.model');

async function getByUserId(userId) {
    const contract = await contractModel.getByUserId(userId);

    return contract;
}

async function create(loggedInUser, body) {
    const contract = await contractModel.getByUserId(loggedInUser.id);

    if (contract) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Já existe um contrato em aberto');
    }

    const plan = await planModel.getById(body.plan_id);

    if (!plan) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Este plano não existe');
    }

    await contractModel.create(loggedInUser.id, body.plan_id, 'pix', new Date);
}

async function deleteById(loggedInUser, id) {
    const contract = await contractModel.getById(id);

    if (!contract) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Este contrato não existe');
    }

    if (contract.status == 'payment_confirmed') {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Não é possível deletar um contrato ativo');
    }

    if (loggedInUser.id != contract.user_id) {
        throw new ApiError(httpStatus.FORBIDDEN, 'Sem permissão');
    }

    await contractModel.deleteById(id);
}

module.exports = {
    getByUserId,
    create,
    deleteById
}