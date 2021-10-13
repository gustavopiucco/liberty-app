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

const resendEmailRequest = {
    body: Joi.object().keys({
        email: Joi.string().required().email(),
    }),
};

const resetPasswordRequest = {
    body: Joi.object().keys({
        email: Joi.string().required().email(),
    }),
};

const emailValidation = {
    body: Joi.object().keys({
        code: Joi.string().required().length(30),
    }),
};

const resetPasswordValidation = {
    body: Joi.object().keys({
        code: Joi.string().required().length(30),
        new_password: Joi.string().required().min(6).max(50),
    }),
};

module.exports = {
    login,
    updatePassword,
    resendEmailRequest,
    resetPasswordRequest,
    emailValidation,
    resetPasswordValidation
};