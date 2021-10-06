const ApiError = require('../utils/ApiError');
const httpStatus = require('http-status');
const bcrypt = require('bcryptjs');
const userModel = require('../models/user.model');

async function loginWithEmailAndPassword(email, password) {
    const user = await userModel.getByEmail(email);
    if (!user || !(await bcrypt.compare(password, user.password_hash))) {
        throw new ApiError(httpStatus.UNAUTHORIZED, 'Email ou senha incorreto');
    }
    return user;
}

module.exports = {
    loginWithEmailAndPassword
}