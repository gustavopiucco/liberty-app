const ApiError = require('../utils/ApiError');
const httpStatus = require('http-status');
const bcrypt = require('bcryptjs');
const random = require('../utils/random');
const emailService = require('../services/email.service');
const userModel = require('../models/user.model');

async function create(body) {
    if (await userModel.emailExists(body.email)) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Este email já está cadastrado');
    }

    if (await userModel.cpfExists(body.cpf)) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Este CPF já está cadastrado');
    }

    const sponsor = await userModel.getByInviteCode(body.invite_code);

    if (!sponsor) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Este patrocinador não existe');
    }

    if (sponsor.email_verified == 0) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Este patrocinador ainda não verificou o email');
    }

    const passwordHash = await bcrypt.hash(body.password, 8);
    const inviteCode = random.generateString(8);
    const emailValidationCode = random.generateString(20);

    await userModel.create(sponsor.id, inviteCode, emailValidationCode, body.email, passwordHash, body.first_name, body.last_name, body.cpf, body.phone, body.birth_date, body.country, body.city, body.state, body.postal_code);

    //enviar email com o código de validação
}

async function getById(id) {
    const user = await userModel.getById(id);

    delete user.password_hash;

    return user;
}

async function updatePassword(id, newPassword) {
    let passwordHash = await bcrypt.hash(newPassword, 8);

    await userModel.updatePasswordHash(id, passwordHash);
}

async function updateUserData(loggedInUser, firstName, lastName, phone, birthDate) {
    await userModel.updateUserData(loggedInUser.id, firstName, lastName, phone, birthDate);
}

module.exports = {
    create,
    getById,
    updatePassword,
    updateUserData
}