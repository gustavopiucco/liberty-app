const express = require('express');
const auth = require('../middlewares/auth');
const validate = require('../middlewares/validate');
const multer = require('multer');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/')
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname)
    },
    fileSize: 5242880
});

const upload = multer({ storage });

const authValidation = require('../validations/auth.validation');
const userValidation = require('../validations/user.validation');
const multilevelValidation = require('../validations/multilevel.validation');

const authController = require('../controllers/auth.controller');
const userController = require('../controllers/user.controller');
const multilevelController = require('../controllers/multilevel.controller');

const router = express.Router();

//Auth
router.post('/auth/login', validate(authValidation.login), authController.login);
router.post('/auth/resend-email/request', validate(authValidation.resendEmailRequest), authController.resendEmailRequest);
router.post('/auth/reset-password/request', validate(authValidation.resetPasswordRequest), authController.resetPasswordRequest);
router.post('/auth/reset-password/validation', validate(authValidation.resetPasswordValidation), authController.resetPasswordValidation);
router.post('/auth/email/validation', validate(authValidation.emailValidation), authController.emailValidation);
router.patch('/auth/password', auth('update_password'), validate(authValidation.updatePassword), authController.updatePassword);

//User
router.post('/users', validate(userValidation.create), userController.create);
router.get('/users/me', auth('get_user'), userController.getCurrentUser);
router.post('/users/kyc/upload', auth('kyc_upload'), upload.single('kyc'), userController.kycUpload);

//Multilevel
router.get('/multilevel/me/:level', auth('get_multilevel'), validate(multilevelValidation.getByLevel), multilevelController.getByLevel);

module.exports = router;