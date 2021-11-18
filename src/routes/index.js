const express = require('express');

const authRoute = require('./auth.route');
const userRoute = require('./user.route');
const contractRoute = require('./contract.route');
const kycRoute = require('./kyc.route');
const withdawRoute = require('./withdraw.route');
const walletRoute = require('./wallet.route');
const dailyBonusRoute = require('./dailybonus.route');
const planRoute = require('./plan.route');
const reportRoute = require('./report.route');
const serverInfoRoute = require('./serverinfo.route');

const router = express.Router();

router.use('/auth', authRoute);
router.use('/users', userRoute);
router.use('/contracts', contractRoute);
router.use('/kyc', kycRoute);
router.use('/withdraws', withdawRoute);
router.use('/wallets', walletRoute);
router.use('/daily-bonus', dailyBonusRoute);
router.use('/plans', planRoute);
router.use('/reports', reportRoute);
router.use('/serverinfo', serverInfoRoute);

module.exports = router;