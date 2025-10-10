require('dotenv').config('.env');
const express = require('express');
const path = require('path');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const morgan = require('morgan');
const errorHandler = require('./middlewares/errorMiddleware.js');
const { infoLog, errorLog } = require('./application/config/logger.js');

const app = express();

// IMPORTANT: Ensure the CDN_URL variable (e.g., from environment variables)
// is accessible in this scope before this middleware runs.

app.use(cors());

app.use(
    session({
        secret: 'utirna_form_filling',
        resave: false,
        saveUninitialized: false,
    })
);

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
