const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const multilevelService = require('../services/multilevel.service');

const getByLevel = catchAsync(async (req, res) => {
    const multilevel = await multilevelService.getByLevel(req.user, req.params.level);

    res.status(httpStatus.OK).send(multilevel);
});

module.exports = {
    getByLevel
}