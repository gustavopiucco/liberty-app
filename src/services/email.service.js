const ApiError = require('../utils/ApiError');
const httpStatus = require('http-status');
const mailgun = require('mailgun-js');

const mg = mailgun({ apiKey: process.env.MAILGUN_API_KEY, domain: process.env.MAILGUN_DOMAIN });

async function sendResetPasswordValidation(toEmail, code) {
    const data = {
        from: 'Liberty <liberty@test.com>',
        to: toEmail,
        subject: 'Liberty - Reset Password',
        html: `
        <p>A password reset on your account has been requested. If it wasn't you, ignore it.</p>
        <p>Please, click in the link below to reset your password.<p>
        <a href="${process.env.BASE_URL}/reset-password/confirm/${code}">Click here to confirm</a>
        `
    };

    await sendEmail(data);
}

async function sendEmailValidation(toEmail, code) {
    const data = {
        from: 'Liberty <liberty@test.com>',
        to: toEmail,
        subject: 'Liberty - Email Validation',
        html: `
        <p>Please, click in the link below to confirm your email.<p>
        <a href="${process.env.BASE_URL}/email/confirm/${code}">Click here to confirm</a>
        `
    };

    await sendEmail(data);
}

async function sendEmail(data) {
    try {
        await mg.messages().send(data);
    }
    catch (err) {
        throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, err);
    }
}

module.exports = {
    sendResetPasswordValidation,
    sendEmailValidation
}