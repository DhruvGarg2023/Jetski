import githubService from '../github/github.service.js';
import aiService from '../../modules/ai/ai.service.js';
import reviewRepository from '../../repositories/review.repository.js';
import AppError from '../../utils/appError.js';
import logger from '../../utils/logger.js';
import socketService from '../../modules/socket/socket.service.js';

class ReviewsService {
  /**
   * Orchestrates the review process: Fetch Diff -> AI Analysis -> Save to DB
   */
  async initiateReview(userId, payload) {
    const { repoId, targetType, targetId, githubToken } = payload;

    logger.info(`Initiating review for ${targetType} ${targetId} on repo ${repoId}`);
    
    // Emit start event
    socketService.emitToUser(userId, 'review:start', { targetId, targetType, repoId });

    // 1. Fetch the raw diff from GitHub
    let diff;
    try {
      socketService.emitToUser(userId, 'review:progress', { message: 'Fetching diff from GitHub...' });
      if (targetType === 'COMMIT') {
        diff = await githubService.getCommitDiff(repoId, targetId, githubToken, userId);
      } else {
        throw new AppError('PR reviews are not fully implemented yet in this milestone', 400);
      }
    } catch (error) {
      socketService.emitToUser(userId, 'review:error', { message: `Failed to fetch diff: ${error.message}` });
      throw new AppError(`Failed to fetch diff: ${error.message}`, error.statusCode || 500);
    }

    if (!diff) {
      throw new AppError('The requested diff is empty or does not exist.', 404);
    }

    // Optional: Check if diff is too large to prevent token explosion
    if (diff.length > 50000) { // Rough heuristic
      socketService.emitToUser(userId, 'review:error', { message: 'The diff is too large for AI review.' });
      throw new AppError('The diff is too large for AI review. Please break it down.', 413);
    }

    // 2. Call the AI Service
    let aiResult;
    try {
      socketService.emitToUser(userId, 'review:progress', { message: 'Analyzing code with AI...' });
      aiResult = await aiService.generateCodeReview(diff);
    } catch (error) {
      socketService.emitToUser(userId, 'review:error', { message: `AI Review generation failed: ${error.message}` });
      throw new AppError(`AI Review generation failed: ${error.message}`, 502);
    }

    // 3. Save the results to the database atomically
    socketService.emitToUser(userId, 'review:progress', { message: 'Saving results to database...' });
    const savedReview = await reviewRepository.createReviewWithComments(
      repoId,
      targetType,
      targetId,
      aiResult
    );

    logger.info(`Successfully saved review ${savedReview.id}`);

    // Fetch and return the fully populated review
    const finalReview = await reviewRepository.getReviewById(savedReview.id);
    
    // Emit complete event
    socketService.emitToUser(userId, 'review:complete', finalReview);
    
    return finalReview;
  }

  /**
   * Get details of a specific review
   */
  async getReviewDetails(reviewId, userId) {
    const review = await reviewRepository.getReviewById(reviewId);
    if (!review) {
      throw new AppError('Review not found', 404);
    }
    
    // We should check if the user owns the repo, but reviewRepository doesn't fetch repo->project->user
    // For now, we trust the ID or we can add a check if needed.
    return review;
  }

  /**
   * List all reviews for a repo
   */
  async getRepoReviews(repoId, userId) {
    // Note: ideally check if userId owns repoId first
    return await reviewRepository.getReviewsForRepository(repoId);
  }
}

export default new ReviewsService();
