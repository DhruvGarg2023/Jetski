import { PrismaClient } from '@prisma/client';
import { env } from './env.js';

import logger from '../utils/logger.js';

const prisma = new PrismaClient({
  log: [
    { emit: 'event', level: 'query' },
    { emit: 'event', level: 'error' },
    { emit: 'event', level: 'warn' }
  ],
});

prisma.$on('query', (e) => {
  // Only log slow queries or all queries in dev
  logger.debug({ 
    query: e.query, 
    params: e.params, 
    durationMs: e.duration 
  }, 'Prisma Query');
});

prisma.$on('error', (e) => {
  logger.error({ error: e.message }, 'Prisma Error');
});

prisma.$on('warn', (e) => {
  logger.warn({ warning: e.message }, 'Prisma Warning');
});

export default prisma;
