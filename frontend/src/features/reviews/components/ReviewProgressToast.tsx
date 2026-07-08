"use client";

import { useEffect, useState } from "react";
import { useSocket } from "@/providers/socket-provider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, CheckCircle2, XCircle, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";

interface ReviewProgressData {
  targetId: string;
  targetType: string;
  message?: string;
  status?: string;
  reviewId?: string;
}

import { AnimatedTerminal } from "@/components/magicui/animated-terminal";
import { BorderBeam } from "@/components/magicui/border-beam";

export function ReviewProgressToast() {
  const { socket, isConnected } = useSocket();
  const router = useRouter();
  const [activeReview, setActiveReview] = useState<ReviewProgressData | null>(null);
  const [messages, setMessages] = useState<string[]>([]);
  const [status, setStatus] = useState<"pending" | "progress" | "complete" | "error" | null>(null);

  useEffect(() => {
    if (!socket) return;

    const handleStart = (data: { targetId: string; targetType: string; repoId: string }) => {
      setActiveReview({ targetId: data.targetId, targetType: data.targetType });
      setMessages(["Initializing review process..."]);
      setStatus("pending");
    };

    const handleProgress = (data: { message: string }) => {
      setMessages((prev) => [...prev, data.message]);
      setStatus("progress");
    };

    const handleComplete = (data: any) => {
      setActiveReview((prev) => prev ? { ...prev, reviewId: data.id } : null);
      setMessages((prev) => [...prev, "Analysis complete. Generating report..."]);
      setStatus("complete");
    };

    const handleError = (data: { message: string }) => {
      setMessages((prev) => [...prev, `Error: ${data.message}`]);
      setStatus("error");
    };

    socket.on("review:start", handleStart);
    socket.on("review:progress", handleProgress);
    socket.on("review:complete", handleComplete);
    socket.on("review:error", handleError);

    return () => {
      socket.off("review:start", handleStart);
      socket.off("review:progress", handleProgress);
      socket.off("review:complete", handleComplete);
      socket.off("review:error", handleError);
    };
  }, [socket]);

  const handleDismiss = () => {
    setActiveReview(null);
    setMessages([]);
    setStatus(null);
  };

  const handleViewReport = () => {
    if (activeReview?.reviewId) {
      router.push(`/reviews/${activeReview.reviewId}`);
      handleDismiss();
    }
  };

  if (!activeReview) return null;

  return (
    <AnimatePresence>
      {activeReview && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 50, scale: 0.95 }}
          className="fixed bottom-6 right-6 z-50 w-[400px] shadow-2xl"
        >
          <div className="relative rounded-xl overflow-hidden bg-background/80 backdrop-blur-xl border border-white/10 shadow-[0_20px_50px_rgba(139,92,246,0.15)]">
            {(status === "pending" || status === "progress") && (
              <BorderBeam size={200} duration={8} delay={0} />
            )}
            
            <div className="flex items-center justify-between p-4 border-b border-white/5 bg-black/40">
              <div className="flex items-center gap-3">
                {status === "pending" || status === "progress" ? (
                  <div className="h-2 w-2 rounded-full bg-primary animate-ping" />
                ) : status === "complete" ? (
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                ) : (
                  <XCircle className="h-4 w-4 text-red-500" />
                )}
                <span className="text-sm font-medium">
                  {status === "complete" ? "Review Completed" : status === "error" ? "Review Failed" : "AI Review in Progress"}
                </span>
              </div>
              {(status === "complete" || status === "error") && (
                <Button variant="ghost" size="icon" className="h-6 w-6 rounded-full hover:bg-white/10" onClick={handleDismiss}>
                  <XCircle className="h-4 w-4" />
                </Button>
              )}
            </div>
            
            <div className="p-4 flex flex-col gap-4">
              <AnimatedTerminal 
                messages={messages} 
                isComplete={status === "complete" || status === "error"} 
              />

              {status === "complete" && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <Button 
                    onClick={handleViewReport} 
                    className="w-full shadow-lg shadow-primary/25 group" 
                  >
                    View Premium Report
                    <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
                  </Button>
                </motion.div>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
