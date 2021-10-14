const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const userService = require('../services/user.service');

const create = catchAsync(async (req, res) => {
    await userService.create(req.body);

    res.status(httpStatus.CREATED).send();
});

const getCurrentUser = catchAsync(async (req, res) => {
    const user = await userService.getById(req.user.id);

    res.status(httpStatus.OK).send(user);
});

const kycUpload = catchAsync(async (req, res) => {
    await userService.kycUpload(req.file);

    res.status(httpStatus.OK).send();
});

module.exports = {
    create,
    getCurrentUser,
    kycUpload
}