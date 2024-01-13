const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const hpp = require('hpp');
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');
const AuthRouter  = require('./routes/auth');
const UserRouter = require('./routes/user');
const s3auth = require('./routes/s3');
const drive = require('./routes/drive');
const APP = express();

const customCors = {
    origin: true,
    credentials: true,
};

APP.use(cors(customCors));
APP.use(helmet());
APP.use(hpp());
APP.use(cookieParser());

if (process.env.NODE_ENV === 'development') {
    APP.use(morgan('dev'));
}

const limiter = rateLimit({
    windowMs: 60 * 1000,
    max: 100,
    delayMs: 0,
    handler(req, res) {
        res.status(429).json({
            code: 429,
            message: 'Too many requests, please try again later.',
        });
    },
});

APP.use('/api', limiter);

APP.use(express.json());
APP.use(express.urlencoded({ extended: false }));

APP.get('/', (_req, res) => {
    res.status(200).json({
        code: 200,
        message: 'Welcome to Secret API',
    });
});

APP.use('/api/auth', AuthRouter);
APP.use('/api/user', UserRouter);
APP.use('/api/s3', s3auth);
APP.use('/api/drive', drive);

APP.use('*', (req, res) => {
    res.status(404).json({
        code: 404,
        message: 'Route not found',
    });
});

module.exports = APP;
