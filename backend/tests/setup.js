import { vi } from 'vitest';

// Global setup for Vitest
// We can mock global modules here if needed

// Example: Suppress logger output during tests to keep console clean
vi.mock('../src/utils/logger.js', () => ({
  default: {
    info: vi.fn(),
    error: vi.fn(),
    warn: vi.fn(),
    debug: vi.fn(),
  },
}));
