"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import { reviewsService } from "@/features/reviews/reviews.service";
import { ReviewSummaryCard } from "@/features/reviews/components/ReviewSummaryCard";
import { ReviewCommentsList } from "@/features/reviews/components/ReviewCommentsList";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2, GitCommit, GitPullRequest } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function ReviewReportPage() {
  const params = useParams();
  const router = useRouter();
  const reviewId = params.id as string;

  const { data: review, isLoading, error } = useQuery({
    queryKey: ["review", reviewId],
    queryFn: () => reviewsService.getReview(reviewId),
    enabled: !!reviewId,
    refetchInterval: (query) => {
      // Poll every 3 seconds if review is still processing
      const status = query.state?.data?.status;
      if (status === 'PENDING' || status === 'IN_PROGRESS') {
        return 3000;
      }
      return false;
    }
  });

  if (isLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2 text-muted-foreground">Loading review report...</span>
      </div>
    );
  }

  if (error || !review) {
    return (
      <div className="p-6 text-center">
        <h3 className="text-xl font-semibold text-red-500 mb-2">Error Loading Review</h3>
        <p className="text-muted-foreground mb-4">
          {(error as any)?.message || "Could not find the requested review."}
        </p>
        <Button variant="outline" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Go Back
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto w-full pb-10">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            AI Code Review Report
          </h1>
          <div className="text-sm text-muted-foreground mt-1 flex flex-wrap items-center gap-2">
            <span>ID: {review.id}</span>
            <span>•</span>
            <span className="flex items-center gap-1">
              {review.targetType === 'COMMIT' ? (
                <GitCommit className="h-3 w-3" />
              ) : (
                <GitPullRequest className="h-3 w-3" />
              )}
              {review.targetType}: {review.targetId.substring(0, 7)}
            </span>
            <span>•</span>
            <Badge variant="outline" className={
              review.status === 'COMPLETED' ? 'bg-green-500/10 text-green-500 border-green-200' :
              review.status === 'FAILED' ? 'bg-red-500/10 text-red-500 border-red-200' :
              'bg-blue-500/10 text-blue-500 border-blue-200'
            }>
              {review.status}
            </Badge>
          </div>
        </div>
      </div>

      {(review.status === 'PENDING' || review.status === 'IN_PROGRESS') ? (
        <div className="text-center p-12 border rounded-xl bg-card shadow-sm">
          <Loader2 className="h-10 w-10 animate-spin text-primary mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">Review in Progress</h3>
          <p className="text-muted-foreground">
            The AI is currently analyzing this code. This page will automatically update when finished.
          </p>
        </div>
      ) : (
        <>
          <ReviewSummaryCard review={review} />

          <div className="mt-8 space-y-4">
            <h2 className="text-xl font-semibold">Detailed Findings</h2>
            <ReviewCommentsList comments={review.comments || []} />
          </div>
        </>
      )}
    </div>
  );
}
