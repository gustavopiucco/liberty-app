const ApiError = require('../utils/ApiError');
const httpStatus = require('http-status');
const bcrypt = require('bcryptjs');
const userModel = require('../models/user.model');

async function create(body) {
    if (await userModel.emailExists(body.email)) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Este email já está cadastrado');
    }

    if (await userModel.cpfExists(body.cpf)) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Este CPF já está cadastrado');
    }

    const passwordHash = await bcrypt.hash(body.password, 8);
    const inviteCode = generateRandomInviteCode();

    await userModel.create(1, inviteCode, body.email, passwordHash, body.firstName, body.lastName, body.cpf, body.phone, body.birthDate, body.country, body.city, body.state, body.postalCode);
}

function generateRandomInviteCode() {
    const length = 8;
    const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';

    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }

    return result;
}

module.exports = {
    create,
    generateRandomInviteCode
}