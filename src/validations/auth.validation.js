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

const passwordResetRequest = {
    body: Joi.object().keys({
        email: Joi.string().required().email(),
    }),
};

const emailValidation = {
    body: Joi.object().keys({
        code: Joi.string().required().length(20),
    }),
};

const resetPasswordValidation = {
    body: Joi.object().keys({
        code: Joi.string().required().length(20),
        new_password: Joi.string().required().min(6).max(50),
    }),
};

module.exports = {
    login,
    updatePassword,
    passwordResetRequest,
    emailValidation,
    resetPasswordValidation
};