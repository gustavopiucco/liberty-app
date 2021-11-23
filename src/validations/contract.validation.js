const Joi = require('joi');
const { date } = require('./custom.validation');

const create = {
    body: Joi.object().keys({
        payment_type: Joi.string().required().valid('pix'),
        plan_id: Joi.number().integer().required()
    }),
};

const getAllByUserId = {
    params: Joi.object().keys({
        userId: Joi.number().integer().required()
    }),
};

const getAllUploads = {
    params: Joi.object().keys({
        id: Joi.number().integer().required()
    }),
};

const upload = {
    params: Joi.object().keys({
        id: Joi.number().integer().required()
    }),
};

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

const deleteById = {
    params: Joi.object().keys({
        id: Joi.number().integer().required()
    }),
};

module.exports = {
    approve,
    deny,
    getAllByUserId,
    getAllUploads,
    create,
    upload,
    deleteById
}