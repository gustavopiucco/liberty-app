const ApiError = require('../utils/ApiError');
const httpStatus = require('http-status');
const uploadModel = require('../models/upload.model');

async function getAllByUserId(userId) {
    const uploads = await uploadModel.getAllByUserId(userId);

    return uploads;
}

async function upload(loggedInUser, file, type) {
    if (!file) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Arquivo não enviado');
    }

    //se for do tipo kyc, entao cria um registro em uma tabela 'kyc' pra informar que foi criado e pra posteriormente aprovar ou negar

    await uploadModel.create(loggedInUser.id, type, file.filename, new Date());
}

module.exports = {
    getAllByUserId,
    upload
}