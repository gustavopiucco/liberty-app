const Joi = require('joi');
const { date } = require('./custom.validation');

const create = {
    body: Joi.object().keys({

    }),
};

module.exports = {
    create
}