"use client";

import { Folder, GitBranch, Code, TrendingUp, Activity } from "lucide-react";
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
      trend: "+1 this week",
      trendColor: "text-emerald-500",
      trendIcon: TrendingUp
    },
    {
      title: "Connected Repositories",
      value: totalRepos,
      icon: GitBranch,
      description: "GitHub repositories synced",
      trend: "All synced",
      trendColor: "text-primary",
      trendIcon: Activity
    },
    {
      title: "Reviews Conducted",
      value: totalReviews,
      icon: Code,
      description: "AI code reviews performed",
      trend: "+12% vs last month",
      trendColor: "text-emerald-500",
      trendIcon: TrendingUp
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
          className="group relative"
        >
          <Card className="relative overflow-hidden h-full glass-subtle border-white/5 transition-all duration-300 card-hover">
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none">
              <BorderBeam size={250} duration={12} delay={index * 2} />
            </div>
            
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <div className="rounded-xl bg-primary/10 p-2 text-primary shadow-inner">
                <stat.icon className="h-4 w-4 transition-transform group-hover:scale-110 duration-300" />
              </div>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="text-3xl font-black tracking-tighter text-foreground mb-1">
                <NumberTicker value={stat.value} />
              </div>
              
              <div className="flex items-center gap-2 mt-3 pt-3 border-t border-border/50">
                <div className={`flex items-center gap-1 text-[11px] font-semibold ${stat.trendColor} bg-background/50 px-2 py-0.5 rounded-full`}>
                  <stat.trendIcon className="h-3 w-3" />
                  {stat.trend}
                </div>
                <p className="text-[11px] text-muted-foreground truncate">
                  {stat.description}
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}
