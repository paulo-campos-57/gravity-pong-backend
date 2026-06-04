const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Gravity Pong API',
            version: '1.0.0',
            description: 'Backend para jogo Gravity Pong multiplayer em tempo real usando Socket.IO, Express e Node.js.',
            contact: {
                name: 'Carlos Vasconcelos, Estela Lacerda, Gabriel Rossiter, Paulo Campos',
            },
        },
        servers: [
            {
                url: 'http://localhost:3000',
                description: 'Servidor local',
            },
            {
                url: 'https://backend-pong.onrender.com',
                description: 'Produção (Render)',
            },
        ],
    },
    apis: ['./src/routes/*.js', './src/controllers/*.js', './src/core/*.js', './src/services/*.js'],
};

const swaggerSpec = swaggerJsdoc(options);

function setupSwagger(app) {
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}

module.exports = { setupSwagger, swaggerSpec };