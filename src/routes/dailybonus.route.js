const path = require('path');
const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const auth = require('../middlewares/auth');
const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const validate = require('../middlewares/validate');
const dailyBonusValidation = require('../validations/dailybonus.validation');
const dailyBonusModel = require('../models/dailybonus.model');
const planModel = require('../models/plan.model');

// router.get('/daily-bonus', auth('get_daily_bonus'), dailyBonusController.getAll);
// router.get('/daily-bonus/all/:days', auth('get_all_daily_bonus_days_ago'), validate(dailyBonusValidation.getAllDaysAgo), dailyBonusController.getAllDaysAgo);

router.get('/daily-bonus/:date', auth('get_daily_bonus'), validate(dailyBonusValidation.getByDate), catchAsync(async (req, res) => {
    const dailyBonus = await dailyBonusModel.getByDate(req.params.date);

    if (!dailyBonus) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Não foi encontrado nenhum registro para esta data');
    }

    res.status(httpStatus.OK).send(dailyBonus);
}));

router.post('/', auth('create_daily_bonus'), validate(dailyBonusValidation.create), catchAsync(async (req, res) => {
    const plan = await planModel.getById(req.body.plan_id);

    if (!plan) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Plano não encontrado');
    }

    await dailyBonusModel.create(req.body.plan_id, req.body.percentage, req.body.date);

    res.status(httpStatus.CREATED).send();
}));

module.exports = router;