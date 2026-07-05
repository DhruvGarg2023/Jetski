import pino from 'pino';
import { env } from '../config/env.js';
import fs from 'fs';
import path from 'path';

// Ensure logs directory exists in production
if (env.NODE_ENV === 'production') {
  const logDir = path.join(process.cwd(), 'logs');
  if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true });
  }
}

// Development configuration uses pino-pretty for stdout
const devTransport = {
  target: 'pino-pretty',
  options: {
    colorize: true,
    ignore: 'pid,hostname',
    translateTime: 'SYS:standard',
  },
};

// Production configuration logs to stdout AND rotates files daily (up to 5MB, keep last 7 days)
const prodTransport = {
  targets: [
    { target: 'pino/file', options: { destination: 1 } }, // Log to stdout
    {
      target: 'pino-roll',
      options: {
        file: path.join(process.cwd(), 'logs', 'app'),
        frequency: 'daily',
        size: '5m',
        mkdir: true,
        extension: '.log',
        limit: {
          count: 7, // Keep 7 files
        },
      },
    },
  ],
};

const logger = pino({
  level: env.LOG_LEVEL || (env.NODE_ENV === 'production' ? 'info' : 'debug'),
  // Base fields to include with every log
  base: env.NODE_ENV === 'production' ? { pid: process.pid, env: env.NODE_ENV } : undefined,
  transport: env.NODE_ENV === 'production' ? prodTransport : devTransport,
});

export default logger;

