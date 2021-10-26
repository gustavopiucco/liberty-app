const Joi = require('joi');

const approve = {
    params: Joi.object().keys({
        id: Joi.number().integer().required()
    }),
};

const deny = {
    params: Joi.object().keys({
        id: Joi.number().integer().required()
    }),
};

module.exports = {
    approve,
    deny
}