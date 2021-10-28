const Joi = require('joi');

const getById = {
    params: Joi.object().keys({
        id: Joi.number().integer().required(),
    }),
};

const create = {
    body: Joi.object().keys({
        value: Joi.number().required(),
    }),
};

module.exports = {
    getById,
    create
}