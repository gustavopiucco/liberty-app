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

router.put('/:id', auth('admin_update_user'), validate(userValidation.update), catchAsync(async (req, res) => {
    const user = await userModel.getById(req.params.id);

    const kycVerified = (req.body.kyc_verified != undefined) ? req.body.kyc_verified : user.kyc_verified;
    const emailVerified = (req.body.email_verified != undefined) ? req.body.email_verified : user.email_verified;
    const email = (req.body.email != undefined) ? req.body.email : user.email;
    const passwordHash = (req.body.password != undefined) ? await bcrypt.hash(req.body.password, 8) : user.password_hash;
    const role = (req.body.role) ? req.body.role : user.role;
    const firstName = (req.body.first_name) ? req.body.first_name : user.first_name;
    const lastName = (req.body.last_name) ? req.body.last_name : user.last_name;
    const cpf = (req.body.cpf) ? req.body.cpf : user.cpf;
    const phone = (req.body.phone) ? req.body.phone : user.phone;
    const birthDate = (req.body.birth_date) ? req.body.birth_date : user.birth_date;
    const country = (req.body.country) ? req.body.country : user.country;
    const city = (req.body.city) ? req.body.city : user.city;
    const state = (req.body.state) ? req.body.state : user.state;
    const postalCode = (req.body.postal_code) ? req.body.postal_code : user.postal_code;

    await userModel.update(user.id, kycVerified, emailVerified, email, passwordHash, role, firstName, lastName, cpf, phone, birthDate, country, city, state, postalCode);

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