const ApiError = require('../utils/ApiError');
const httpStatus = require('http-status');
const bcrypt = require('bcryptjs');
const userModel = require('../models/user.model');
const authValidationsModel = require('../models/authvalidations.model');

async function loginWithEmailAndPassword(email, password) {
    const user = await userModel.getByEmail(email);

    if (!user || !(await bcrypt.compare(password, user.password_hash))) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Email ou senha incorreto');
    }

    if (user.email_verified == 0) {
        throw new ApiError(httpStatus.UNAUTHORIZED, 'Email não verificado');
    }

    return user;
}

async function updatePassword(id, newPassword) {
    let passwordHash = await bcrypt.hash(newPassword, 8);

    await userModel.updatePasswordHash(id, passwordHash);
}

async function emailValidation(code) {
    const emailAuthValidation = await authValidationsModel.getByCode('email', code);

    if (!emailAuthValidation) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Código de validação incorreto ou já utilizado');
    }

    const currentDate = new Date();
    const createdAt = emailAuthValidation.created_at;
    let expires = new Date(createdAt);
    expires.setTime(createdAt.getTime() + process.env.AUTH_EMAIL_VALIDATION_EXPIRES_IN_MINUTES * 60 * 1000);

    if (expires <= currentDate) {
        throw new ApiError(httpStatus.GONE, 'Código expirado');
    }

    await userModel.setEmailVerified(emailAuthValidation.user_id);

    await authValidationsModel.deleteById(emailAuthValidation.id);
}

module.exports = {
    loginWithEmailAndPassword,
    updatePassword,
    emailValidation
}