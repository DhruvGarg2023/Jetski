"use client";

import { useQuery } from "@tanstack/react-query";
import { projectsService } from "@/features/projects/projects.service";
import { ConnectRepoModal } from "@/features/github/components/ConnectRepoModal";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button, buttonVariants } from "@/components/ui/button";
import { GitBranch, Code, ExternalLink, CalendarDays } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";
import { Repository } from "@/features/projects/types";

export default function RepositoriesPage() {
  const { data: projects, isLoading, error } = useQuery({
    queryKey: ["projects"],
    queryFn: projectsService.getProjects,
  });

  if (isLoading) {
    return (
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <Skeleton className="h-10 w-48" />
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <Skeleton className="h-48 rounded-xl" />
          <Skeleton className="h-48 rounded-xl" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh] text-center">
        <div className="text-red-500 font-semibold mb-2">Error loading repositories</div>
        <p className="text-muted-foreground text-sm">{(error as any).message}</p>
      </div>
    );
  }

  // Flatten all repos from all projects
  const allRepos = projects?.reduce((acc: Repository[], project) => {
    if (project.repositories) {
      // Inject project name for display purposes if wanted
      const reposWithProject = project.repositories.map(repo => ({
        ...repo,
        projectName: project.name
      }));
      return [...acc, ...reposWithProject];
    }
    return acc;
  }, []) || [];

  return (
    <div className="flex flex-col gap-6 w-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Repositories</h2>
          <p className="text-muted-foreground mt-1">
            Manage your connected GitHub repositories.
          </p>
        </div>
        <ConnectRepoModal />
      </div>

      {allRepos.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-[40vh] border-2 border-dashed rounded-xl gap-4">
          <GitBranch className="h-12 w-12 text-muted-foreground opacity-50" />
          <h3 className="text-lg font-medium">No repositories connected</h3>
          <p className="text-sm text-muted-foreground text-center max-w-sm">
            You haven't connected any GitHub repositories yet. Click the button above to link one.
          </p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {allRepos.map((repo) => (
            <Card key={repo.id} className="flex flex-col hover:border-primary/50 transition-colors">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <GitBranch className="h-5 w-5 text-muted-foreground" />
                  {repo.fullName}
                </CardTitle>
                <CardDescription>
                  In project: <span className="font-medium text-foreground">{(repo as any).projectName}</span>
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-1">
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                  <Code className="h-4 w-4" /> Default branch: {repo.defaultBranch}
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CalendarDays className="h-4 w-4" /> Connected {formatDistanceToNow(new Date(repo.createdAt), { addSuffix: true })}
                </div>
              </CardContent>
              <CardFooter className="pt-4 border-t">
                <Link href={`/repositories/${repo.id}`} className={buttonVariants({ variant: "secondary", className: "w-full" })}>
                  View Details
                  <ExternalLink className="ml-2 h-4 w-4" />
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
