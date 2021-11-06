const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const auth = require('../middlewares/auth');
const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const validate = require('../middlewares/validate');
const planModel = require('../models/plan.model');

router.get('/', auth('get_all_plans'), catchAsync(async (req, res) => {
    const plans = await planModel.getAll();

    res.status(httpStatus.OK).send(plans);
}));

module.exports = router;