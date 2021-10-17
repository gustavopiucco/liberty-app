const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const contractService = require('../services/contract.service');

const getByUserId = catchAsync(async (req, res) => {
    const contract = await contractService.getByUserId(req.user.id);

    res.status(httpStatus.OK).send(contract);
});

const create = catchAsync(async (req, res) => {
    await contractService.create(req.user, req.body);

    res.status(httpStatus.CREATED).send();
});

module.exports = {
    getByUserId,
    create
}