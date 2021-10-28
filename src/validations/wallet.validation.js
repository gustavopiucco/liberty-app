const Joi = require('joi');

const deleteById = {
    params: Joi.object().keys({
        id: Joi.number().integer().required(),
    }),
};

const create = {
    body: Joi.object().keys({
        type: Joi.string().required().valid('pix'),
        value: Joi.string().required().max(100),
    }),
};

module.exports = {
    create,
    deleteById
}