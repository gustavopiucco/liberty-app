const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');

const authValidation = require('../../validations/auth.validation');
const userValidation = require('../../validations/user.validation');

const authController = require('../../controllers/auth.controller');
const userController = require('../../controllers/user.controller');

const router = express.Router();

//Auth
router.post('/auth/login', validate(authValidation.login), authController.login);

//User
router.post('/users', validate(userValidation.create), userController.create);

//Multilevel
router.get('/multilevel', validate(), );

module.exports = router;