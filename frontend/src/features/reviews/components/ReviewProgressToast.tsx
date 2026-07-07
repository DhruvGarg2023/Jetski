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
      setMessages(["Initializing review..."]);
      setStatus("pending");
    };

    const handleProgress = (data: { message: string }) => {
      setMessages((prev) => [...prev, data.message]);
      setStatus("progress");
    };

    const handleComplete = (data: any) => {
      setActiveReview((prev) => prev ? { ...prev, reviewId: data.id } : null);
      setMessages((prev) => [...prev, "Review completed successfully!"]);
      setStatus("complete");
    };

    const handleError = (data: { message: string }) => {
      setMessages((prev) => [...prev, data.message]);
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
          className="fixed bottom-6 right-6 z-50 w-96 shadow-2xl"
        >
          <Card className="border-2 border-primary/20">
            <CardHeader className="pb-3 border-b bg-muted/30">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                  {status === "pending" || status === "progress" ? (
                    <Loader2 className="h-4 w-4 animate-spin text-primary" />
                  ) : status === "complete" ? (
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                  ) : (
                    <XCircle className="h-4 w-4 text-red-500" />
                  )}
                  AI Review: {activeReview.targetId.substring(0, 7)}
                </CardTitle>
                {(status === "complete" || status === "error") && (
                  <Button variant="ghost" size="icon" className="h-6 w-6" onClick={handleDismiss}>
                    <XCircle className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent className="pt-4 flex flex-col gap-3">
              <div className="text-xs text-muted-foreground bg-muted p-2 rounded-md h-24 overflow-y-auto flex flex-col-reverse">
                {messages.map((msg, idx) => (
                  <div key={idx} className="flex items-center gap-2 py-0.5">
                    <span className="text-[10px] opacity-50">{(messages.length - idx).toString().padStart(2, '0')}</span>
                    {msg}
                  </div>
                ))}
              </div>

              {status === "complete" && (
                <Button onClick={handleViewReport} className="w-full" size="sm">
                  View Full Report
                </Button>
              )}
            </CardContent>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
