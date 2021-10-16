const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const path = require('path');
const multer = require('multer');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '../../public/uploads/'));
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({
    limits: { fileSize: 1024 * 1024 * 5 },
    storage
});

const uploadMiddleware = (fileName) => (req, res, next) => {
    upload.single(fileName)(req, res, (err) => {
        if (err)
            next(new ApiError(httpStatus.BAD_REQUEST, err));
        else
            next();
    });
};

module.exports = uploadMiddleware;