const express = require('express');
const auth = require('../middlewares/auth');
const validate = require('../middlewares/validate');
const upload = require('../middlewares/upload');

const authValidation = require('../validations/auth.validation');
const userValidation = require('../validations/user.validation');
const uploadValidation = require('../validations/upload.validation');
const multilevelValidation = require('../validations/multilevel.validation');
const contractValidation = require('../validations/contract.validation');

const authController = require('../controllers/auth.controller');
const userController = require('../controllers/user.controller');
const uploadController = require('../controllers/upload.controller');
const multilevelController = require('../controllers/multilevel.controller');
const planController = require('../controllers/plan.controller');
const contractController = require('../controllers/contract.controller');

const router = express.Router();

//Auth
router.post('/auth/login', validate(authValidation.login), authController.login);
router.post('/auth/resend-email/request', validate(authValidation.resendEmailRequest), authController.resendEmailRequest);
router.post('/auth/reset-password/request', validate(authValidation.resetPasswordRequest), authController.resetPasswordRequest);
router.post('/auth/reset-password/validation', validate(authValidation.resetPasswordValidation), authController.resetPasswordValidation);
router.post('/auth/email/validation', validate(authValidation.emailValidation), authController.emailValidation);
router.patch('/auth/password', auth('update_password'), validate(authValidation.updatePassword), authController.updatePassword);

//Upload
router.post('/upload', auth('upload'), upload('file'), uploadController.fileUpload);

//Users
router.post('/users', validate(userValidation.create), userController.create);
router.get('/users/me', auth('get_user'), userController.getCurrentUser);

//Multilevel
router.get('/multilevel/me/:level', auth('get_multilevel'), validate(multilevelValidation.getByLevel), multilevelController.getByLevel);

//Plans
router.get('/plans', auth('get_all_plans'), planController.getAll);

//Contracts
router.post('/contracts', auth('create_contract'), validate(contractValidation.create), contractController.create);
router.get('/contracts/user/me', auth('get_contracts'), contractController.getByUserId);

module.exports = router;