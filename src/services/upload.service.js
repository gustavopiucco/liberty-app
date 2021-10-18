const ApiError = require('../utils/ApiError');
const httpStatus = require('http-status');
const uploadModel = require('../models/upload.model');

async function getAllByUserId(userId) {
    const uploads = await uploadModel.getAllByUserId(userId);

    return uploads;
}

async function upload(loggedInUser, file, type) {
    await uploadModel.create(loggedInUser.id, type, file.filename, new Date());
}

module.exports = {
    getAllByUserId,
    upload
}