import { Router } from 'express';
import { env } from '../config/env.js';
import prisma from '../config/prisma.js';
import queueService from '../modules/queue/queue.service.js';
import logger from '../utils/logger.js';

const router = Router();

router.get('/', async (req, res) => {
  try {
    // 1. Check Database Health
    await prisma.$queryRaw`SELECT 1`;

    // 2. Check Queue Health
    await queueService.boss.getQueue('code-review');

    res.status(200).json({
      status: 'success',
      message: 'System is healthy',
      timestamp: new Date().toISOString(),
      environment: env.NODE_ENV,
      database: 'connected',
      queue: 'connected'
    });
  } catch (error) {
    logger.error('Health check failed', error);
    res.status(503).json({
      status: 'fail',
      message: 'System is unhealthy',
      error: error.message
    });
  }
});

export default router;