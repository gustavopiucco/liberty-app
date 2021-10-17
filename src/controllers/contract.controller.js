const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const contractService = require('../services/contract.service');

const create = catchAsync(async (req, res) => {
    await contractService.create(req.user, req.body);

    res.status(httpStatus.CREATED).send();
});

module.exports = {
    create,
}