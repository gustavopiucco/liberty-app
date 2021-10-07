const ApiError = require('../utils/ApiError');
const httpStatus = require('http-status');
const multilevelModel = require('../models/multilevel.model');

async function getByLevel(loggedInUser, level) {
    return await multilevelModel.getByLevel(loggedInUser.id, level);
}

module.exports = {
    getByLevel
}