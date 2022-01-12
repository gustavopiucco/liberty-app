const Joi = require('joi');
const { date } = require('./custom.validation');

const getById = {
    params: Joi.object().keys({
        id: Joi.number().integer().required()
    }),
};

const getByQuery = {
    query: Joi.object().keys({
        email: Joi.string(),
        cpf: Joi.string(),
        first_name: Joi.string(),
        last_name: Joi.string(),
    }),
};


const getMultilevelByLevel = {
    params: Joi.object().keys({
        level: Joi.number().integer().required()
    }),
};

const updateMe = {
    body: Joi.object().keys({
        password: Joi.string().min(6).max(50),
        phone: Joi.string().max(20),
        birth_date: Joi.custom(date),
        country: Joi.string().max(30),
        city: Joi.string().max(50),
        state: Joi.string().max(50),
        postal_code: Joi.string().max(20),
    }),
};

const update = {
    params: Joi.object().keys({
        id: Joi.number().integer().required(),
    }),
    body: Joi.object().keys({
        kyc_verified: Joi.number().integer().valid(0, 1),
        email_verified: Joi.number().integer().valid(0, 1),
        email: Joi.string().email().max(100),
        password: Joi.string().min(6).max(50),
        role: Joi.string().valid('admin', 'user'),
        first_name: Joi.string().max(30),
        last_name: Joi.string().max(60),
        cpf: Joi.string().length(11),
        phone: Joi.string().max(20),
        birth_date: Joi.custom(date),
        country: Joi.string().max(30),
        city: Joi.string().max(50),
        state: Joi.string().max(50),
        postal_code: Joi.string().max(20),
    }),
};

const create = {
    body: Joi.object().keys({
        invite_code: Joi.string().required(),
        email: Joi.string().required().email().max(100),
        password: Joi.string().required().min(6).max(50),
        first_name: Joi.string().required().max(30),
        last_name: Joi.string().required().max(60),
        cpf: Joi.string().required().length(11)
    }),
};

const updateVoucher = {
    params: Joi.object().keys({
        id: Joi.number().integer().required(),
    }),
    body: Joi.object().keys({
        voucher: Joi.number().integer().required()
    }),
};

const deleteVoucher = {
    params: Joi.object().keys({
        id: Joi.number().integer().required(),
    })
};

module.exports = {
    getById,
    getByQuery,
    getMultilevelByLevel,
    updateMe,
    update,
    create,
    updateVoucher,
    deleteVoucher
}