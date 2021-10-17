const ApiError = require('../utils/ApiError');
const httpStatus = require('http-status');
const planModel = require('../models/plan.model');

async function getAll(loggedInUser, level) {
    const plans = await planModel.getAll();

    return plans;
}

module.exports = {
    getAll
}