const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const contractService = require('../services/contract.service');

const getAll = catchAsync(async (req, res) => {
    const contracts = await contractService.getAll();

    res.status(httpStatus.OK).send(contracts);
});

const getAllByUserId = catchAsync(async (req, res) => {
    const contracts = await contractService.getAllByUserId(req.user.id);

    res.status(httpStatus.OK).send(contracts);
});

const approve = catchAsync(async (req, res) => {
    await contractService.approve(req.params.id);

    res.status(httpStatus.OK).send();
});

const deny = catchAsync(async (req, res) => {
    await contractService.deny(req.user, req.params.id);

    res.status(httpStatus.OK).send();
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
    getAll,
    getAllByUserId,
    approve,
    deny,
    create,
    deleteById
}