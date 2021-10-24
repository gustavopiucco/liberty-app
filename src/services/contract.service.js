const ApiError = require('../utils/ApiError');
const httpStatus = require('http-status');
const multilevelService = require('../services/multilevel.service');
const contractModel = require('../models/contract.model');
const planModel = require('../models/plan.model');

async function getAll() {
    const contracts = await contractModel.getAll();

    return contracts;
}

async function getAllByUserId(userId) {
    const contracts = await contractModel.getAllByUserId(userId);

    return contracts;
}

async function approve(loggedInUser, id) {
    const contract = await contractModel.getById(id);

    if (!contract) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Este contrato não existe');
    }

    if (contract.status == 'payment_confirmed') {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Este contrato já foi aprovado');
    }

    if (contract.status == 'payment_denied') {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Este contrato já foi negado anteriormente');
    }

    await multilevelService.payMultilevelBonus(contract, 'contract_payment_bonus');

    await contractModel.updateStatus(id, 'payment_confirmed');
}

async function deny(loggedInUser, id) {
    const contract = await contractModel.getById(id);

    if (!contract) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Este contrato não existe');
    }

    if (contract.status == 'payment_denied') {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Este contrato já foi negado');
    }

    await contractModel.updateStatus(id, 'payment_denied');
}

async function create(loggedInUser, body) {
    const plan = await planModel.getById(body.plan_id);

    if (!plan) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Este plano não existe');
    }

    const contracts = await contractModel.getAllByUserId(loggedInUser.id);

    for (contract of contracts) {
        if (contract.status == 'waiting_payment') {
            throw new ApiError(httpStatus.BAD_REQUEST, 'Já existe um contrato aguardando pagamento');
        }

        //permitir apenas um contrato no sistema, futuramente vai permitir mais
        if (contract.status == 'payment_confirmed') {
            throw new ApiError(httpStatus.BAD_REQUEST, 'Já existe um contrato em aberto');
        }
    }

    await contractModel.create(loggedInUser.id, body.plan_id, 'pix', new Date);
}

async function deleteById(loggedInUser, id) {
    const contract = await contractModel.getById(id);

    if (!contract) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Este contrato não existe');
    }

    if (contract.status != 'waiting_payment') {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Você só pode deletar contatos que estão aguardando pagamento');
    }

    if (loggedInUser.id != contract.user_id) {
        throw new ApiError(httpStatus.FORBIDDEN, 'Sem permissão');
    }

    await contractModel.deleteById(id);
}

module.exports = {
    getAll,
    getAllByUserId,
    approve,
    deny,
    create,
    deleteById
}