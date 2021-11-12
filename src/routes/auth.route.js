const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const auth = require('../middlewares/auth');
const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const validate = require('../middlewares/validate');
const authValidation = require('../validations/auth.validation');
const bcrypt = require('bcryptjs');
const random = require('../utils/random');
const tokenService = require('../services/token.service');
const emailService = require('../services/email.service');
const userModel = require('../models/user.model');
const emailValidationModel = require('../models/emailvalidation.model');
const resetPasswordValidationModel = require('../models/resetpasswordvalidation.model');

router.post('/login', validate(authValidation.login), catchAsync(async (req, res) => {
    const user = await userModel.getByEmail(req.body.email);

    if (!user || !(await bcrypt.compare(req.body.password, user.password_hash))) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Email ou senha incorreto');
    }

    if (user.email_verified == 0) {
        throw new ApiError(httpStatus.UNAUTHORIZED, 'Email não verificado');
    }

    const accessToken = tokenService.generateAccessToken(user.id, user.email, user.role);

    res.status(httpStatus.OK).send({
        id: user.id,
        email: user.email,
        role: user.role,
        accessToken,
    });
}));

router.patch('/password', auth('update_password'), validate(authValidation.updatePassword), catchAsync(async (req, res) => {
    let passwordHash = await bcrypt.hash(req.body.new_password, 8);
    await userModel.updatePasswordHash(req.user.id, passwordHash);

    res.status(httpStatus.OK).send();
}));

router.post('/resend-email/request', validate(authValidation.resendEmailRequest), catchAsync(async (req, res) => {
    const user = await userModel.getByEmail(req.body.email);

    if (!user) return; //for satefy, if email is not found, just return (200 OK) to prevent emails from being known

    const emailValidationCode = random.generateString(30);

    await emailValidationModel.create(user.id, emailValidationCode);

    await emailService.sendEmailValidation(req.body.email, emailValidationCode);

    res.status(httpStatus.OK).send();
}));

router.post('/reset-password/request', validate(authValidation.resetPasswordRequest), catchAsync(async (req, res) => {
    const user = await userModel.getByEmail(req.body.email);

    if (!user) return; //for satefy, if email is not found, just return (200 OK) to prevent emails from being known

    const resetPasswordValidationCode = random.generateString(30);

    await resetPasswordValidationModel.create(user.id, resetPasswordValidationCode);

    await emailService.sendResetPasswordValidation(user.email, resetPasswordValidationCode);

    res.status(httpStatus.OK).send();
}));

router.post('/reset-password/validation', validate(authValidation.resetPasswordValidation), catchAsync(async (req, res) => {
    const resetValidation = await resetPasswordValidationModel.getByCode(req.body.code);

    if (!resetValidation || resetValidation.used == 1) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Código de validação incorreto ou já utilizado');
    }

    const currentDate = new Date();
    const createdAt = new Date(resetValidation.created_at);

    let expires = new Date(createdAt);
    expires.setTime(createdAt.getTime() + process.env.AUTH_RESET_PASSWORD_VALIDATION_EXPIRES_IN_MINUTES * 60 * 1000);

    if (expires <= currentDate) {
        throw new ApiError(httpStatus.GONE, 'Código expirado');
    }

    let passwordHash = await bcrypt.hash(req.body.new_password, 8);
    await userModel.updatePasswordHash(resetValidation.user_id, passwordHash);

    await resetPasswordValidationModel.setUsed(resetValidation.id);

    res.status(httpStatus.OK).send();
}));

router.post('/email/validation', validate(authValidation.emailValidation), catchAsync(async (req, res) => {
    const emailValidation = await emailValidationModel.getByCode(req.body.code);

    if (!emailValidation || emailValidation.used == 1) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Código de validação incorreto ou já utilizado');
    }

    const currentDate = new Date();
    const createdAt = new Date(emailValidation.created_at);
    let expires = new Date(createdAt);
    expires.setTime(createdAt.getTime() + process.env.AUTH_EMAIL_VALIDATION_EXPIRES_IN_MINUTES * 60 * 1000);

    if (expires <= currentDate) {
        throw new ApiError(httpStatus.GONE, 'Código expirado');
    }

    await userModel.setEmailVerified(emailValidation.user_id);

    await emailValidationModel.setUsed(emailValidation.id);

    res.status(httpStatus.OK).send();
}));

module.exports = router;