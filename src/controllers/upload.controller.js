const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');

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

let middleware = upload.single('document');

const fileUpload = (req, res, next) => {
    let controller = () => {
        console.log(req.file);
        res.send('ok');
    };

    middleware(req, res, controller);
}

module.exports = {
    fileUpload
}