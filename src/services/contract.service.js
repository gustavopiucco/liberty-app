const ApiError = require('../utils/ApiError');
const httpStatus = require('http-status');
const contractModel = require('../models/contract.model');

async function create(body) {
    await contractModel.create();
}

module.exports = {
    create
}