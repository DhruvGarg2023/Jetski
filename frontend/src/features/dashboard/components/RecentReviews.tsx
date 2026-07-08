"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { motion } from "framer-motion";
import { formatDistanceToNow } from "date-fns";
import { CheckCircle2, Clock, XCircle } from "lucide-react";
import { Review } from "@/features/projects/types";
import { useRouter } from "next/navigation";
import { BorderBeam } from "@/components/magicui/border-beam";

interface RecentReviewsProps {
  reviews: Review[];
}

export function RecentReviews({ reviews }: RecentReviewsProps) {
  const router = useRouter();
  
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case "FAILED":
        return <XCircle className="h-4 w-4 text-red-500" />;
      case "IN_PROGRESS":
        return <Clock className="h-4 w-4 text-blue-500 animate-pulse" />;
      default:
        return null;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.3 }}
      className="col-span-1 lg:col-span-3"
    >
      <Card className="h-full relative overflow-hidden group bg-background/50 backdrop-blur-sm border-white/10 transition-colors hover:bg-muted/50">
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none">
          <BorderBeam size={400} duration={15} delay={2} />
        </div>
        <CardHeader>
          <CardTitle>Recent Reviews</CardTitle>
          <CardDescription>
            Your latest AI code review activity.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {reviews.length === 0 ? (
            <div className="flex h-[200px] items-center justify-center text-sm text-muted-foreground border-2 border-dashed rounded-md">
              No recent reviews found.
            </div>
          ) : (
            <div className="overflow-auto max-h-[350px]">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent border-b-white/5">
                    <TableHead>Status</TableHead>
                    <TableHead>Repository</TableHead>
                    <TableHead>Target</TableHead>
                    <TableHead className="text-right">Time</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {reviews.map((review) => (
                    <TableRow 
                      key={review.id} 
                      className="cursor-pointer transition-colors hover:bg-white/5 border-b-white/5"
                      onClick={() => router.push(`/reviews/${review.id}`)}
                    >
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getStatusIcon(review.status)}
                          <span className="text-sm capitalize">{review.status.toLowerCase()}</span>
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">
                        {(review as any).repoName || "Unknown Repo"}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="text-sm font-medium">{review.targetType}</span>
                          <span className="text-xs text-muted-foreground font-mono">{review.targetId?.substring(0, 7) || "N/A"}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right text-sm text-muted-foreground whitespace-nowrap">
                        {formatDistanceToNow(new Date(review.createdAt), { addSuffix: true })}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
