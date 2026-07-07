import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
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
      case 'COMPLETED': return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case 'FAILED': return <XCircle className="h-5 w-5 text-red-500" />;
      default: return <Clock className="h-5 w-5 text-blue-500 animate-pulse" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED': return 'bg-green-500/10 text-green-500 border-green-200';
      case 'FAILED': return 'bg-red-500/10 text-red-500 border-red-200';
      default: return 'bg-blue-500/10 text-blue-500 border-blue-200';
    }
  };

  return (
    <Card 
      className="overflow-hidden hover:shadow-md transition-all cursor-pointer group"
      onClick={() => router.push(`/reviews/${review.id}`)}
    >
      <CardContent className="p-0">
        <div className="p-5 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between border-l-4"
          style={{ 
            borderLeftColor: review.status === 'COMPLETED' ? '#22c55e' : review.status === 'FAILED' ? '#ef4444' : '#3b82f6' 
          }}
        >
          <div className="flex gap-4 items-start">
            <div className="mt-1">
              {getStatusIcon(review.status)}
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-semibold text-lg">{review.repoName}</h3>
                <Badge variant="outline" className={getStatusColor(review.status)}>
                  {review.status}
                </Badge>
              </div>
              <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1 font-mono">
                  {review.targetType === 'COMMIT' ? <GitCommit className="h-3.5 w-3.5" /> : <GitPullRequest className="h-3.5 w-3.5" />}
                  {review.targetId.substring(0, 7)}
                </span>
                <span className="hidden sm:inline">•</span>
                <span>{format(new Date(review.createdAt), "MMM d, yyyy 'at' h:mm a")}</span>
                <span className="hidden sm:inline">•</span>
                <span>{formatDistanceToNow(new Date(review.createdAt), { addSuffix: true })}</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-6 mt-4 sm:mt-0 ml-9 sm:ml-0">
            {review.status === 'COMPLETED' && review.overallScore !== undefined && (
              <div className="flex flex-col items-end">
                <span className="text-2xl font-bold">{review.overallScore}</span>
                <span className="text-xs text-muted-foreground uppercase tracking-wider">Score</span>
              </div>
            )}
            {review.status === 'COMPLETED' && review.grade && (
              <div className="flex flex-col items-end border-l pl-4">
                <span className="text-2xl font-bold">{review.grade}</span>
                <span className="text-xs text-muted-foreground uppercase tracking-wider">Grade</span>
              </div>
            )}
            
            <div className="hidden sm:flex h-10 w-10 items-center justify-center rounded-full bg-secondary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
              <ArrowRight className="h-4 w-4" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
