require('dotenv').config('.env');
const express = require('express');
const path = require('path');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const morgan = require('morgan');
const errorHandler = require('./middlewares/errorMiddleware.js');
const { infoLog, errorLog } = require('./application/config/logger.js');

const { redisStore, connectRedis, redisClient } = require('./application/config/redisConnect.js');
const { _pool, _promisePool } = require('./application/config/db.connect-pool.js');

const app = express();

// IMPORTANT: Ensure the CDN_URL variable (e.g., from environment variables)
// is accessible in this scope before this middleware runs.

app.use((_, res, next) => {
    const CDN_URL = process.env?.CDN_URL || '';
    // 1. Set the root URL for your custom assets (CloudFront)
    res.locals.CDN_URL = CDN_URL;

    // 2. Set ALL CDN Links (External Libraries AND Custom Assets)
    res.locals.CDNS = {
        // --- STYLING (CSS) ---
        tailwind: 'https://cdn.tailwindcss.com',
        fontAwesomeCSS: 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.6.0/css/all.min.css',
        bootstrapCSS: 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css',
        sweetAlertCSS: 'https://cdn.jsdelivr.net/npm/sweetalert2@11/dist/sweetalert2.min.css',

        // --- JAVASCRIPT LIBRARIES ---
        jquery: 'https://code.jquery.com/jquery-3.7.1.min.js',
        jqueryValidate:
            'https://cdnjs.cloudflare.com/ajax/libs/jquery-validate/1.19.1/jquery.validate.min.js',
        jqueryValidateAdditional:
            'https://cdnjs.cloudflare.com/ajax/libs/jquery-validate/1.19.1/additional-methods.js',
        bootstrapJS: 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js',
        sweetAlertJs: 'https://cdn.jsdelivr.net/npm/sweetalert2@11/dist/sweetalert2.min.js',
        popperJs: 'https://cdn.jsdelivr.net/npm/@popperjs/core@2.11.8/dist/umd/popper.min.js',
        fontAwesomeJS: 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.6.0/js/all.min.js',

        // --- YOUR CUSTOM JS FILES (NOW INCLUDED IN CDNS) ---
        // We use template literals to combine CDN_URL with your specific file path
        customCommonJS: `${CDN_URL}/assets/js/common.js`,
        customValidationJS: `${CDN_URL}/assets/js/common-validation.js`,

        // CUSTOM CSS FILES
        customCommonStylesCss: `${CDN_URL}/assets/css/common-styles/common-styles.css`,
        customCommonNavbarCss: `${CDN_URL}/assets/css/navbar/navbar.css`,
        customCommonProgressNavbarCss: `${CDN_URL}/assets/css/navbar/progress-navbar.css`,

        // Ticket System JS
        // customTicketSystemJS: `${CDN_URL}/assets/js/ticketSystem.js`,
        customTicketSystemJS: `/assets/js/ticketSystem.js`,
    };

    next();
});

app.use(cors());

app.use(
    session({
        store: redisStore,
        secret: 'utirna_form_filling',
        resave: false,
        saveUninitialized: false,
    })
);

app.use(function (_, res, next) {
    res.pool = _pool;
    res.promisePool = _promisePool;
    next();
});

app.set('views', path.join(__dirname, 'application/views'));
app.set('view engine', 'pug');
app.use(function (_, res, next) {
    res.set(
        'Cache-Control',
        'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0'
    );
    next();
});

app.use(express.json({ limit: '1024mb' }));
app.use(express.urlencoded({ extended: true, limit: '1024mb' }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

const morganFormat = ':method :url :status :response-time ms';
app.use(
    morgan(morganFormat, {
        stream: {
            write: (message) => {
                const logObject = {
                    method: message.split(' ')[0],
                    url: message.split(' ')[1],
                    status: message.split(' ')[2],
                    responseTime: message.split(' ')[3],
                };
                infoLog(logObject);
            },
        },
    })
);

redisClient.on('error', () => {
    errorLog('Error while connecting to Redis');
    process.exit(1);
});

redisClient.on('connect', () => {
    infoLog('Connected to Redis');
});

// router
app.use(require('./routes/index.js'));

app.use((req) => {
    errorLog(`ROUTE_NOT_FOUND: ${req.path}`);
});

app.use(errorHandler);

(async () => {
    try {
        await startExpressServer();
    } catch (error) {
        console.log(error);
    }
})();

async function startExpressServer() {
    const PORT = process.env.PORT || 9000;
    infoLog('Starting Express Server');
    app.listen(process.env.PORT, () => {
        infoLog(`Server started on ${PORT}`);
        infoLog(`http://localhost:${PORT}`);
        infoLog(`\x1b[43m\x1b[37m INFO : Running ${process.env.NODE_ENV} build \x1b[0m`);
    });
}
