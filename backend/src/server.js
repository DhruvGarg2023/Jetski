import app from './app.js';
import { env } from './config/env.js';
import logger from './utils/logger.js';
import http from 'http';
import socketService from './modules/socket/socket.service.js';

const startServer = () => {
  try {
    const server = http.createServer(app);
    
    // Initialize Socket.IO
    socketService.init(server);

    server.listen(env.PORT, () => {
      logger.info(`Server is running on port ${env.PORT} in ${env.NODE_ENV} mode`);
    });
  } catch (error) {
    logger.error('Error starting server:', error);
    process.exit(1);
  }
};

startServer();
