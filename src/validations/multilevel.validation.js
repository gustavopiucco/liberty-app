const Joi = require('joi');

const getByLevel = {
    params: Joi.object().keys({
        level: Joi.number().integer().required()
    }),
};

module.exports = {
    getByLevel
}