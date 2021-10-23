const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const userService = require('../services/user.service');

const create = catchAsync(async (req, res) => {
    await userService.create(req.body);

    res.status(httpStatus.CREATED).send();
});

const getMe = catchAsync(async (req, res) => {
    const user = await userService.getById(req.user.id);

    res.status(httpStatus.OK).send(user);
});

const getById = catchAsync(async (req, res) => {
    const user = await userService.getById(req.params.id);

    res.status(httpStatus.OK).send(user);
});

const getAllDirects = catchAsync(async (req, res) => {
    const directs = await userService.getAllDirectsById(req.user.id);

    res.status(httpStatus.OK).send(directs);
});

module.exports = {
    create,
    getMe,
    getById,
    getAllDirects
}