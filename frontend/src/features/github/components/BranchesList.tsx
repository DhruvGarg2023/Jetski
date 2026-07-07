"use client";

import { useQuery } from "@tanstack/react-query";
import { githubService } from "../github.service";
import { GithubBranch } from "../types";
import { Skeleton } from "@/components/ui/skeleton";
import { GitBranch } from "lucide-react";

export function BranchesList({ connectionId }: { connectionId: string }) {
  const token = typeof window !== "undefined" ? localStorage.getItem("github_pat") : null;

  const { data: branches, isLoading, error } = useQuery({
    queryKey: ["branches", connectionId, token],
    queryFn: () => githubService.getBranches(connectionId, token!),
    enabled: !!token && !!connectionId,
  });

  if (!token) {
    return <div className="p-4 text-center text-muted-foreground">GitHub PAT is required to view branches.</div>;
  }

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-2">
        <Skeleton className="h-14 w-full rounded-md" />
        <Skeleton className="h-14 w-full rounded-md" />
        <Skeleton className="h-14 w-full rounded-md" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-center text-red-500">
        Failed to load branches. {(error as any).message}
      </div>
    );
  }

  if (!branches || branches.length === 0) {
    return <div className="p-4 text-center text-muted-foreground">No branches found.</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {branches.map((branch: GithubBranch) => (
        <div key={branch.name} className="flex items-center justify-between p-4 border rounded-lg bg-card hover:bg-accent/50 transition-colors">
          <div className="flex items-center gap-3">
            <GitBranch className="h-5 w-5 text-muted-foreground" />
            <span className="font-semibold text-sm">{branch.name}</span>
          </div>
          <code className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
            {branch.commitSha.substring(0, 7)}
          </code>
        </div>
      ))}
    </div>
  );
}
