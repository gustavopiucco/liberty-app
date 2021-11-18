const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const auth = require('../middlewares/auth');
const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const validate = require('../middlewares/validate');
const { format } = require('date-fns');

router.get('/', catchAsync(async (req, res) => {

    const datetime = format(new Date(), 'yyyy-MM-dd HH:mm:ss');

    res.status(httpStatus.OK).send({ datetime });
}));

module.exports = router;