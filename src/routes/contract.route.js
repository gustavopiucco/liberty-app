const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const auth = require('../middlewares/auth');
const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const validate = require('../middlewares/validate');
const upload = require('../utils/upload');
const contractValidation = require('../validations/contract.validation');
const contractModel = require('../models/contract.model');
const userModel = require('../models/user.model');
const planModel = require('../models/plan.model');
const contractUploadModel = require('../models/contractupload.model');
const multilevelService = require('../services/multilevel.service');

router.get('/:id/uploads', auth('get_all_uploads'), validate(contractValidation.getAllUploads), catchAsync(async (req, res) => {
    const uploads = await contractUploadModel.getAllByContractId(req.params.id);

    res.status(httpStatus.OK).send(uploads);
}));

router.post('/:id/upload', upload.array('files', 3), auth('upload_contract'), validate(contractValidation.upload), catchAsync(async (req, res) => {
    if (req.files.length == 0) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Nenhum arquivo foi enviado');
    }

    const contract = await contractModel.getById(req.params.id);

    if (!contract) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Este contrato não existe');
    }

    if (req.user.id != contract.user_id) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Sem permissão');
    }

    if (contract.status != 'pending') {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Este contrato não está pendente');
    }

    for (let file of req.files) {
        await contractUploadModel.create(req.params.id, file.location, new Date());
    }

    res.status(httpStatus.OK).send();
}));

router.get('/', auth('get_all_contracts'), catchAsync(async (req, res) => {
    const contracts = await contractModel.getAll();

    res.status(httpStatus.OK).send(contracts);
}));

router.get('/user/:userId', auth('get_all_contracts_by_user_id'), validate(contractValidation.getAllByUserId), catchAsync(async (req, res) => {
    const contracts = await contractModel.getAllByUserId(req.params.userId);

    res.status(httpStatus.OK).send(contracts);
}));

router.get('/me', auth('get_contracts_me'), catchAsync(async (req, res) => {
    const contracts = await contractModel.getAllByUserId(req.user.id);

    res.status(httpStatus.OK).send(contracts);
}));

router.post('/', auth('create_contract'), validate(contractValidation.create), catchAsync(async (req, res) => {
    const plan = await planModel.getById(req.body.plan_id);

    if (!plan) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Este plano não existe');
    }

    const contracts = await contractModel.getAllByUserId(req.user.id);

    for (contract of contracts) {
        if (contract.status == 'pending') {
            throw new ApiError(httpStatus.BAD_REQUEST, 'Já existe um contrato pendente');
        }

        //permitir apenas um contrato no sistema, futuramente vai permitir mais
        if (contract.status == 'approved') {
            throw new ApiError(httpStatus.BAD_REQUEST, 'Já existe um contrato em aberto');
        }
    }

    const insertId = await contractModel.create(req.user.id, req.body.plan_id, 'pending', 'pix', new Date);

    res.status(httpStatus.CREATED).send({ id: insertId });
}));

router.post('/:id/approve', auth('approve_contract'), validate(contractValidation.approve), catchAsync(async (req, res) => {
    const contract = await contractModel.getById(req.params.id);

    if (!contract) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Este contrato não existe');
    }

    if (contract.status == 'approved') {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Este contrato já foi aprovado');
    }

    if (contract.status != 'pending') {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Este contrato não está pendente');
    }

    await multilevelService.payMultilevelBonus(contract.id, contract.user_id, contract.plan_price, 'contract_payment_bonus', 5, [10, 2, 1, 1, 1]);

    await contractModel.updateStatus(req.params.id, 'approved');

    res.status(httpStatus.OK).send();
}));

router.post('/:id/deny', auth('deny_contract'), validate(contractValidation.deny), catchAsync(async (req, res) => {
    const contract = await contractModel.getById(req.params.id);

    if (!contract) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Este contrato não existe');
    }

    if (contract.status == 'denied') {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Este contrato já foi negado');
    }

    if (contract.status != 'pending') {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Este contrato não está pendente');
    }

    await contractModel.updateStatus(req.params.id, 'denied');

    res.status(httpStatus.OK).send();
}));

router.delete('/:id', auth('delete_contract'), validate(contractValidation.deleteById), catchAsync(async (req, res) => {
    const contract = await contractModel.getById(req.params.id);

    if (!contract) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Este contrato não existe');
    }

    if (contract.status != 'pending') {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Você só pode deletar contratos que estão pendentes');
    }

    if (req.user.id != contract.user_id) {
        throw new ApiError(httpStatus.FORBIDDEN, 'Sem permissão');
    }

    await contractUploadModel.deleteByContractId(req.params.id);
    await contractModel.deleteById(req.params.id);

    res.status(httpStatus.OK).send();
}));

module.exports = router;