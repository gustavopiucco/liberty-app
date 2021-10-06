const ApiError = require('../utils/ApiError');
const httpStatus = require('http-status');
const bcrypt = require('bcryptjs');
const userModel = require('../models/user.model');

async function createUser(body) {
    if (await userModel.emailExists(body.email)) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Este email já está cadastrado');
    }

    if (await userModel.cpfExists(body.cpf)) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Este CPF já está cadastrado');
    }

    const passwordHash = await bcrypt.hash(body.password, 8);
    await userModel.createUser(body.email, passwordHash, body.firstName, body.lastName, body.cpf, body.phone);
}

module.exports = {
    createUser
}