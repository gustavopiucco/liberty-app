const path = require('path');
const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const auth = require('../middlewares/auth');
const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const validate = require('../middlewares/validate');
const { format, subDays } = require('date-fns');
const dailyBonusValidation = require('../validations/dailybonus.validation');
const dailyBonusModel = require('../models/dailybonus.model');
const planModel = require('../models/plan.model');

router.get('/', auth('get_daily_bonus'), catchAsync(async (req, res) => {
    const dailyBonuses = await dailyBonusModel.getAll();

    res.status(httpStatus.OK).send(dailyBonuses);
}));

router.get('/all/:days', auth('get_all_daily_bonus_days_ago'), validate(dailyBonusValidation.getAllDaysAgo), catchAsync(async (req, res) => {
    let data = [];
    const todayDate = new Date();
    const dailyBonuses = await dailyBonusModel.getAll();

    for (let i = 0; i < req.params.days; i++) {
        let date = subDays(todayDate, i);
        const dateFormatted = format(date, 'yyyy-MM-dd');

        let percentage = 0;

        for (let i = 0; i < dailyBonuses.length; i++) {
            if (dailyBonuses[i].date == dateFormatted) {
                percentage = dailyBonuses[i].percentage;
                break;
            }
        }

        data.push({
            date: dateFormatted,
            percentage: percentage
        });
    }

    res.status(httpStatus.OK).send(data);
}));

router.get('/:date', auth('get_daily_bonus'), validate(dailyBonusValidation.getByDate), catchAsync(async (req, res) => {
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