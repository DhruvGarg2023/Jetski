import githubService from '../../components/github/github.service.js';
import aiService from '../../modules/ai/ai.service.js';
import reviewRepository from '../../repositories/review.repository.js';
import socketService from '../../modules/socket/socket.service.js';
import logger from '../../utils/logger.js';

/**
 * Background worker to process code reviews
 */
export const processReviewJob = async (jobData) => {
  const { reviewId, repoId, targetType, targetId, githubToken, userId } = jobData;

  try {
    logger.info(`Starting background review process for Review ID: ${reviewId}`);
    
    // 1. Fetch the raw diff from GitHub
    socketService.emitToUser(userId, 'review:progress', { message: 'Fetching diff from GitHub...' });
    
    let diff;
    if (targetType === 'COMMIT') {
      diff = await githubService.getCommitDiff(repoId, targetId, githubToken, userId);
    } else {
      throw new Error('PR reviews are not fully implemented yet');
    }

    if (!diff) {
      throw new Error('The requested diff is empty or does not exist.');
    }

    if (diff.length > 1000000) { // Gemini 1.5 Flash supports 1M+ tokens
      throw new Error('The diff is too large for AI review. Please break it down.');
    }

    // 2. Call the AI Service
    socketService.emitToUser(userId, 'review:progress', { message: 'Analyzing code with AI...' });
    const aiResult = await aiService.generateCodeReview(diff);

    // 3. Save the results to the database atomically (Update existing pending review)
    socketService.emitToUser(userId, 'review:progress', { message: 'Saving results to database...' });
    
    await reviewRepository.updateReviewWithComments(reviewId, aiResult);

    // Fetch and return the fully populated review to emit to user
    const finalReview = await reviewRepository.getReviewById(reviewId);
    
    logger.info(`Successfully processed review ${reviewId}`);
    socketService.emitToUser(userId, 'review:complete', finalReview);
    
    return { success: true, reviewId };
  } catch (error) {
    logger.error(error, `Failed to process review job ${reviewId}`);
    
    // Mark the review as FAILED in the DB
    await reviewRepository.updateReviewStatus(reviewId, 'FAILED');
    
    // Notify the user via socket
    socketService.emitToUser(userId, 'review:error', { message: `Review processing failed: ${error.message}` });
    
    // Throw error so PgBoss knows the job failed and can retry if applicable
    throw error;
  }
};
