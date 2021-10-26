const express = require('express');
const auth = require('../middlewares/auth');
const validate = require('../middlewares/validate');
const upload = require('../middlewares/upload');

const contractRoute = require('./contract.route');
const kycRoute = require('./kyc.route');

const authValidation = require('../validations/auth.validation');
const userValidation = require('../validations/user.validation');
const uploadValidation = require('../validations/upload.validation');
const multilevelValidation = require('../validations/multilevel.validation');
const dailyBonusValidation = require('../validations/dailybonus.validation');

const authController = require('../controllers/auth.controller');
const userController = require('../controllers/user.controller');
const uploadController = require('../controllers/upload.controller');
const multilevelController = require('../controllers/multilevel.controller');
const planController = require('../controllers/plan.controller');
const dailyBonusController = require('../controllers/dailybonus.controller');

const router = express.Router();

router.use('/contracts', contractRoute);
router.use('/kyc', kycRoute);

//Auth
router.post('/auth/login', validate(authValidation.login), authController.login);
router.post('/auth/resend-email/request', validate(authValidation.resendEmailRequest), authController.resendEmailRequest);
router.post('/auth/reset-password/request', validate(authValidation.resetPasswordRequest), authController.resetPasswordRequest);
router.post('/auth/reset-password/validation', validate(authValidation.resetPasswordValidation), authController.resetPasswordValidation);
router.post('/auth/email/validation', validate(authValidation.emailValidation), authController.emailValidation);
router.patch('/auth/password', auth('update_password'), validate(authValidation.updatePassword), authController.updatePassword);

//Upload
router.get('/uploads/user/:user_id', auth('get_all_uploads'), validate(uploadValidation.getAllByUserId), uploadController.getAllByUserId);
router.post('/uploads', auth('upload'), upload('file'), validate(uploadValidation.upload), uploadController.upload);

//Users
router.post('/users', validate(userValidation.create), userController.create);
router.get('/users/me', auth('get_user'), userController.getMe);
router.get('/users/:id', auth('admin_get_user'), validate(userValidation.getById), userController.getById);
router.get('/users/directs/me', auth('get_directs'), userController.getAllDirects);

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