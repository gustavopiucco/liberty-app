const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');

const userValidation = require('../../validations/user.validation');

const userController = require('../../controllers/user.controller');

const router = express.Router();

//Auth
router.post('auth/login');

//User
router.post('/users', validate(userValidation.createUser), userController.createUser);

module.exports = router;