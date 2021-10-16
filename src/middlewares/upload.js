const path = require('path');
const multer = require('multer');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '../../public/uploads/'));
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    },
    fileSize: 5242880
});

const upload = multer({ storage });

const uploadMiddleware = (fileName) => (req, res, next) => {
    return upload.single(fileName)(req, res, next);
};

module.exports = uploadMiddleware;