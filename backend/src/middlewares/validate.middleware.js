import AppError from '../utils/appError.js';

/**
 * Generic Zod validation middleware factory.
 * Accepts a Zod schema and returns Express middleware that validates req.body.
 * If validation fails, a structured 400 error is returned immediately.
 */
export const validate = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.body);

  if (!result.success) {
    const errors = result.error.errors.map((err) => ({
      field: err.path.join('.'),
      message: err.message,
    }));

    return res.status(400).json({
      success: false,
      error: 'Validation failed',
      details: errors,
    });
  }

  // Replace req.body with the parsed (and potentially transformed) data
  req.body = result.data;
  next();
};
