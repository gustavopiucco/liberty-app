const Joi = require('joi');
const { date } = require('./custom.validation');

const getByDate = {
    params: Joi.object().keys({
        date: Joi.string().required().custom(date)
    }),
};

const getAllDaysAgo = {
    params: Joi.object().keys({
        days: Joi.number().integer().required().max(15)
    }),
};


const create = {
    body: Joi.object().keys({
        percentage: Joi.number().required(),
        date: Joi.string().required().custom(date)
    }),
};

module.exports = {
    getByDate,
    getAllDaysAgo,
    create
}