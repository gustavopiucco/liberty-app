const ApiError = require('../utils/ApiError');
const httpStatus = require('http-status');
const bcrypt = require('bcryptjs');
const random = require('../utils/random');
const emailService = require('../services/email.service');
const userModel = require('../models/user.model');
const emailValidationModel = require('../models/emailvalidation.model');

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
    const emailValidationCode = random.generateString(30);

    const createUserResult = await userModel.create(sponsor.id, inviteCode, body.email, passwordHash, body.first_name, body.last_name, body.cpf, body.phone, body.birth_date, body.country, body.city, body.state, body.postal_code, new Date);

    if (process.env.NODE_ENV == 'development') {
        await userModel.setEmailVerified(createUserResult.insertId);
    }
    else {
        await emailValidationModel.create(createUserResult.insertId, emailValidationCode);

        await emailService.sendEmailValidation(body.email, emailValidationCode);
    }
}

async function getById(id) {
    const user = await userModel.getById(id);

    delete user.password_hash;

    return user;
}

async function getAllDirectsById(id) {
    const directs = await userModel.getAllDirectsById(id);

    return directs;
}

module.exports = {
    create,
    getById,
    getAllDirectsById
}