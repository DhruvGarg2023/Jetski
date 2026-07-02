import { describe, it, expect, vi } from 'vitest';
import request from 'supertest';
import app from '../../src/app.js';
import prisma from '../../src/config/prisma.js';
import queueService from '../../src/modules/queue/queue.service.js';

// Mock dependencies
vi.mock('../../src/config/prisma.js', () => ({
  default: {
    $queryRaw: vi.fn(),
  },
}));

vi.mock('../../src/modules/queue/queue.service.js', () => ({
  default: {
    boss: {
      getQueue: vi.fn(),
    },
  },
}));

describe('Health API Integration Tests', () => {
  it('GET /api/v1/health should return 200 and healthy status when DB and Queue are up', async () => {
    // Arrange
    prisma.$queryRaw.mockResolvedValue([{ '?column?': 1 }]);
    queueService.boss.getQueue.mockResolvedValue({});

    // Act
    const res = await request(app).get('/api/v1/health');

    // Assert
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('success');
    expect(res.body.message).toBe('System is healthy');
    expect(res.body.database).toBe('connected');
    expect(res.body.queue).toBe('connected');
  });

  it('GET /api/v1/health should return 503 when DB is down', async () => {
    // Arrange
    prisma.$queryRaw.mockRejectedValue(new Error('DB Connection Failed'));

    // Act
    const res = await request(app).get('/api/v1/health');

    // Assert
    expect(res.statusCode).toBe(503);
    expect(res.body.status).toBe('fail');
    expect(res.body.message).toBe('System is unhealthy');
  });
});
