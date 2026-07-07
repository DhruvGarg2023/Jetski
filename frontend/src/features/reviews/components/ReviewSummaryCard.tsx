import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ReviewResponse } from '../types';
import { Progress } from '@/components/ui/progress';

interface ReviewSummaryCardProps {
  review: ReviewResponse;
}

export function ReviewSummaryCard({ review }: ReviewSummaryCardProps) {
  const getGradeColor = (grade: string) => {
    switch (grade?.toUpperCase()) {
      case 'A': return 'text-green-500';
      case 'B': return 'text-blue-500';
      case 'C': return 'text-yellow-500';
      case 'D': return 'text-orange-500';
      case 'F': return 'text-red-500';
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
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>Executive Summary</span>
          {review.grade && (
            <div className="flex items-center gap-2">
              <span className="text-sm font-normal text-muted-foreground">Grade</span>
              <span className={`text-2xl font-bold ${getGradeColor(review.grade)}`}>
                {review.grade}
              </span>
            </div>
          )}
        </CardTitle>
        <CardDescription>Overall AI assessment of these changes.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {review.overallScore !== undefined && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm font-medium">
              <span>Overall Score</span>
              <span>{review.overallScore}/100</span>
            </div>
            <Progress 
              value={review.overallScore} 
              className="h-2" 
              indicatorClassName={getScoreColorClass(review.overallScore)}
            />
          </div>
        )}
        
        <div className="bg-muted p-4 rounded-lg whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground">
          {review.summary || "No summary provided."}
        </div>
      </CardContent>
    </Card>
  );
}
