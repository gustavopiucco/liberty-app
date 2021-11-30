const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const auth = require('../middlewares/auth');
const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const validate = require('../middlewares/validate');
const reportValidation = require('../validations/report.validation');
const dailyBonusModel = require('../models/dailybonus.model');
const dailyBonusRecordModel = require('../models/dailybonusrecord.model');
const multilevelRecordModel = require('../models/multilevelrecords.model');
const contractModel = require('../models/contract.model');

router.get('/daily-bonus/me', auth('get_reports_me'), catchAsync(async (req, res) => {
    const reports = await dailyBonusRecordModel.getAllByUserId(req.user.id);

    res.status(httpStatus.OK).send(reports);
}));

router.get('/multilevel-bonus/me', auth('get_reports_me'), catchAsync(async (req, res) => {
    const reports = await multilevelRecordModel.getAllByUserId(req.user.id);

    res.status(httpStatus.OK).send(reports);
}));

router.get('/admin/contracts', validate(reportValidation.getContractsReports), catchAsync(async (req, res) => {
    const fromDate = req.query.from_date;
    const toDate = req.query.to_date;

    let totalContractsApproved = 0;
    let totalValueApproved = 0;

    const contracts = await contractModel.getAllBetweenDates(fromDate, toDate);

    for (contract of contracts) {
        totalContractsApproved += 1;
        totalValueApproved += contract.plan_price;
    }

    res.status(httpStatus.OK).send({
        total_contracts_approved: totalContractsApproved,
        total_value_approved: totalValueApproved
    });
}));

router.get('/admin/daily-bonus', validate(reportValidation.getContractsReports), catchAsync(async (req, res) => {
    const fromDate = req.query.from_date;
    const toDate = req.query.to_date;

    let totalDailyBonusPercentage = 0;

    const dailyBonuses = await dailyBonusModel.getAllBeetwenDate(fromDate, toDate);

    for (let dailyBonus of dailyBonuses) {
        totalDailyBonusPercentage += dailyBonus.percentage;
    }

    res.status(httpStatus.OK).send({
        total_daily_bonus_percentage: totalDailyBonusPercentage
    });
}));

module.exports = router;