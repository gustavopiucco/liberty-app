const Joi = require('joi');
const { date } = require('./custom.validation');

const create = {
    body: Joi.object().keys({
        plan_id: Joi.number().integer().required()
    }),
};

module.exports = {
    create
}