const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const authService = require('../services/auth.service');
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

module.exports = {
    login
}