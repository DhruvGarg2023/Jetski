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
import { motion } from "framer-motion";
import { BorderBeam } from "@/components/magicui/border-beam";

export default function RepositoriesPage() {
  const { data: projects, isLoading, error } = useQuery({
    queryKey: ["projects"],
    queryFn: projectsService.getProjects,
  });

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
              <CardContent className="space-y-2">
                <Skeleton className="h-4 w-2/3" />
                <Skeleton className="h-4 w-1/2" />
              </CardContent>
              <CardFooter className="pt-4 border-t">
                <Skeleton className="h-10 w-full" />
              </CardFooter>
            </Card>
          ))}
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
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col gap-6 w-full pb-10"
    >
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
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative flex flex-col items-center justify-center h-[50vh] border-2 border-dashed rounded-3xl gap-4 bg-muted/10 overflow-hidden"
        >
          {/* Subtle background glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
          
          <motion.div 
            animate={{ y: [0, -8, 0] }}
            transition={{ repeat: Infinity, duration: 3, ease: "easeInOut", delay: 0.2 }}
            className="rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 p-5 border border-primary/10 shadow-lg shadow-primary/5"
          >
            <GitBranch className="h-10 w-10 text-primary" />
          </motion.div>
          
          <h3 className="text-xl font-semibold tracking-tight mt-2">No repositories connected</h3>
          <p className="text-sm text-muted-foreground text-center max-w-sm">
            You haven't connected any GitHub repositories yet. Click the button above to link one and start reviewing code.
          </p>
        </motion.div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {allRepos.map((repo, index) => (
            <motion.div
              key={repo.id}
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
                      <GitBranch className="h-4 w-4" />
                    </div>
                    <span className="truncate">{repo.fullName}</span>
                  </CardTitle>
                  <CardDescription className="flex items-center mt-2">
                    <span className="inline-flex items-center rounded-md bg-secondary px-2 py-1 text-xs font-medium text-secondary-foreground ring-1 ring-inset ring-secondary-foreground/10">
                      {(repo as any).projectName}
                    </span>
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-1 relative z-10">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                    <Code className="h-4 w-4 text-primary/70" /> Default branch: <span className="font-mono text-foreground">{repo.defaultBranch}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <CalendarDays className="h-4 w-4 text-primary/70" /> Connected {formatDistanceToNow(new Date(repo.createdAt), { addSuffix: true })}
                  </div>
                </CardContent>
                <CardFooter className="pt-4 border-t border-white/5 relative z-10">
                  <Link href={`/repositories/${repo.id}`} className={buttonVariants({ variant: "secondary", className: "w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors" })}>
                    View Details
                    <ExternalLink className="ml-2 h-4 w-4" />
                  </Link>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
}
