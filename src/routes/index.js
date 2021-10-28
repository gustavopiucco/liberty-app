const express = require('express');
const auth = require('../middlewares/auth');
const validate = require('../middlewares/validate');

const userRoute = require('./user.route');
const contractRoute = require('./contract.route');
const kycRoute = require('./kyc.route');
const withdawRoute = require('./withdraw.route');

const authValidation = require('../validations/auth.validation');
const multilevelValidation = require('../validations/multilevel.validation');
const dailyBonusValidation = require('../validations/dailybonus.validation');

const authController = require('../controllers/auth.controller');
const multilevelController = require('../controllers/multilevel.controller');
const planController = require('../controllers/plan.controller');
const dailyBonusController = require('../controllers/dailybonus.controller');

const router = express.Router();

router.use('/users', userRoute);
router.use('/contracts', contractRoute);
router.use('/kyc', kycRoute);
router.use('/withdraws', withdawRoute);

//Auth
router.post('/auth/login', validate(authValidation.login), authController.login);
router.post('/auth/resend-email/request', validate(authValidation.resendEmailRequest), authController.resendEmailRequest);
router.post('/auth/reset-password/request', validate(authValidation.resetPasswordRequest), authController.resetPasswordRequest);
router.post('/auth/reset-password/validation', validate(authValidation.resetPasswordValidation), authController.resetPasswordValidation);
router.post('/auth/email/validation', validate(authValidation.emailValidation), authController.emailValidation);
router.patch('/auth/password', auth('update_password'), validate(authValidation.updatePassword), authController.updatePassword);

//Multilevel
router.get('/multilevel/me/:level', auth('get_multilevel'), validate(multilevelValidation.getByLevel), multilevelController.getByLevel);

//Plans
router.get('/plans', auth('get_all_plans'), planController.getAll);

//Daily Bonus
router.get('/daily-bonus/:date', auth('get_daily_bonus'), validate(dailyBonusValidation.getByDate), dailyBonusController.getByDate);
router.get('/daily-bonus', auth('get_daily_bonus'), dailyBonusController.getAll);
router.get('/daily-bonus/all/:days', auth('get_all_daily_bonus_days_ago'), validate(dailyBonusValidation.getAllDaysAgo), dailyBonusController.getAllDaysAgo);
router.post('/daily-bonus', auth('create_daily_bonus'), validate(dailyBonusValidation.create), dailyBonusController.create);

module.exports = router;