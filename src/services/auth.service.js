const ApiError = require('../utils/ApiError');
const httpStatus = require('http-status');
const bcrypt = require('bcryptjs');
const userModel = require('../models/user.model');

async function loginWithEmailAndPassword(email, password) {
    const user = await userModel.getByEmail(email);
    if (!user || !(await bcrypt.compare(password, user.password_hash))) {
        throw new ApiError(httpStatus.UNAUTHORIZED, 'Email ou senha incorreto');
    }
    return user;
}

async function updatePassword(id, newPassword) {
    let passwordHash = await bcrypt.hash(newPassword, 8);

    await userModel.updatePasswordHash(id, passwordHash);
}

async function emailConfirmation(code) {
    if (!await userModel.emailConfirmationCodeExists(code)) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Código de validação incorreto');
    }

    await userModel.updateEmailConfirmation(code);
}

module.exports = {
    loginWithEmailAndPassword,
    updatePassword,
    emailConfirmation
}