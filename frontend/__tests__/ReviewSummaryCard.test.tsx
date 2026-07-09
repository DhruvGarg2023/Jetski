import { render, screen } from '@testing-library/react'
import { expect, test, describe, vi } from 'vitest'
import { ReviewSummaryCard } from '@/features/reviews/components/ReviewSummaryCard'
import { ReviewResponse } from '@/features/reviews/types'

// Mock Framer Motion to bypass animation delays in tests
vi.mock('framer-motion', async () => {
  const actual = await vi.importActual('framer-motion')
  return {
    ...actual as any,
    useInView: () => true,
  }
})

describe('ReviewSummaryCard', () => {
  const mockReview: ReviewResponse = {
    id: 'rev_123',
    repoId: 'DhruvGarg2023/Jetski',
    targetType: 'COMMIT',
    targetId: 'abc123def456',
    status: 'COMPLETED',
    summary: 'The code is generally good, but there are some critical security flaws.',
    overallScore: 85,
    grade: 'B',
    comments: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }

  test('renders review summary and score', () => {
    render(<ReviewSummaryCard review={mockReview} />)
    
    // Check if the summary is rendered
    expect(screen.getByText('The code is generally good, but there are some critical security flaws.')).toBeInTheDocument()
    
    // Check if score grade is rendered
    expect(screen.getByText('B')).toBeInTheDocument()
  })
})
