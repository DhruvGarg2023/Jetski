"use client";

import { useQuery } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import { projectsService } from "@/features/projects/projects.service";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CommitsList } from "@/features/github/components/CommitsList";
import { BranchesList } from "@/features/github/components/BranchesList";
import { PullRequestsList } from "@/features/github/components/PullRequestsList";
import { GitBranch, GitCommit, GitPullRequest, ArrowLeft, Code } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Repository } from "@/features/projects/types";

export default function RepositoryDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const repoId = params.id as string;

  // We fetch all projects to find this specific repository's details.
  // In a real app with many repos, you might want a dedicated GET /repositories/:id endpoint.
  const { data: projects, isLoading } = useQuery({
    queryKey: ["projects"],
    queryFn: projectsService.getProjects,
  });

  let repository: Repository | null = null;
  if (projects) {
    for (const project of projects) {
      if (project.repositories) {
        const found = project.repositories.find(r => r.id === repoId);
        if (found) {
          repository = found;
          break;
        }
      }
    }
  }

  if (isLoading) {
    return (
      <div className="flex flex-col gap-6">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-96 w-full mt-4" />
      </div>
    );
  }

  if (!repository) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh] text-center gap-4">
        <div className="text-xl font-semibold">Repository not found</div>
        <Button onClick={() => router.push('/repositories')} variant="outline">
          Back to Repositories
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 w-full">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.push('/repositories')}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h2 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <GitBranch className="h-7 w-7 text-muted-foreground" />
            {repository.fullName}
          </h2>
          <p className="text-muted-foreground mt-1 text-sm flex items-center gap-2">
            <Code className="h-4 w-4" /> Default branch: {repository.defaultBranch}
          </p>
        </div>
      </div>

      <Tabs defaultValue="commits" className="w-full mt-4">
        <TabsList className="grid w-full grid-cols-3 max-w-[400px]">
          <TabsTrigger value="commits" className="flex items-center gap-2">
            <GitCommit className="h-4 w-4" /> Commits
          </TabsTrigger>
          <TabsTrigger value="branches" className="flex items-center gap-2">
            <GitBranch className="h-4 w-4" /> Branches
          </TabsTrigger>
          <TabsTrigger value="pulls" className="flex items-center gap-2">
            <GitPullRequest className="h-4 w-4" /> Pull Requests
          </TabsTrigger>
        </TabsList>
        
        <div className="mt-6">
          <TabsContent value="commits" className="mt-0">
            <CommitsList connectionId={repository.id} />
          </TabsContent>
          <TabsContent value="branches" className="mt-0">
            <BranchesList connectionId={repository.id} />
          </TabsContent>
          <TabsContent value="pulls" className="mt-0">
            <PullRequestsList connectionId={repository.id} />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
