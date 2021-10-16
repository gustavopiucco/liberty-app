const Joi = require('joi');

const upload = {
    body: Joi.object().keys({
        file: Joi.binary().required()
    }),
};

module.exports = {
    upload
}