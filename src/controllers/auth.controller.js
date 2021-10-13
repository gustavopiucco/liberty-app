const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const authService = require('../services/auth.service');
const userService = require('../services/user.service');
const tokenService = require('../services/token.service');

const login = catchAsync(async (req, res) => {
    const user = await authService.loginWithEmailAndPassword(req.body.email, req.body.password);
    const accessToken = tokenService.generateAccessToken(user.id, user.email, user.role);

    res.status(httpStatus.OK).send({
        id: user.id,
        email: user.email,
        role: user.role,
        accessToken,
    });
});

const updatePassword = catchAsync(async (req, res) => {
    await authService.updatePassword(req.user.id, req.body.new_password);

    res.status(httpStatus.OK).send();
});

const resendEmailRequest = catchAsync(async (req, res) => {
    await authService.resendEmailRequest(req.body.email);

    res.status(httpStatus.OK).send();
});

const resetPasswordRequest = catchAsync(async (req, res) => {
    await authService.resetPasswordRequest(req.body.email);

    res.status(httpStatus.OK).send();
});

const resetPasswordValidation = catchAsync(async (req, res) => {
    await authService.resetPasswordValidation(req.body.code, req.body.new_password);

    res.status(httpStatus.OK).send();
});

const emailValidation = catchAsync(async (req, res) => {
    await authService.emailValidation(req.body.code);

    res.status(httpStatus.OK).send();
});

module.exports = {
    login,
    updatePassword,
    resendEmailRequest,
    resetPasswordRequest,
    resetPasswordValidation,
    emailValidation
}