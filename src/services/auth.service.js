const ApiError = require('../utils/ApiError');
const httpStatus = require('http-status');
const bcrypt = require('bcryptjs');
const random = require('../utils/random');
const userModel = require('../models/user.model');
const emailValidationModel = require('../models/emailvalidation.model');
const resetPasswordValidationModel = require('../models/resetpasswordvalidation.model');
const emailService = require('../services/email.service');

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

async function resetPasswordRequest(email) {
    const user = await userModel.getByEmail(email);

    if (!user) return; //for satefy, if email is not found, just return (200 OK) to prevent emails from being known

    const resetPasswordValidationCode = random.generateString(30);

    await resetPasswordValidationModel.create(user.id, resetPasswordValidationCode);

    await emailService.sendResetPasswordValidation(user.email, resetPasswordValidationCode);
}

async function resetPasswordValidation(code, newPassword) {
    const resetValidation = await resetPasswordValidationModel.getByCode(code);

    if (!resetValidation || resetValidation.used == 1) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Código de validação incorreto ou já utilizado');
    }

    const currentDate = new Date();
    const createdAt = resetValidation.created_at;
    let expires = new Date(createdAt);
    expires.setTime(createdAt.getTime() + process.env.AUTH_RESET_PASSWORD_VALIDATION_EXPIRES_IN_MINUTES * 60 * 1000);

    if (expires <= currentDate) {
        throw new ApiError(httpStatus.GONE, 'Código expirado');
    }

    await updatePassword(resetValidation.user_id, newPassword);

    await resetPasswordValidationModel.setUsed(resetValidation.id);
}

async function emailValidation(code) {
    const emailValidation = await emailValidationModel.getByCode(code);

    if (!emailValidation || resetValidation.used == 1) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Código de validação incorreto ou já utilizado');
    }

    const currentDate = new Date();
    const createdAt = emailValidation.created_at;
    let expires = new Date(createdAt);
    expires.setTime(createdAt.getTime() + process.env.AUTH_EMAIL_VALIDATION_EXPIRES_IN_MINUTES * 60 * 1000);

    if (expires <= currentDate) {
        throw new ApiError(httpStatus.GONE, 'Código expirado');
    }

    await userModel.setEmailVerified(emailValidation.user_id);

    await emailValidationModel.setUsed(emailValidation.id);
}

module.exports = {
    loginWithEmailAndPassword,
    updatePassword,
    emailValidation,
    resetPasswordRequest,
    resetPasswordValidation
}