const path = require('path');
const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const auth = require('../middlewares/auth');
const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const validate = require('../middlewares/validate');
const multer = require('multer');
const contractValidation = require('../validations/contract.validation');
const contractModel = require('../models/contract.model');
const userModel = require('../models/user.model');
const planModel = require('../models/plan.model');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '../../public/uploads/'));
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({
    limits: { fileSize: 1024 * 1024 * 1 },
    storage,
    fileFilter: (req, file, cb) => {
        if (!file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG|gif|GIF|pdf|PDF)$/)) {
            req.fileValidationError = 'Apenas arquivos de imagens e PDF são permitidos';
            return cb(new Error('Apenas arquivos de imagens e PDF são permitidos'), false);
        }
        cb(null, true);
    }
});

router.get('/', auth('get_all_contracts'), catchAsync(async (req, res) => {
    const contracts = await contractModel.getAll();

    res.status(httpStatus.OK).send(contracts);
}));

router.get('/me', auth('get_contracts_me'), catchAsync(async (req, res) => {
    const contracts = await contractModel.getAllByUserId(req.user.id);

    res.status(httpStatus.OK).send(contracts);
}));

router.post('/', auth('create_contract'), validate(contractValidation.create), catchAsync(async (req, res) => {
    const user = await userModel.getById(req.user.id);

    if (user.kyc_verified == 0) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Você precisa validar seus documentos (KYC)');
    }

    const plan = await planModel.getById(req.body.plan_id);

    if (!plan) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Este plano não existe');
    }

    const contracts = await contractModel.getAllByUserId(req.user.id);

    for (contract of contracts) {
        if (contract.status == 'waiting_payment') {
            throw new ApiError(httpStatus.BAD_REQUEST, 'Já existe um contrato aguardando pagamento');
        }

        //permitir apenas um contrato no sistema, futuramente vai permitir mais
        if (contract.status == 'payment_confirmed') {
            throw new ApiError(httpStatus.BAD_REQUEST, 'Já existe um contrato em aberto');
        }
    }

    await contractModel.create(req.user.id, req.body.plan_id, 'pix', new Date);

    res.status(httpStatus.CREATED).send();
}));

router.patch('/:id/approve', auth('approve_contract'), validate(contractValidation.approve), catchAsync(async (req, res) => {
    const contract = await contractModel.getById(req.params.id);

    if (!contract) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Este contrato não existe');
    }

    if (contract.status == 'payment_confirmed') {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Este contrato já foi aprovado');
    }

    if (contract.status == 'payment_denied') {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Este contrato já foi negado anteriormente');
    }

    await multilevelService.payMultilevelBonus(contract.id, contract.user_id, contract.plan_price, 'contract_payment_bonus', 5, [10, 2, 1, 1, 1]);

    await contractModel.updateStatus(req.params.id, 'payment_confirmed');

    res.status(httpStatus.OK).send();
}));

router.patch('/:id/deny', auth('deny_contract'), validate(contractValidation.deny), catchAsync(async (req, res) => {
    const contract = await contractModel.getById(req.params.id);

    if (!contract) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Este contrato não existe');
    }

    if (contract.status == 'payment_denied') {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Este contrato já foi negado');
    }

    await contractModel.updateStatus(req.params.id, 'payment_denied');

    res.status(httpStatus.OK).send();
}));

router.delete('/:id', auth('delete_contract'), validate(contractValidation.deleteById), catchAsync(async (req, res) => {
    const contract = await contractModel.getById(req.params.id);

    if (!contract) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Este contrato não existe');
    }

    if (contract.status != 'waiting_payment') {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Você só pode deletar contatos que estão aguardando pagamento');
    }

    if (req.user.id != contract.user_id) {
        throw new ApiError(httpStatus.FORBIDDEN, 'Sem permissão');
    }

    await contractModel.deleteById(req.params.id);

    res.status(httpStatus.OK).send();
}));

module.exports = router;