import prisma from '../config/prisma.js';

export const createReview = async (repoId, targetType, targetId) => {
  return prisma.review.create({
    data: {
      repoId,
      targetType,
      targetId,
      status: 'PENDING',
    },
  });
};

export const updateReviewStatus = async (id, status) => {
  return prisma.review.update({
    where: { id },
    data: { status },
  });
};

export const getReviewWithComments = async (id) => {
  return prisma.review.findUnique({
    where: { id },
    include: {
      comments: true,
      repository: true,
    },
  });
};

export const saveReviewComments = async (reviewId, comments) => {
  return prisma.reviewComment.createMany({
    data: comments.map((c) => ({
      reviewId,
      filePath: c.filePath,
      lineNumber: c.lineNumber,
      comment: c.comment,
      severity: c.severity,
    })),
  });
};
