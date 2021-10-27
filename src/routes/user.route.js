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

// router.get('/users/directs/me', auth('get_directs'), userController.getAllDirects);

router.get('/me', auth('get_user'), catchAsync(async (req, res) => {
    const user = await userModel.getById(req.user.id);

    res.status(httpStatus.OK).send(user);
}));

router.get('/:id', auth('admin_get_user'), validate(userValidation.getById), catchAsync(async (req, res) => {
    const user = await userModel.getById(req.params.id);

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

    const createUserResult = await userModel.create(sponsor.id, inviteCode, req.body.email, passwordHash, req.body.first_name, req.body.last_name, req.body.cpf, req.body.phone, req.body.birth_date, req.body.country, req.body.city, req.body.state, req.body.postal_code, new Date);

    if (process.env.NODE_ENV == 'development') {
        await userModel.setEmailVerified(createUserResult.insertId);
    }
    else {
        await emailValidationModel.create(createUserResult.insertId, emailValidationCode);
        await emailService.sendEmailValidation(req.body.email, emailValidationCode);
    }

    res.status(httpStatus.OK).send();
}));

module.exports = router;