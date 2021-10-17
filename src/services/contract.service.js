const ApiError = require('../utils/ApiError');
const httpStatus = require('http-status');
const contractModel = require('../models/contract.model');
const planModel = require('../models/plan.model');

async function create(loggedInUser, body) {
    const plan = await planModel.getById(body.plan_id);

    if (!plan) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Este plano não existe');
    }

    await contractModel.create(loggedInUser.id, body.plan_id, new Date);
}

module.exports = {
    create
}