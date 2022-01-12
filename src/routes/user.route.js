const path = require('path');
const bcrypt = require('bcryptjs');
const random = require('../utils/random');
const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const auth = require('../middlewares/auth');
const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const validate = require('../middlewares/validate');
const userValidation = require('../validations/user.validation');
const userModel = require('../models/user.model');
const contractModel = require('../models/contract.model');
const emailValidationModel = require('../models/emailvalidation.model');
const emailService = require('../services/email.service');

router.get('/me', auth('get_user'), catchAsync(async (req, res) => {
    let user;

    user = await userModel.getById(req.user.id);
    delete user.password_hash;

    const contract = await contractModel.getByUserIdAndApproved(user.id);

    if (contract) {
        user.contract = {
            status: 'approved',
            plan_price: contract.plan_price,
            total_received: contract.total_received
        };
    }
    else {
        user.contract = null;
    }

    res.status(httpStatus.OK).send(user);
}));

router.get('/query', auth('admin_get_user'), validate(userValidation.getByQuery), catchAsync(async (req, res) => {
    let user = null;

    if (Object.keys(req.query).length == 0) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Você precisa passar pelo menos uma query');
    }

    if (req.query.email) {
        user = await userModel.getByEmail(req.query.email);
    }

    if (req.query.cpf) {
        user = await userModel.getByCpf(req.query.cpf);
    }

    if (req.query.first_name) {
        user = await userModel.getByFirstName(req.query.first_name);
    }

    if (req.query.last_name) {
        user = await userModel.getByLastName(req.query.last_name);
    }

    if (!user) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Usuário não encontrado');
    }

    delete user.password_hash;

    res.status(httpStatus.OK).send(user);
}));

router.get('/:id', auth('admin_get_user'), validate(userValidation.getById), catchAsync(async (req, res) => {
    const user = await userModel.getById(req.params.id);

    delete user.password_hash;

    res.status(httpStatus.OK).send(user);
}));

router.get('/directs/me', auth('get_directs'), catchAsync(async (req, res) => {
    let directs = await userModel.getAllDirectsById(req.user.id);

    for (let i = 0; i < directs.length; i++) {
        const contracts = await contractModel.getAllByUserIdWithPlan(directs[i].id);

        directs[i].contracts = contracts;
    }

    res.status(httpStatus.OK).send(directs);
}));

router.get('/multilevel/me/:level', auth('get_multilevel'), validate(userValidation.getMultilevelByLevel), catchAsync(async (req, res) => {
    const multilevel = await userModel.getMultilevelByLevel(req.user.id, req.params.level);

    res.status(httpStatus.OK).send(multilevel);
}));

router.put('/me', auth('update_user'), validate(userValidation.updateMe), catchAsync(async (req, res) => {
    let fields = req.body;

    if (req.body.password) {
        const password_hash = await bcrypt.hash(req.body.password, 8);
        delete fields.password;
        fields.password_hash = password_hash;
    }

    await userModel.update(req.user.id, fields);

    res.status(httpStatus.OK).send();
}));

router.put('/:id', auth('admin_update_user'), validate(userValidation.update), catchAsync(async (req, res) => {
    const user = await userModel.getById(req.params.id);

    if (!user) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Este usuário não existe');
    }

    let fields = req.body;

    if (req.body.password) {
        const password_hash = await bcrypt.hash(req.body.password, 8);
        delete fields.password;
        fields.password_hash = password_hash;
    }

    await userModel.update(user.id, fields);

    res.status(httpStatus.OK).send();
}));

router.post('/', validate(userValidation.create), catchAsync(async (req, res) => {
    if (await userModel.emailExists(req.body.email)) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Este email já está cadastrado');
    }

    if (await userModel.cpfExists(req.body.cpf)) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Este CPF já está cadastrado');
    }

    const sponsor = await userModel.getByInviteCode(req.body.invite_code);

    if (!sponsor) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Este patrocinador não existe');
    }

    if (sponsor.email_verified == 0) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Este patrocinador ainda não verificou o email');
    }

    const passwordHash = await bcrypt.hash(req.body.password, 8);
    const inviteCode = random.generateString(8);
    const emailValidationCode = random.generateString(30);

    const createUserResult = await userModel.create(sponsor.id, inviteCode, req.body.email, passwordHash, req.body.first_name, req.body.last_name, req.body.cpf, new Date);

    if (process.env.NODE_ENV == 'development') {
        await userModel.setEmailVerified(createUserResult.insertId);
    }
    else {
        await emailValidationModel.create(createUserResult.insertId, emailValidationCode);
        await emailService.sendEmailValidation(req.body.email, emailValidationCode);
    }

    res.status(httpStatus.OK).send();
}));

router.put('/:id/voucher', auth('update_voucher'), validate(userValidation.updateVoucher), catchAsync(async (req, res) => {
    const user = await userModel.getById(req.params.id);

    if (!user) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Este usuário não existe');
    }

    const contracts = await contractModel.getAllByUserIdAndApproved(user.id);

    if (contracts.length > 0) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'O usuário não pode ter nenhum contrato ativo');
    }

    if (user.role == 'admin') {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Admin não pode ter voucher');
    }

    if (user.role == 'voucher') {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Este usuário já tem um voucher ativo');
    }

    await userModel.updateVoucher(req.params.id, req.body.voucher);

    res.status(httpStatus.OK).send();
}));

router.delete('/:id/voucher', auth('delete_voucher'), validate(userValidation.deleteVoucher), catchAsync(async (req, res) => {
    const user = await userModel.getById(req.params.id);

    if (!user) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Este usuário não existe');
    }

    if (user.role == 'admin') {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Admin não pode ter voucher');
    }

    if (user.role != 'voucher') {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Este usuário não tem um voucher para ser deletado');
    }

    await userModel.deleteVoucher(req.params.id);

    res.status(httpStatus.OK).send();
}));

module.exports = router;