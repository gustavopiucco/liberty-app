const path = require('path');
const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const auth = require('../middlewares/auth');
const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const validate = require('../middlewares/validate');
const multer = require('multer');
const kycValidation = require('../validations/kyc.validation');
const kycRequestModel = require('../models/kycrequest.model');
const kycRequestUploadModel = require('../models/kycrequestupload.model');
const userModel = require('../models/user.model');

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
    storage,
    fileFilter: (req, file, cb) => {
        if (!file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG|gif|GIF|pdf|PDF)$/)) {
            req.fileValidationError = 'Apenas arquivos de imagens e PDF são permitidos';
            return cb(new Error('Apenas arquivos de imagens e PDF são permitidos'), false);
        }
        cb(null, true);
    }
});

router.get('/me', auth('get_kyc'), catchAsync(async (req, res) => {
    const kycRequests = await kycRequestModel.getByUserId(req.user.id);

    res.status(httpStatus.OK).send(kycRequests);
}));

router.get('/', auth('get_all_kyc'), catchAsync(async (req, res) => {
    const kycRequests = await kycRequestModel.getAll();

    console.log(kycRequests)

    for (let i = 0; i < kycRequests.length; i++) {
        const kycRequestsUploads = await kycRequestUploadModel.getAllByKycRequestId(kycRequests[i].id);
        kycRequests[i].uploads = kycRequestsUploads;
    }

    res.status(httpStatus.OK).send(kycRequests);
}));

router.patch('/:id/approve', auth('approve_kyc'), validate(kycValidation.approve), catchAsync(async (req, res) => {
    const kycRequest = await kycRequestModel.getById(req.params.id);

    if (!kycRequest) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Este KYC não existe');
    }

    if (kycRequest.status == 'approved') {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Este KYC já foi aprovado');
    }

    if (kycRequest.status == 'denied') {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Este KYC já foi negado');
    }

    await userModel.setKycVerified(kycRequest.user_id);

    await kycRequestModel.updateStatus(req.params.id, 'approved');

    res.status(httpStatus.OK).send();
}));

router.patch('/:id/deny', auth('deny_kyc'), validate(kycValidation.approve), catchAsync(async (req, res) => {
    const kycRequest = await kycRequestModel.getById(req.params.id);

    if (!kycRequest) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Este KYC não existe');
    }

    if (kycRequest.status == 'denied') {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Este KYC já foi negado');
    }

    await kycRequestModel.updateStatus(req.params.id, 'denied');

    res.status(httpStatus.OK).send();
}));

router.post('/', auth('create_kyc'), upload.array('files', 3), catchAsync(async (req, res) => {
    const kycRequests = await kycRequestModel.getByUserId(req.user.id);

    for (request of kycRequests) {
        if (request.status == 'approved') {
            throw new ApiError(httpStatus.BAD_REQUEST, 'Sua solicitação foi aprovada');
        }

        if (request.status == 'pending') {
            throw new ApiError(httpStatus.BAD_REQUEST, 'Você já tem uma solicitação pendente');
        }
    }

    const insertId = await kycRequestModel.create(req.user.id, 'pending', new Date());

    for (let file of req.files) {
        await kycRequestUploadModel.create(insertId, file.filename, new Date());
    }

    res.status(httpStatus.CREATED).send();
}));

module.exports = router;