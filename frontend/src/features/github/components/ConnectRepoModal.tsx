"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Plus, GitBranch, GitFork } from "lucide-react";
import { toast } from "sonner";
import { githubService } from "../github.service";
import { projectsService } from "@/features/projects/projects.service";
import { RemoteRepo } from "../types";
import { Label } from "@/components/ui/label";

export function ConnectRepoModal() {
  const [open, setOpen] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState<string>("");
  const [selectedRepo, setSelectedRepo] = useState<string>("");
  const queryClient = useQueryClient();

  const token = typeof window !== "undefined" ? localStorage.getItem("github_pat") : null;

  const { data: projects, isLoading: loadingProjects } = useQuery({
    queryKey: ["projects"],
    queryFn: projectsService.getProjects,
  });

  const { data: remoteRepos, isLoading: loadingRepos, error: reposError } = useQuery({
    queryKey: ["remoteRepos", token],
    queryFn: () => githubService.listRemoteRepos(token!),
    enabled: !!token && open, // Only fetch when modal is open and token exists
  });

  const connectMutation = useMutation({
    mutationFn: (repo: RemoteRepo) => {
      return githubService.connectRepo({
        projectId: selectedProjectId,
        githubRepoId: repo.id.toString(),
        fullName: repo.fullName,
        defaultBranch: repo.defaultBranch || "main",
        personalAccessToken: token!,
      });
    },
    onSuccess: () => {
      toast.success("Repository connected successfully!");
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      setOpen(false);
      setSelectedRepo("");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to connect repository");
    },
  });

  const handleConnect = () => {
    if (!selectedProjectId) {
      toast.error("Please select a project");
      return;
    }
    if (!selectedRepo) {
      toast.error("Please select a repository");
      return;
    }
    const repoDetails = remoteRepos?.find(r => r.id.toString() === selectedRepo);
    if (repoDetails) {
      connectMutation.mutate(repoDetails);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground shadow hover:bg-primary/90 h-9 px-4 py-2">
        <Plus className="mr-2 h-4 w-4" />
        Connect Repository
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Connect GitHub Repository</DialogTitle>
          <DialogDescription>
            Select a project and choose a repository from your GitHub account to connect.
          </DialogDescription>
        </DialogHeader>

        {!token ? (
          <div className="py-6 text-center text-sm flex flex-col items-center gap-4">
            <GitFork className="h-8 w-8 text-muted-foreground" />
            <p>You need to configure your GitHub Personal Access Token first.</p>
            <Button variant="outline" onClick={() => window.location.href = '/settings'}>
              Go to Settings
            </Button>
          </div>
        ) : (
          <div className="grid gap-6 py-4">
            <div className="grid gap-2">
              <Label>Target Project</Label>
              <Select value={selectedProjectId} onValueChange={(val) => { if (val) setSelectedProjectId(val); }}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a project" />
                </SelectTrigger>
                <SelectContent>
                  {loadingProjects ? (
                    <div className="flex items-center justify-center p-2 text-sm">Loading projects...</div>
                  ) : projects?.length === 0 ? (
                    <div className="flex items-center justify-center p-2 text-sm">No projects found. Create one first!</div>
                  ) : (
                    projects?.map((project) => (
                      <SelectItem key={project.id} value={project.id}>
                        {project.name}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label>GitHub Repository</Label>
              {reposError ? (
                <div className="text-sm text-red-500 bg-red-500/10 p-3 rounded-md">
                  Failed to fetch repositories. Please check if your PAT is valid and has 'repo' scope.
                </div>
              ) : (
                <Select value={selectedRepo} onValueChange={(val) => { if (val) setSelectedRepo(val); }}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a repository" />
                  </SelectTrigger>
                  <SelectContent>
                    {loadingRepos ? (
                      <div className="flex items-center justify-center p-2 text-sm text-muted-foreground gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" /> Fetching from GitHub...
                      </div>
                    ) : remoteRepos?.length === 0 ? (
                      <div className="flex items-center justify-center p-2 text-sm">No repositories found.</div>
                    ) : (
                      remoteRepos?.map((repo) => (
                        <SelectItem key={repo.id} value={repo.id.toString()}>
                          <div className="flex items-center gap-2">
                            <GitBranch className="h-4 w-4 text-muted-foreground" />
                            <span>{repo.fullName}</span>
                          </div>
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              )}
            </div>

            <Button
              className="w-full mt-4"
              onClick={handleConnect}
              disabled={connectMutation.isPending || !selectedProjectId || !selectedRepo}
            >
              {connectMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Connecting...
                </>
              ) : (
                "Connect Repository"
              )}
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
