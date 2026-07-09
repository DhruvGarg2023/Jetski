import React from 'react';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, Clock, XCircle, GitCommit, GitPullRequest, ArrowRight } from 'lucide-react';
import { formatDistanceToNow, format } from 'date-fns';
import { useRouter } from 'next/navigation';

interface ReviewHistoryCardProps {
  review: {
    id: string;
    repoName: string;
    status: string;
    targetType: string;
    targetId: string;
    overallScore?: number;
    grade?: string;
    createdAt: string;
  };
}

export function ReviewHistoryCard({ review }: ReviewHistoryCardProps) {
  const router = useRouter();

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'COMPLETED': return <CheckCircle2 className="h-4 w-4 text-[#00E5FF]" />;
      case 'FAILED': return <XCircle className="h-4 w-4 text-[#FF4F00]" />;
      default: return <Clock className="h-4 w-4 text-[#7E8494] animate-pulse" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED': return 'text-[#00E5FF] border-[#00E5FF]/30';
      case 'FAILED': return 'text-[#FF4F00] border-[#FF4F00]/30';
      default: return 'text-[#7E8494] border-[#7E8494]/30';
    }
  };

  const getGradeTheme = (grade?: string) => {
    switch (grade?.toUpperCase()) {
      case 'A': 
      case 'B': return 'text-[#00E5FF]';
      case 'C': 
      case 'D': 
      case 'F': return 'text-[#FF4F00]';
      default: return 'text-[#7E8494]';
    }
  };

  return (
    <div 
      className="bg-[#0F1014] border border-white/10 hover:border-white/30 transition-colors cursor-pointer group flex flex-col sm:flex-row"
      onClick={() => router.push(`/reviews/${review.id}`)}
    >
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-center">
        <div className="flex items-start gap-3">
          <div className="mt-1 shrink-0">
            {getStatusIcon(review.status)}
          </div>
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h3 className="font-mono text-sm font-semibold text-[#F3F4F6] group-hover:text-white transition-colors">
                {review.repoName}
              </h3>
              <span className={`text-[10px] font-mono uppercase tracking-widest px-1.5 py-0.5 border ${getStatusColor(review.status)}`}>
                {review.status}
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-[11px] font-mono text-[#7E8494] uppercase tracking-wider mt-2">
              <span className="flex items-center gap-1.5">
                {review.targetType === 'COMMIT' ? <GitCommit className="h-3 w-3" /> : <GitPullRequest className="h-3 w-3" />}
                {review.targetId.substring(0, 7)}
              </span>
              <span className="hidden sm:inline opacity-50">|</span>
              <span>{formatDistanceToNow(new Date(review.createdAt), { addSuffix: true })}</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Metrics Section */}
      <div className="border-t sm:border-t-0 sm:border-l border-white/10 bg-[#181A20]/50 p-4 sm:p-5 flex items-center justify-between sm:justify-end gap-6 sm:min-w-[200px]">
        {review.status === 'COMPLETED' && review.overallScore !== undefined ? (
          <div className="flex gap-6">
            <div className="flex flex-col items-end">
              <span className="text-xl font-mono font-bold text-[#F3F4F6] leading-none mb-1">
                {review.overallScore}
              </span>
              <span className="text-[9px] font-mono text-[#7E8494] uppercase tracking-widest">Score</span>
            </div>
            {review.grade && (
              <div className="flex flex-col items-end">
                <span className={`text-xl font-mono font-bold leading-none mb-1 ${getGradeTheme(review.grade)}`}>
                  [{review.grade}]
                </span>
                <span className="text-[9px] font-mono text-[#7E8494] uppercase tracking-widest">Grade</span>
              </div>
            )}
          </div>
        ) : (
          <div className="text-[10px] font-mono text-[#7E8494] uppercase tracking-widest">
            Data_Unavailable
          </div>
        )}
        
        <div className="text-[#7E8494] group-hover:text-white transition-colors shrink-0">
          <ArrowRight className="h-4 w-4" />
        </div>
      </div>
    </div>
  );
}
