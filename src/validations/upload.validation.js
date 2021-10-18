const Joi = require('joi');

const getAllByUserId = {
    params: Joi.object().keys({
        user_id: Joi.number().integer().required()
    }),
};

const upload = {
    body: Joi.object().keys({
        type: Joi.string().required().valid('kyc', 'proof_of_payment')
    }),
};

module.exports = {
    getAllByUserId,
    upload
}