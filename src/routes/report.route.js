const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const auth = require('../middlewares/auth');
const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const validate = require('../middlewares/validate');
const dailyBonusRecords = require('../models/dailybonusrecord.model');
const multilevelRecords = require('../models/multilevelrecords.model');

router.get('/daily-bonus/me', auth('get_reports_me'), catchAsync(async (req, res) => {
    const reports = await dailyBonusRecords.getAllByUserId(req.user.id);

    res.status(httpStatus.OK).send(reports);
}));

router.get('/multilevel-bonus/me', auth('get_reports_me'), catchAsync(async (req, res) => {
    const reports = await multilevelRecords.getAllByUserId(req.user.id);

    res.status(httpStatus.OK).send(reports);
}));

module.exports = router;