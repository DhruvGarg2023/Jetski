import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ReviewResponse } from '../types';
import { motion } from 'framer-motion';

interface ReviewSummaryCardProps {
  review: ReviewResponse;
}

export function ReviewSummaryCard({ review }: ReviewSummaryCardProps) {
  const getGradeTheme = (grade: string) => {
    switch (grade?.toUpperCase()) {
      case 'A': 
      case 'B': 
        return { color: 'text-[#00E5FF]', border: 'border-[#00E5FF]/30', bg: 'bg-[#00E5FF]/10' };
      case 'C': 
      case 'D': 
      case 'F': 
        return { color: 'text-[#FF4F00]', border: 'border-[#FF4F00]/30', bg: 'bg-[#FF4F00]/10' };
      default: 
        return { color: 'text-[#7E8494]', border: 'border-[#7E8494]/30', bg: 'bg-[#7E8494]/10' };
    }
  };

  const gradeTheme = getGradeTheme(review.grade || '');

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Card className="rounded-none border border-white/10 bg-[#0F1014] shadow-none overflow-hidden relative">
        <CardHeader className="border-b border-white/10 bg-[#181A20] p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <CardTitle className="text-xs font-mono text-[#7E8494] tracking-widest uppercase mb-1">
              Diagnostic_Readout //
            </CardTitle>
            <h2 className="text-xl font-medium tracking-tight text-[#F3F4F6]">Executive Summary</h2>
          </div>
          
          {review.grade && (
            <div className={`flex flex-col items-end border-l-4 ${gradeTheme.border} pl-4`}>
              <span className="text-[10px] font-mono tracking-widest uppercase text-[#7E8494]">Overall_Grade</span>
              <span className={`text-4xl font-mono font-bold leading-none mt-1 ${gradeTheme.color}`}>
                [{review.grade}]
              </span>
            </div>
          )}
        </CardHeader>
        
        <CardContent className="p-0 flex flex-col md:flex-row">
          {/* Score Matrix Sidebar */}
          {review.overallScore !== undefined && (
            <div className="w-full md:w-48 border-b md:border-b-0 md:border-r border-white/10 bg-[#181A20]/50 p-6 flex flex-col justify-center shrink-0">
              <span className="text-xs font-mono text-[#7E8494] tracking-widest uppercase mb-2 block">System_Score</span>
              <div className="flex items-baseline gap-1">
                <span className={`text-5xl font-mono font-black ${review.overallScore >= 80 ? 'text-[#00E5FF]' : 'text-[#FF4F00]'}`}>
                  {review.overallScore}
                </span>
                <span className="text-sm font-mono text-[#7E8494]">/100</span>
              </div>
              <div className="mt-6 flex flex-col gap-1">
                {/* ASCII styled progress bar */}
                <div className="flex justify-between text-[10px] font-mono text-[#7E8494] mb-1">
                  <span>[0]</span>
                  <span>[100]</span>
                </div>
                <div className="h-2 w-full bg-black border border-white/10">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${review.overallScore}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className={`h-full ${review.overallScore >= 80 ? 'bg-[#00E5FF]' : 'bg-[#FF4F00]'}`}
                  />
                </div>
              </div>
            </div>
          )}
          
          {/* Summary Narrative */}
          <div className="p-6 md:p-8 flex-1">
            <div className="font-mono text-xs text-[#7E8494] mb-4 tracking-widest uppercase">
              {'>'} Analysis_Log
            </div>
            <div className="whitespace-pre-wrap text-[15px] leading-relaxed text-[#F3F4F6] font-sans opacity-90">
              {review.summary || "No diagnostic summary provided by the system."}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
