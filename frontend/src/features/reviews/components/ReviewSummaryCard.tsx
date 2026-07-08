import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ReviewResponse } from '../types';
import { Progress } from '@/components/ui/progress';
import { BorderBeam } from '@/components/magicui/border-beam';
import { NumberTicker } from '@/components/magicui/number-ticker';
import { motion } from 'framer-motion';

interface ReviewSummaryCardProps {
  review: ReviewResponse;
}

export function ReviewSummaryCard({ review }: ReviewSummaryCardProps) {
  const getGradeColor = (grade: string) => {
    switch (grade?.toUpperCase()) {
      case 'A': return 'text-green-500 drop-shadow-[0_0_10px_rgba(34,197,94,0.5)]';
      case 'B': return 'text-blue-500 drop-shadow-[0_0_10px_rgba(59,130,246,0.5)]';
      case 'C': return 'text-yellow-500 drop-shadow-[0_0_10px_rgba(234,179,8,0.5)]';
      case 'D': return 'text-orange-500 drop-shadow-[0_0_10px_rgba(249,115,22,0.5)]';
      case 'F': return 'text-red-500 drop-shadow-[0_0_10px_rgba(239,68,68,0.5)]';
      default: return 'text-muted-foreground';
    }
  };

  const getScoreColorClass = (score: number) => {
    if (score >= 90) return 'bg-green-500';
    if (score >= 80) return 'bg-blue-500';
    if (score >= 70) return 'bg-yellow-500';
    if (score >= 60) return 'bg-orange-500';
    return 'bg-red-500';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="group relative"
    >
      <Card className="shadow-md bg-background/50 backdrop-blur-md border-white/10 overflow-hidden relative">
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none">
          <BorderBeam size={400} duration={12} delay={0} />
        </div>
        <CardHeader className="relative z-10">
          <CardTitle className="flex justify-between items-center text-xl">
            <span>Executive Summary</span>
            {review.grade && (
              <div className="flex items-center gap-3 bg-white/5 px-4 py-2 rounded-full border border-white/10 shadow-inner">
                <span className="text-sm font-medium text-muted-foreground">Grade</span>
                <span className={`text-3xl font-black ${getGradeColor(review.grade)}`}>
                  {review.grade}
                </span>
              </div>
            )}
          </CardTitle>
          <CardDescription className="text-base">Overall AI assessment of these changes.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-8 relative z-10">
          {review.overallScore !== undefined && (
            <div className="space-y-3 bg-white/5 p-5 rounded-xl border border-white/5">
              <div className="flex justify-between items-baseline text-sm font-medium">
                <span className="text-muted-foreground uppercase tracking-wider text-xs font-semibold">Quality Score</span>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-bold font-mono">
                    <NumberTicker value={review.overallScore} />
                  </span>
                  <span className="text-muted-foreground font-mono">/100</span>
                </div>
              </div>
              <Progress 
                value={review.overallScore} 
                className="h-3 rounded-full overflow-hidden bg-black/40 shadow-inner" 
                indicatorClassName={getScoreColorClass(review.overallScore)}
              />
            </div>
          )}
          
          <div className="bg-black/30 p-6 rounded-xl border border-white/5 whitespace-pre-wrap text-[15px] leading-relaxed text-gray-300 shadow-inner backdrop-blur-sm">
            {review.summary || "No summary provided."}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
