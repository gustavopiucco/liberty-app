const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const auth = require('../middlewares/auth');
const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const validate = require('../middlewares/validate');
const walletValidation = require('../validations/wallet.validation');
const walletModel = require('../models/wallet.model');

router.get('/me', auth('get_wallet_me'), catchAsync(async (req, res) => {
    const wallets = await walletModel.getAllByUserId(req.user.id);

    res.status(httpStatus.OK).send(wallets);
}));

router.post('/', auth('create_wallet'), validate(walletValidation.create), catchAsync(async (req, res) => {
    const wallets = await walletModel.getAllByUserId(req.user.id);

    if (wallets.length > 0) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'No momento você só pode cadastrar uma carteira para recebimento');
    }

    await walletModel.create(req.user.id, req.body.type, req.body.value, new Date());

    res.status(httpStatus.CREATED).send();
}));

router.delete('/:id', auth('delete_wallet'), validate(walletValidation.deleteById), catchAsync(async (req, res) => {
    const wallet = await walletModel.getById(req.params.id);

    if (!wallet) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Está carteira não existe');
    }

    if (wallet.user_id != req.user.id) {
        throw new ApiError(httpStatus.FORBIDDEN, 'Sem permissão');
    }

    await walletModel.deleteById(req.params.id);

    res.status(httpStatus.OK).send();
}));

module.exports = router;