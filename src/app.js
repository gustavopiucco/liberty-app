const express = require('express');
const helmet = require('helmet');
const xss = require('xss-clean');
const compression = require('compression');
const cors = require('cors');
const httpStatus = require('http-status');
const routes = require('./routes');
const { errorConverter, errorHandler } = require('./middlewares/error');
const ApiError = require('./utils/ApiError');
const morgan = require('morgan');

const app = express();

//morgan http log
if (process.env.NODE_ENV == 'development') {
    app.use(morgan('dev'));
}

//set security HTTP headers
app.use(helmet());

//parse json request body
app.use(express.json());

//parse urlencoded request body
app.use(express.urlencoded({ extended: true }));

//sanitize request data
app.use(xss());

//gzip compression
app.use(compression());

//enable cors
app.use(cors());
app.options('*', cors());

//api routes
app.use('/api', routes);

//send back a 404 error for any unknown api request
app.use((req, res, next) => {
    next(new ApiError(httpStatus.NOT_FOUND, 'Not found'));
});

//convert error to ApiError, if needed
app.use(errorConverter);

//handle error
app.use(errorHandler);

module.exports = app;