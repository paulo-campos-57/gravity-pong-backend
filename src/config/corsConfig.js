const cors = require('cors');

const ALLOWED_ORIGINS = process.env.ALLOWED_ORIGINS
    ? process.env.ALLOWED_ORIGINS.split(',')
    : ['http://localhost:5173', 'http://localhost:3000', 'https://frontend-pong.vercel.app'];

const corsOptions = {
    origin: (origin, callback) => {
        if (!origin || ALLOWED_ORIGINS.includes(origin) || process.env.NODE_ENV !== 'production') {
            callback(null, true);
        } else {
            callback(new Error(`CORS: origem não permitida — ${origin}`));
        }
    },
    methods: ['GET', 'POST'],
    credentials: true,
};

const socketCorsOptions = {
    origin: '*',
    methods: ['GET', 'POST'],
};

const corsMiddleware = cors(corsOptions);

module.exports = { corsMiddleware, corsOptions, socketCorsOptions };