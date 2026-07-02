import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import logger from './utils/logger.js';
import { env } from './config/env.js';
import healthRouter from './routes/health.route.js';
import { errorHandler } from './middlewares/error.middleware.js';
import { globalLimiter } from './middlewares/rateLimiter.middleware.js';
import authRoutes from './components/auth/auth.routes.js';
import projectsRoutes from './components/projects/projects.routes.js';
import githubRoutes from './components/github/github.routes.js';
import reviewsRoutes from './components/reviews/reviews.routes.js';
import queueRoutes from './modules/queue/queue.routes.js';
import docsRoutes from './modules/docs/docs.routes.js';

const app = express();

// ─── Security Middlewares ────────────────────────────────────────────────────

// Helmet — sets secure HTTP headers (XSS protection, no-sniff, HSTS, etc.)
app.use(helmet());

// CORS — only allow requests from the frontend origin
app.use(
  cors({
    origin: env.CLIENT_URL,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// Global rate limiter — 100 requests per 15 minutes per IP
app.use(globalLimiter);

// ─── Body Parsing ────────────────────────────────────────────────────────────

// Limit JSON body size to 1MB to prevent denial-of-service via large payloads
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

import { requestIdMiddleware } from './middlewares/requestId.middleware.js';


app.use(requestIdMiddleware);

app.use(
  morgan(':remote-addr - :remote-user [:date[clf]] "[Req: :req[x-request-id]] :method :url HTTP/:http-version" :status :res[content-length] - :response-time ms', {
    stream: { write: (message) => logger.info(message.trim()) },
  })
);


app.use('/api/v1/health', healthRouter);
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectsRoutes);
app.use('/api/github', githubRoutes);
app.use('/api/reviews', reviewsRoutes);
app.use('/api/queues', queueRoutes);
app.use('/api-docs', docsRoutes);


app.use(errorHandler);

export default app;
