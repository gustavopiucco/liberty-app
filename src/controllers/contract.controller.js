const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const contractService = require('../services/contract.service');

const getAllByUserId = catchAsync(async (req, res) => {
    const contract = await contractService.getAllByUserId(req.user.id);

    res.status(httpStatus.OK).send(contract);
});

const create = catchAsync(async (req, res) => {
    await contractService.create(req.user, req.body);

    res.status(httpStatus.CREATED).send();
});

const deleteById = catchAsync(async (req, res) => {
    await contractService.deleteById(req.user, req.params.id);

    res.status(httpStatus.CREATED).send();
});

module.exports = {
    getAllByUserId,
    create,
    deleteById
}