import prisma from '../config/prisma.js';

class ReviewRepository {
  /**
   * Creates a Review, ReviewComments, and AiReviewHistory atomically.
   */
  async createReviewWithComments(repoId, targetType, targetId, aiResult) {
    return prisma.$transaction(async (tx) => {
      // 1. Create the base Review entry
      const review = await tx.review.create({
        data: {
          repoId,
          targetType, // 'COMMIT' or 'PR'
          targetId,   // e.g., commit SHA or PR number
          status: 'COMPLETED',
        },
      });

      // 2. Prepare Comments data
      if (aiResult.comments && aiResult.comments.length > 0) {
        const commentsData = aiResult.comments.map((comment) => ({
          reviewId: review.id,
          filePath: comment.filePath,
          lineNumber: comment.lineNumber || null,
          comment: comment.comment,
          severity: comment.severity,
        }));

        await tx.reviewComment.createMany({
          data: commentsData,
        });
      }

      // 3. Save AI History
      await tx.aiReviewHistory.create({
        data: {
          reviewId: review.id,
          promptTokens: aiResult.usage.promptTokens,
          completionTokens: aiResult.usage.completionTokens,
          modelUsed: aiResult.usage.modelUsed,
          rawResponse: aiResult.usage.rawResponse,
        },
      });

      return review;
    });
  }

  /**
   * Fetches a single review by ID with all its nested comments and AI history
   */
  async getReviewById(reviewId) {
    return prisma.review.findUnique({
      where: { id: reviewId },
      include: {
        comments: true,
        aiHistory: true,
      },
    });
  }

  /**
   * Fetches all reviews for a given repository
   */
  async getReviewsForRepository(repoId) {
    return prisma.review.findMany({
      where: { repoId },
      include: {
        comments: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }
}

export default new ReviewRepository();
