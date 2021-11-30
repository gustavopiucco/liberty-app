const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const auth = require('../middlewares/auth');
const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const validate = require('../middlewares/validate');
const reportValidation = require('../validations/report.validation');
const userModel = require('../models/user.model');
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
        total_contracts_approved: parseFloat((totalContractsApproved).toFixed(4)),
        total_value_approved: parseFloat((totalValueApproved).toFixed(4))
    });
}));

router.get('/admin/daily-bonus', validate(reportValidation.getContractsReports), catchAsync(async (req, res) => {
    const fromDate = req.query.from_date;
    const toDate = req.query.to_date;

    let totalDailyBonusPercentage = 0;
    let totalDailyBonusValue = 0;

    const dailyBonuses = await dailyBonusModel.getAllBeetwenDate(fromDate, toDate);
    const dailyBonusesRecords = await dailyBonusRecordModel.getAllBeetwenDate(fromDate, toDate);

    for (let dailyBonus of dailyBonuses) {
        totalDailyBonusPercentage += dailyBonus.percentage;
    }

    for (let dailyBonus of dailyBonusesRecords) {
        totalDailyBonusValue += dailyBonus.value;
    }

    res.status(httpStatus.OK).send({
        total_daily_bonus_percentage: parseFloat((totalDailyBonusPercentage).toFixed(4)),
        total_daily_bonus_value: parseFloat((totalDailyBonusValue).toFixed(4))
    });
}));

router.get('/admin/multilevel-bonus', validate(reportValidation.getContractsReports), catchAsync(async (req, res) => {
    const fromDate = req.query.from_date;
    const toDate = req.query.to_date;

    const multilevelRecords = await multilevelRecordModel.getAllBeetwenDate(fromDate, toDate);

    let totalMultilevelValue = 0;
    let totalMultilevelDailyBonusValue = 0;
    let totalMultilevelContractPaymentBonusValue = 0;

    for (let record of multilevelRecords) {
        totalMultilevelValue += record.value;

        if (record.type == 'daily_bonus')
            totalMultilevelDailyBonusValue += record.value;
        else
            totalMultilevelContractPaymentBonusValue += record.value;
    }

    res.status(httpStatus.OK).send({
        total_multilevel_value: parseFloat((totalMultilevelValue).toFixed(4)),
        total_multilevel_daily_bonus_value: parseFloat((totalMultilevelDailyBonusValue).toFixed(4)),
        total_multilevel_contract_payment_bonus_value: parseFloat((totalMultilevelContractPaymentBonusValue).toFixed(4))
    });
}));

router.get('/admin/balances', catchAsync(async (req, res) => {
    const balances = await userModel.getTotalBalances();

    res.status(httpStatus.OK).send(balances);
}));

module.exports = router;