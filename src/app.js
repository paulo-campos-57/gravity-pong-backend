const express = require('express');
const { corsMiddleware } = require('./config/corsConfig');
const { setupSwagger } = require('./config/swaggerConfig');
const healthRoutes = require('./routes/healthRoutes');
const statsRoutes = require('./routes/statsRoutes');
const { errorHandler, notFound } = require('./middlewares/errorMiddleware');

const app = express();

// Middlewares globais
app.use(corsMiddleware);
app.use(express.json());
app.use(express.static('public'));

// Swagger docs
setupSwagger(app);

// Rotas HTTP
app.use('/', healthRoutes);
app.use('/stats', statsRoutes);

// Error handling
app.use(notFound);
app.use(errorHandler);

module.exports = app;