import { z } from 'zod';

export const aiReviewSchema = z.array(
  z.object({
    filePath: z.string(),
    lineNumber: z.number().nullable().optional(),
    comment: z.string(),
    severity: z.enum(['INFO', 'WARNING', 'CRITICAL']),
  })
);
