const ApiError = require('../utils/ApiError');
const httpStatus = require('http-status');
const mailgun = require('mailgun-js');

const mg = mailgun({ apiKey: process.env.MAILGUN_API_KEY, domain: process.env.MAILGUN_DOMAIN });

async function sendEmailConfirmation(toEmail, code) {

    const data = {
        from: 'Liberty <liberty@test.com>',
        to: toEmail,
        subject: 'Liberty - Email Confirmation',
        html: `
        <p>Please, click in the link below to confirm your email.<p>
        <a href="${process.env.BASE_URL}/email/confirm/${code}">Click here to confirm</a>
        `
    };

    mg.messages().send(data, function (error, body) {
        console.log(error, body);
    });
}

module.exports = {
    sendEmailConfirmation
}