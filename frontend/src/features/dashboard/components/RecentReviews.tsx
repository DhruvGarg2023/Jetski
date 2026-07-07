"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { motion } from "framer-motion";
import { formatDistanceToNow } from "date-fns";
import { CheckCircle2, Clock, XCircle } from "lucide-react";
import { Review } from "@/features/projects/types";

interface RecentReviewsProps {
  reviews: Review[];
}

export function RecentReviews({ reviews }: RecentReviewsProps) {
  
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case "FAILED":
        return <XCircle className="h-4 w-4 text-red-500" />;
      case "PENDING":
      case "PROCESSING":
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
      <Card className="h-full">
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
                  <TableRow>
                    <TableHead>Status</TableHead>
                    <TableHead>Repository</TableHead>
                    <TableHead>Branch / Commit</TableHead>
                    <TableHead className="text-right">Time</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {reviews.map((review) => (
                    <TableRow key={review.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getStatusIcon(review.status)}
                          <span className="text-sm capitalize">{review.status.toLowerCase()}</span>
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">
                        {/* We will map repo name separately if possible, else placeholder */}
                        {(review as any).repoName || "Unknown Repo"}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="text-sm font-medium">{review.branchName}</span>
                          <span className="text-xs text-muted-foreground font-mono">{review.commitHash.substring(0, 7)}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right text-sm text-muted-foreground">
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
