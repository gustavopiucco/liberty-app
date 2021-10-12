const express = require('express');
const auth = require('../middlewares/auth');
const validate = require('../middlewares/validate');

const authValidation = require('../validations/auth.validation');
const userValidation = require('../validations/user.validation');
const multilevelValidation = require('../validations/multilevel.validation');

const authController = require('../controllers/auth.controller');
const userController = require('../controllers/user.controller');
const multilevelController = require('../controllers/multilevel.controller');

const router = express.Router();

//Auth
router.post('/auth/login', validate(authValidation.login), authController.login);
router.post('/auth/email/validation', validate(authValidation.emailValidation), authController.emailValidation);
router.post('/auth/reset-password/request', validate(authValidation.passwordResetRequest), authController.passwordResetRequest);
router.post('/auth/reset-password/validation', validate(authValidation.resetPasswordValidation), authController.passwordResetValidation);
router.patch('/auth/password', auth('update_password'), validate(authValidation.updatePassword), authController.updatePassword);

//User
router.post('/users', validate(userValidation.create), userController.create);
router.get('/users/me', auth('get_user'), userController.getCurrentUser);

//Multilevel
router.get('/multilevel/me/:level', auth('get_multilevel'), validate(multilevelValidation.getByLevel), multilevelController.getByLevel);

module.exports = router;