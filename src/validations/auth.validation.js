const Joi = require('joi');

const login = {
    body: Joi.object().keys({
        email: Joi.string().required(),
        password: Joi.string().required(),
    }),
};

const updatePassword = {
    body: Joi.object().keys({
        new_password: Joi.string().required().min(6).max(50),
    }),
};

const emailConfirmation = {
    body: Joi.object().keys({
        code: Joi.string().required().length(20),
    }),
};

module.exports = {
    login,
    updatePassword,
    emailConfirmation
};