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

const requestPasswordReset = catchAsync(async (req, res) => {
    await authService.requestPasswordReset(req.body.email);

    res.status(httpStatus.OK).send();
});

const emailValidation = catchAsync(async (req, res) => {
    await authService.emailValidation(req.body.code);

    res.status(httpStatus.OK).send();
});

const passwordResetValidation = catchAsync(async (req, res) => {
    await authService.passwordResetValidation(req.body.code);

    res.status(httpStatus.OK).send();
});

module.exports = {
    login,
    emailValidation,
    updatePassword,
    requestPasswordReset,
    passwordResetValidation
}