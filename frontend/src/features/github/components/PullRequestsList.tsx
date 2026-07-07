"use client";

import { useQuery, useMutation } from "@tanstack/react-query";
import { githubService } from "../github.service";
import { GithubPullRequest } from "../types";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDistanceToNow } from "date-fns";
import { GitPullRequest, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { reviewsService } from "@/features/reviews/reviews.service";
import { toast } from "sonner";

export function PullRequestsList({ connectionId }: { connectionId: string }) {
  const token = typeof window !== "undefined" ? localStorage.getItem("github_pat") : null;

  const { data: pullRequests, isLoading, error } = useQuery({
    queryKey: ["pullRequests", connectionId, token],
    queryFn: () => githubService.getPullRequests(connectionId, token!),
    enabled: !!token && !!connectionId,
  });

  const reviewMutation = useMutation({
    mutationFn: (targetId: string) => reviewsService.initiateReview({
      repoId: connectionId,
      targetType: 'PR',
      targetId,
      githubToken: token!
    }),
    onSuccess: () => {
      toast.success("Review initiated successfully");
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || "Failed to initiate review");
    }
  });

  if (!token) {
    return <div className="p-4 text-center text-muted-foreground">GitHub PAT is required to view pull requests.</div>;
  }

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4 p-2">
        <Skeleton className="h-20 w-full rounded-md" />
        <Skeleton className="h-20 w-full rounded-md" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-center text-red-500">
        Failed to load pull requests. {(error as any).message}
      </div>
    );
  }

  if (!pullRequests || pullRequests.length === 0) {
    return <div className="p-4 text-center text-muted-foreground">No open pull requests found.</div>;
  }

  return (
    <div className="flex flex-col gap-3">
      {pullRequests.map((pr: GithubPullRequest) => (
        <div key={pr.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border rounded-lg bg-card hover:bg-accent/50 transition-colors">
          <div className="flex gap-4">
            <div className="mt-1">
              <GitPullRequest className={`h-5 w-5 ${pr.state === 'open' ? 'text-green-500' : 'text-purple-500'}`} />
            </div>
            <div className="flex flex-col">
              <span className="font-semibold text-sm line-clamp-1">{pr.title}</span>
              <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                <span className="font-medium text-foreground">#{pr.number}</span>
                <span>opened by {pr.user}</span>
                <span>•</span>
                <span>{formatDistanceToNow(new Date(pr.createdAt), { addSuffix: true })}</span>
              </div>
            </div>
          </div>
          <div className="mt-4 sm:mt-0 flex items-center gap-4">
            <a 
              href={pr.htmlUrl} 
              target="_blank" 
              rel="noreferrer"
              className="flex items-center gap-2 text-sm bg-secondary text-secondary-foreground hover:bg-secondary/80 px-3 py-1.5 rounded-md transition-colors"
            >
              View on GitHub
              <ExternalLink className="h-3 w-3" />
            </a>
            <Button
              variant="default"
              size="sm"
              disabled={reviewMutation.isPending && reviewMutation.variables === pr.number.toString()}
              onClick={() => reviewMutation.mutate(pr.number.toString())}
            >
              Review
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}
