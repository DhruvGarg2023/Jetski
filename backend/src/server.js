import app from './app.js';
import { env } from './config/env.js';
import logger from './utils/logger.js';
import http from 'http';
import socketService from './modules/socket/socket.service.js';
import queueService from './modules/queue/queue.service.js';

const startServer = async () => {
  try {
    const server = http.createServer(app);
    
    // Initialize Socket.IO
    socketService.init(server);

    // Initialize PgBoss Job Queue
    await queueService.start();

    server.listen(env.PORT, () => {
      logger.info(`Server is running on port ${env.PORT} in ${env.NODE_ENV} mode`);
    });

    // Graceful shutdown handling
    process.on('SIGINT', async () => {
      logger.info('Shutting down gracefully...');
      await queueService.stop();
      process.exit(0);
    });
  } catch (error) {
    logger.error('Error starting server:', error);
    process.exit(1);
  }
};

startServer();
