const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const dailybonusService = require('../services/dailybonus.service');

const getByDate = catchAsync(async (req, res) => {
    const dailyBonus = await dailybonusService.getByDate(req.params.date);

    res.status(httpStatus.OK).send(dailyBonus);
});

const getAll = catchAsync(async (req, res) => {
    const dailyBonuses = await dailybonusService.getAll();

    res.status(httpStatus.OK).send(dailyBonuses);
});

const create = catchAsync(async (req, res) => {
    await dailybonusService.create(req.body.percentage, req.body.date);

    res.status(httpStatus.CREATED).send();
});

module.exports = {
    getByDate,
    getAll,
    create
}