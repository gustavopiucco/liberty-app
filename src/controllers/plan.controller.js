const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const planService = require('../services/plan.service');

const getAll = catchAsync(async (req, res) => {
    const plans = await planService.getAll();

    res.status(httpStatus.OK).send(plans);
});

module.exports = {
    getAll
}