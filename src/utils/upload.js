const aws = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');

const s3 = new aws.S3();

const upload = multer({
    limits: { fileSize: 1024 * 1024 * 5 },
    storage: multerS3({
        s3: s3,
        bucket: 'liberty-file-uploads',
        metadata: function (req, file, cb) {
            cb(null, { fieldName: file.fieldname });
        },
        key: function (req, file, cb) {
            cb(null, Date.now().toString() + '-' + file.originalname)
        }
    }),
    fileFilter: (req, file, cb) => {
        if (!file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG|gif|GIF|pdf|PDF)$/)) {
            req.fileValidationError = 'Apenas arquivos de imagens e PDF são permitidos';
            return cb(new Error('Apenas arquivos de imagens e PDF são permitidos'), false);
        }
        cb(null, true);
    }
});

module.exports = upload;