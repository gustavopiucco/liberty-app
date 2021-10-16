const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');

const fileUpload = catchAsync(async (req, res) => {
    res.status(httpStatus.OK).send();
});

module.exports = {
    fileUpload
}