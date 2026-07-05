import { PgBoss } from 'pg-boss';
import { env } from '../../config/env.js';
import logger from '../../utils/logger.js';
import { processReviewJob } from './review.worker.js';

class QueueService {
  constructor() {
    const dbUrl = env.DIRECT_DATABASE_URL || env.DATABASE_URL;
    const isProd = env.NODE_ENV === 'production';
    
    const config = {
      connectionString: dbUrl,
    };

    // Many cloud providers (Neon, Render, Supabase) require SSL
    if (isProd && !dbUrl.includes('localhost')) {
      config.ssl = { rejectUnauthorized: false };
    }

    this.boss = new PgBoss(config);
    
    this.boss.on('error', (error) => {
      console.error('pg-boss error details:', error);
    });
  }

  async start() {
    try {
      await this.boss.start();
      logger.info('PgBoss queue service started successfully');

      // Explicitly create the queue to prevent 'Queue does not exist' errors
      // if the worker starts polling before the very first job is sent.
      await this.boss.createQueue('code-review');

      // Register workers (pg-boss natively passes an array of jobs)
      await this.boss.work('code-review', async (jobs) => {
        for (const job of jobs) {
          logger.info(`Processing code-review job: ${job.id}`);
          await processReviewJob(job.data);
        }
      });

    } catch (error) {
      logger.error(error, 'Failed to start PgBoss queue service:');
      throw error;
    }
  }

  async addReviewJob(payload) {
    // Retry up to 3 times, with exponential backoff
    const jobId = await this.boss.send('code-review', payload, {
      retryLimit: 3,
      retryBackoff: true,
      expireInSeconds: 300 // 5 minutes max per job
    });
    
    logger.info(`Enqueued code-review job: ${jobId}`);
    return jobId;
  }
  
  async stop() {
    await this.boss.stop();
  }
}

export default new QueueService();
