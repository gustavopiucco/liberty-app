const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const userService = require('../services/user.service');

const createUser = catchAsync(async (req, res) => {
    await userService.createUser(req.body);
    res.status(httpStatus.CREATED).send();
});

module.exports = {
    createUser
}