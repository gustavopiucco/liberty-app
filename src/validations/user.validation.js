const Joi = require('joi');
const { date } = require('./custom.validation');

const create = {
    body: Joi.object().keys({
        email: Joi.string().required().email().max(100),
        password: Joi.string().required().min(6).max(50),
        firstName: Joi.string().required().max(30),
        lastName: Joi.string().required().max(60),
        cpf: Joi.string().required().length(11),
        phone: Joi.string().required().max(20),
        birthDate: Joi.required().custom(date),
        country: Joi.string().required().max(30),
        city: Joi.string().required().max(50),
        state: Joi.string().required().max(50),
        postalCode: Joi.string().required().max(20),
    }),
};

const updatePassword = {
    body: Joi.object().keys({
        newPassword: Joi.string().required().min(6).max(50),
    }),
};

module.exports = {
    create,
    updatePassword
}