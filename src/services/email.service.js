const ApiError = require('../utils/ApiError');
const httpStatus = require('http-status');
const mailgun = require('mailgun-js');

const mg = mailgun({ apiKey: process.env.MAILGUN_API_KEY, domain: process.env.MAILGUN_DOMAIN });

async function sendEmailValidation() {

    // const data = {
    //     from: 'Excited User <me@samples.mailgun.org>',
    //     to: 'gustavopiucco@gmail.com',
    //     subject: 'Hello',
    //     text: 'Testing some Mailgun awesomness!'
    // };

    // mg.messages().send(data, function (error, body) {
    //     console.log(error, body)
    // });
}

module.exports = {
    sendEmailValidation
}