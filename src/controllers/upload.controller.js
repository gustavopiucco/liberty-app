const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');

const fileUpload = catchAsync(async (req, res) => {
    console.log(req.file);

    res.status(httpStatus.OK).send();
});

module.exports = {
    fileUpload
}