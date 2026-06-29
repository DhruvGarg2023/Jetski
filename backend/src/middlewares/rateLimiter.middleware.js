import rateLimit from 'express-rate-limit';

/**
 * Global rate limiter — applies to all routes.
 * Allows 100 requests per 15 minutes per IP.
 */
export const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,  // 15 minutes
  max: 100,
  standardHeaders: true,     // Return rate limit info in `RateLimit-*` headers
  legacyHeaders: false,      // Disable `X-RateLimit-*` headers
  message: {
    success: false,
    error: 'Too many requests, please try again later.',
  },
});

/**
 * Auth rate limiter — strict limit on login/register to prevent brute force.
 * Allows 10 requests per 15 minutes per IP.
 */
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,  // 15 minutes
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: 'Too many authentication attempts, please try again later.',
  },
});

/**
 * AI review rate limiter — prevents API cost abuse.
 * Allows 20 review requests per hour per IP.
 */
export const reviewLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,  // 1 hour
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: 'Review limit reached. Please try again later.',
  },
});
