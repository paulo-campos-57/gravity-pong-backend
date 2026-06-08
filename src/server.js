const { createServer } = require('http');
const app = require('./app');
const { initSocket } = require('./services/socketService');

const PORT = process.env.PORT || 3000;

const httpServer = createServer(app);

initSocket(httpServer);

httpServer.listen(PORT, () => {
  console.log(`Pong server running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
  console.log(`API Docs:     http://localhost:${PORT}/api-docs`);
});