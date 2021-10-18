const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const uploadService = require('../services/upload.service');

const getAllByUserId = catchAsync(async (req, res) => {
    const uploads = await uploadService.getAllByUserId(req.params.user_id);

    res.status(httpStatus.OK).send(uploads);
});

const upload = catchAsync(async (req, res) => {
    await uploadService.upload(req.user, req.file, req.body.type);

    res.status(httpStatus.OK).send();
});

module.exports = {
    getAllByUserId,
    upload
}