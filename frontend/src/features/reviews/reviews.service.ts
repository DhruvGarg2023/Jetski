import api from '@/services/api';

export interface InitiateReviewPayload {
  repoId: string;
  targetType: 'COMMIT' | 'PR';
  targetId: string;
  githubToken: string;
  correlationId?: string;
}

export interface ReviewResponse {
  id: string;
  repoId: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'FAILED';
  targetType: 'COMMIT' | 'PR';
  targetId: string;
  summary?: string;
  overallScore?: number;
  grade?: string;
  createdAt: string;
  updatedAt: string;
}

export const reviewsService = {
  initiateReview: async (payload: InitiateReviewPayload): Promise<ReviewResponse> => {
    const { data } = await api.post('/reviews', payload);
    return data.data; // Depending on backend response, usually returns the pending review
  },

  getReview: async (id: string): Promise<ReviewResponse> => {
    const { data } = await api.get(`/reviews/${id}`);
    return data.data;
  },

  getRepoReviews: async (repoId: string): Promise<ReviewResponse[]> => {
    const { data } = await api.get(`/reviews/repo/${repoId}`);
    return data.data;
  }
};
