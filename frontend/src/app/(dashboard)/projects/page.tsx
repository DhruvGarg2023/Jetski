"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { projectsService } from "@/features/projects/projects.service";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Folder, Loader2, Plus, GitBranch } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDistanceToNow } from "date-fns";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { BorderBeam } from "@/components/magicui/border-beam";

export default function ProjectsPage() {
  const [open, setOpen] = useState(false);
  const [newProjectName, setNewProjectName] = useState("");
  const [repoOwner, setRepoOwner] = useState("");
  const [repoName, setRepoName] = useState("");
  const queryClient = useQueryClient();

  const { data: projects, isLoading, error } = useQuery({
    queryKey: ["projects"],
    queryFn: projectsService.getProjects,
  });

  const createMutation = useMutation({
    mutationFn: (payload: { projectName: string, repoOwner: string, repoName: string }) => projectsService.createProject(payload),
    onSuccess: () => {
      toast.success("Project created successfully!");
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      setOpen(false);
      setNewProjectName("");
      setRepoOwner("");
      setRepoName("");
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || "Failed to create project");
    },
  });

  const handleCreate = () => {
    if (!newProjectName.trim() || !repoOwner.trim() || !repoName.trim()) {
      toast.error("Please fill in all fields");
      return;
    }
    createMutation.mutate({
      projectName: newProjectName,
      repoOwner,
      repoName
    });
  };

  if (isLoading) {
    return (
      <div className="flex flex-col gap-6 w-full">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <Skeleton className="h-10 w-48 mb-2" />
            <Skeleton className="h-4 w-64" />
          </div>
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="flex flex-col opacity-50">
              <CardHeader>
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-1/3" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh] text-center">
        <div className="text-red-500 font-semibold mb-2">Error loading projects</div>
        <p className="text-muted-foreground text-sm">{(error as any).message}</p>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col gap-6 w-full pb-10"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Projects</h2>
          <p className="text-muted-foreground mt-1">
            Manage your workspace projects.
          </p>
        </div>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground shadow hover:bg-primary/90 h-9 px-4 py-2">
            <Plus className="mr-2 h-4 w-4" />
            Create Project
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Create New Project</DialogTitle>
              <DialogDescription>
                To create a project, you must connect an initial GitHub repository.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Project Name</Label>
                <Input
                  id="name"
                  placeholder="e.g. Acme Web App"
                  value={newProjectName}
                  onChange={(e) => setNewProjectName(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="owner">Repository Owner</Label>
                <Input
                  id="owner"
                  placeholder="e.g. facebook"
                  value={repoOwner}
                  onChange={(e) => setRepoOwner(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="repo">Repository Name</Label>
                <Input
                  id="repo"
                  placeholder="e.g. react"
                  value={repoName}
                  onChange={(e) => setRepoName(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleCreate()}
                />
              </div>
            </div>
            <DialogFooter>
              <Button 
                onClick={handleCreate} 
                disabled={createMutation.isPending || !newProjectName.trim() || !repoOwner.trim() || !repoName.trim()}
              >
                {createMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Create
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {projects?.length === 0 ? (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative flex flex-col items-center justify-center h-[50vh] border-2 border-dashed rounded-3xl gap-4 bg-muted/10 overflow-hidden"
        >
          {/* Subtle background glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
          
          <motion.div 
            animate={{ y: [0, -8, 0] }}
            transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
            className="rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 p-5 border border-primary/10 shadow-lg shadow-primary/5"
          >
            <Folder className="h-10 w-10 text-primary" />
          </motion.div>
          
          <h3 className="text-xl font-semibold tracking-tight mt-2">No projects found</h3>
          <p className="text-sm text-muted-foreground text-center max-w-sm">
            Get started by creating a new project and connecting a GitHub repository to begin AI code reviews.
          </p>
          <Button onClick={() => setOpen(true)} className="mt-4 shadow-lg shadow-primary/20">
            <Plus className="mr-2 h-4 w-4" /> Create First Project
          </Button>
        </motion.div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {projects?.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className="group relative"
            >
              <Card className="flex flex-col h-full bg-background/50 backdrop-blur-sm border-white/10 overflow-hidden shadow-sm transition-all hover:shadow-[0_8px_30px_rgba(139,92,246,0.12)]">
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none z-0">
                  <BorderBeam size={300} duration={10} delay={index} />
                </div>
                <CardHeader className="relative z-10">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <div className="rounded-full bg-primary/10 p-2 text-primary">
                      <Folder className="h-4 w-4" />
                    </div>
                    {project.name}
                  </CardTitle>
                  <CardDescription>
                    Created {formatDistanceToNow(new Date(project.createdAt), { addSuffix: true })}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-1 relative z-10">
                  <div className="text-sm text-muted-foreground flex items-center gap-2">
                    <div className="flex -space-x-2">
                      {/* Decorative dots to represent repos */}
                      {[...Array(Math.min(project.repositories?.length || 0, 3))].map((_, i) => (
                        <div key={i} className="h-6 w-6 rounded-full border-2 border-background bg-secondary flex items-center justify-center">
                          <GitBranch className="h-3 w-3 text-secondary-foreground" />
                        </div>
                      ))}
                      {(project.repositories?.length || 0) > 3 && (
                        <div className="h-6 w-6 rounded-full border-2 border-background bg-muted flex items-center justify-center text-[10px] font-medium">
                          +{(project.repositories?.length || 0) - 3}
                        </div>
                      )}
                    </div>
                    <span className="ml-2">{project.repositories?.length || 0} Connected {project.repositories?.length === 1 ? 'Repository' : 'Repositories'}</span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
}
