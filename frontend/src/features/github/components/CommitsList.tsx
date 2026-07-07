"use client";

import { useQuery } from "@tanstack/react-query";
import { githubService } from "../github.service";
import { GithubCommit } from "../types";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDistanceToNow } from "date-fns";
import { GitCommit, ExternalLink } from "lucide-react";

export function CommitsList({ connectionId }: { connectionId: string }) {
  const token = typeof window !== "undefined" ? localStorage.getItem("github_pat") : null;

  const { data: commits, isLoading, error } = useQuery({
    queryKey: ["commits", connectionId, token],
    queryFn: () => githubService.getCommits(connectionId, token!),
    enabled: !!token && !!connectionId,
  });

  if (!token) {
    return <div className="p-4 text-center text-muted-foreground">GitHub PAT is required to view commits.</div>;
  }

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4 p-2">
        <Skeleton className="h-16 w-full rounded-md" />
        <Skeleton className="h-16 w-full rounded-md" />
        <Skeleton className="h-16 w-full rounded-md" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-center text-red-500">
        Failed to load commits. {(error as any).message}
      </div>
    );
  }

  if (!commits || commits.length === 0) {
    return <div className="p-4 text-center text-muted-foreground">No commits found.</div>;
  }

  return (
    <div className="flex flex-col gap-2">
      {commits.map((commit: GithubCommit) => (
        <div key={commit.sha} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border rounded-lg bg-card hover:bg-accent/50 transition-colors">
          <div className="flex gap-4">
            <div className="mt-1">
              <GitCommit className="h-5 w-5 text-muted-foreground" />
            </div>
            <div className="flex flex-col">
              <span className="font-semibold text-sm line-clamp-1">{commit.message}</span>
              <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                <span className="font-medium text-foreground">{commit.author}</span>
                <span>•</span>
                <span>{formatDistanceToNow(new Date(commit.date), { addSuffix: true })}</span>
              </div>
            </div>
          </div>
          <div className="mt-4 sm:mt-0 flex items-center gap-4">
            <code className="text-xs bg-muted px-2 py-1 rounded text-muted-foreground">
              {commit.sha.substring(0, 7)}
            </code>
            <a 
              href={commit.url} 
              target="_blank" 
              rel="noreferrer"
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              <ExternalLink className="h-4 w-4" />
            </a>
          </div>
        </div>
      ))}
    </div>
  );
}
