const express = require('express');
const auth = require('../middlewares/auth');
const validate = require('../middlewares/validate');

const userRoute = require('./user.route');
const contractRoute = require('./contract.route');
const kycRoute = require('./kyc.route');
const withdawRoute = require('./withdraw.route');
const walletRoute = require('./wallet.route');
const dailyBonusRoute = require('./dailybonus.route');
const planRoute = require('./plan.route');
const reportRoute = require('./report.route');

const authValidation = require('../validations/auth.validation');
const multilevelValidation = require('../validations/multilevel.validation');

const authController = require('../controllers/auth.controller');
const multilevelController = require('../controllers/multilevel.controller');

const router = express.Router();

router.use('/users', userRoute);
router.use('/contracts', contractRoute);
router.use('/kyc', kycRoute);
router.use('/withdraws', withdawRoute);
router.use('/wallets', walletRoute);
router.use('/daily-bonus', dailyBonusRoute);
router.use('/plans', planRoute);
router.use('/reports', reportRoute);

//Auth
router.post('/auth/login', validate(authValidation.login), authController.login);
router.post('/auth/resend-email/request', validate(authValidation.resendEmailRequest), authController.resendEmailRequest);
router.post('/auth/reset-password/request', validate(authValidation.resetPasswordRequest), authController.resetPasswordRequest);
router.post('/auth/reset-password/validation', validate(authValidation.resetPasswordValidation), authController.resetPasswordValidation);
router.post('/auth/email/validation', validate(authValidation.emailValidation), authController.emailValidation);
router.patch('/auth/password', auth('update_password'), validate(authValidation.updatePassword), authController.updatePassword);

//Multilevel
router.get('/multilevel/me/:level', auth('get_multilevel'), validate(multilevelValidation.getByLevel), multilevelController.getByLevel);

module.exports = router;