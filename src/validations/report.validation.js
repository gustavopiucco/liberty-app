const Joi = require('joi');
const { date } = require('./custom.validation');

const contracts = {
    query: Joi.object().keys({
        from_date: Joi.string().required().custom(date),
        to_date: Joi.string().required().custom(date),
    }),
};

module.exports = {
    contracts
}