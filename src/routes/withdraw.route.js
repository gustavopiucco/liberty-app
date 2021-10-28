const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const auth = require('../middlewares/auth');
const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const validate = require('../middlewares/validate');
const withdrawValidation = require('../validations/withdraw.validation');
const withdrawModel = require('../models/withdraw.model');
const userModel = require('../models/user.model');

router.get('/me', auth('get_withdraws'), catchAsync(async (req, res) => {
    const withdraws = await withdrawModel.getAllByUserId(req.user.id);

    res.status(httpStatus.OK).send(withdraws);
}));

router.get('/', auth('get_all_withdraws'), catchAsync(async (req, res) => {
    const withdraws = await withdrawModel.getAll(req.user.id);

    res.status(httpStatus.OK).send(withdraws);
}));

router.patch('/:id/approve', auth('approve_withdraw'), validate(withdrawValidation.getById), catchAsync(async (req, res) => {
    const withdraw = await withdrawModel.getById(req.params.id);

    if (!withdraw) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Esta solicitação de saque não existe');
    }

    if (withdraw.status == 'paid') {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Esta solicitação de saque já foi paga');
    }

    await withdrawModel.setPaid(withdraw.id);

    res.status(httpStatus.OK).send();
}));

router.post('/', auth('create_withdraw'), validate(withdrawValidation.create), catchAsync(async (req, res) => {
    const user = await userModel.getById(req.user.id);

    if (req.body.value < 100) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'O saque deve ser maior que R$ 100,00');
    }

    if (user.available_balance < req.body.value) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Saldo insuficiente');
    }

    await userModel.subtractAvailableBalance(user.id, req.body.value);
    await withdrawModel.create(user.id, 'pending', req.body.value, new Date());

    res.status(httpStatus.CREATED).send();
}));

module.exports = router;