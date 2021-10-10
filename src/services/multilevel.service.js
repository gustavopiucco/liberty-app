const ApiError = require('../utils/ApiError');
const httpStatus = require('http-status');
const multilevelModel = require('../models/multilevel.model');

async function getByLevel(loggedInUser, level) {
    const multilevel = await multilevelModel.getByLevel(loggedInUser.id, level);

    return multilevel;
}

async function addGains(levels, percentage, value) {
    //levels = quantidade de niveis
    //percentage = array com o nivel e a %
    //value = valor q vai ser calculado a % por nivel
}

module.exports = {
    getByLevel,
    addGains
}