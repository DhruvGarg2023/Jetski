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
      const status = query.state?.data?.status;
      if (status === 'PENDING' || status === 'IN_PROGRESS') {
        return 3000;
      }
      return false;
    }
  });

  if (isLoading) {
    return (
      <div className="flex h-[50vh] flex-col items-center justify-center font-mono text-[#7E8494]">
        <Loader2 className="h-6 w-6 animate-spin mb-4 text-[#00E5FF]" />
        <span>[ SYSTEM_PROCESSING_DIAGNOSTIC ]</span>
      </div>
    );
  }

  if (error || !review) {
    return (
      <div className="p-8 border border-[#FF4F00]/30 bg-[#FF4F00]/5 max-w-2xl mx-auto mt-12">
        <h3 className="text-sm font-mono font-bold text-[#FF4F00] uppercase tracking-widest mb-2">System_Error</h3>
        <p className="text-[#F3F4F6] mb-6 font-sans">
          {(error as any)?.message || "Could not locate the requested diagnostic report."}
        </p>
        <Button variant="outline" className="border-white/10 rounded-none hover:bg-white/5 font-mono text-xs" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" /> REVERT
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-5xl mx-auto w-full pb-20 pt-4">
      {/* Structural Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="rounded-none hover:bg-white/5 shrink-0" onClick={() => router.back()}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-[#F3F4F6]">
              Diagnostic Dossier
            </h1>
            <div className="text-xs font-mono text-[#7E8494] mt-1 flex flex-wrap items-center gap-3">
              <span>ID: {review.id.substring(0, 8)}...</span>
              <span className="hidden sm:inline">|</span>
              <span className="flex items-center gap-1.5 text-[#00E5FF]">
                {review.targetType === 'COMMIT' ? (
                  <GitCommit className="h-3 w-3" />
                ) : (
                  <GitPullRequest className="h-3 w-3" />
                )}
                {review.targetType}: {review.targetId.substring(0, 7)}
              </span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center self-start sm:self-auto">
          <Badge variant="outline" className={`rounded-none border px-3 py-1 font-mono text-[10px] tracking-widest uppercase ${
            review.status === 'COMPLETED' ? 'bg-[#00E5FF]/10 text-[#00E5FF] border-[#00E5FF]/30' :
            review.status === 'FAILED' ? 'bg-[#FF4F00]/10 text-[#FF4F00] border-[#FF4F00]/30' :
            'bg-white/5 text-[#F3F4F6] border-white/20'
          }`}>
            STATUS: {review.status}
          </Badge>
        </div>
      </div>

      {(review.status === 'PENDING' || review.status === 'IN_PROGRESS') ? (
        <div className="text-center p-16 border border-white/10 bg-[#0F1014]">
          <Loader2 className="h-8 w-8 animate-spin text-[#00E5FF] mx-auto mb-6" />
          <h3 className="text-sm font-mono tracking-widest text-[#F3F4F6] uppercase mb-2">Analysis Sequence Initiated</h3>
          <p className="text-[#7E8494] text-sm">
            The AI engine is currently reviewing the codebase. Awaiting completion.
          </p>
        </div>
      ) : (
        <div className="space-y-12">
          <ReviewSummaryCard review={review} />

          <div className="space-y-4">
            <h2 className="text-sm font-mono tracking-widest text-[#7E8494] uppercase flex items-center gap-3">
              <span>System_Anomalies</span>
              <div className="h-[1px] bg-white/10 flex-1"></div>
            </h2>
            <ReviewCommentsList comments={review.comments || []} />
          </div>
        </div>
      )}
    </div>
  );
}
