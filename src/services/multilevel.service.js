const ApiError = require('../utils/ApiError');
const httpStatus = require('http-status');
const multilevelModel = require('../models/multilevel.model');

async function getByLevel(loggedInUser, level) {
    const multilevel = await multilevelModel.getByLevel(loggedInUser.id, level);

    return multilevel;
}

module.exports = {
    getByLevel
}