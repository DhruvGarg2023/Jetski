"use client";

import { Folder, GitBranch, Code } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { NumberTicker } from "@/components/magicui/number-ticker";
import { BorderBeam } from "@/components/magicui/border-beam";

interface StatCardsProps {
  totalProjects: number;
  totalRepos: number;
  totalReviews: number;
}

export function StatCards({ totalProjects, totalRepos, totalReviews }: StatCardsProps) {
  const stats = [
    {
      title: "Total Projects",
      value: totalProjects,
      icon: Folder,
      description: "Active projects in your workspace",
    },
    {
      title: "Connected Repositories",
      value: totalRepos,
      icon: GitBranch,
      description: "GitHub repositories synced",
    },
    {
      title: "Reviews Conducted",
      value: totalReviews,
      icon: Code,
      description: "AI code reviews performed",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-3">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
          className="relative group"
        >
          <Card className="relative overflow-hidden h-full border-white/10 bg-background/50 backdrop-blur-sm transition-colors hover:bg-muted/50">
            <BorderBeam size={250} duration={12} delay={index * 2} />
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <div className="rounded-full bg-primary/10 p-2 text-primary">
                <stat.icon className="h-4 w-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold tracking-tight">
                <NumberTicker value={stat.value} />
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}
