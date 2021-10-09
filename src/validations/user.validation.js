const Joi = require('joi');
const { date } = require('./custom.validation');

const create = {
    body: Joi.object().keys({
        invite_code: Joi.string().required(),
        email: Joi.string().required().email().max(100),
        password: Joi.string().required().min(6).max(50),
        first_name: Joi.string().required().max(30),
        last_name: Joi.string().required().max(60),
        cpf: Joi.string().required().length(11),
        phone: Joi.string().required().max(20),
        birth_date: Joi.required().custom(date),
        country: Joi.string().required().max(30),
        city: Joi.string().required().max(50),
        state: Joi.string().required().max(50),
        postal_code: Joi.string().required().max(20),
    }),
};

const updatePassword = {
    body: Joi.object().keys({
        new_password: Joi.string().required().min(6).max(50),
    }),
};

module.exports = {
    create,
    updatePassword
}