import { Router } from 'express';
import logger from '../utils/logger.js';

const router = Router();

router.get('/', (req, res) => {
  logger.debug('Health check endpoint called');
  res.status(200).json({
    success: true,
    message: 'API is running successfully',
    timestamp: new Date().toISOString(),
  });
});

export default router;
