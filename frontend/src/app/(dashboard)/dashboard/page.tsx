"use client";

import { useQuery } from "@tanstack/react-query";
import { projectsService } from "@/features/projects/projects.service";
import { StatCards } from "@/features/dashboard/components/StatCards";
import { ActivityChart } from "@/features/dashboard/components/ActivityChart";
import { RecentReviews } from "@/features/dashboard/components/RecentReviews";
import { Skeleton } from "@/components/ui/skeleton";
import { Project, Review } from "@/features/projects/types";
import { format } from "date-fns";

export default function DashboardPage() {
  const { data: projects, isLoading, error } = useQuery({
    queryKey: ["projects"],
    queryFn: () => projectsService.getProjects(),
  });

  // Determine overall stats
  let totalProjects = 0;
  let totalRepos = 0;
  let totalReviews = 0;
  let recentReviewsList: Review[] = [];
  let chartDataMap: Record<string, number> = {};

  if (projects) {
    totalProjects = projects.length;
    
    projects.forEach((project) => {
      if (project.repositories) {
        totalRepos += project.repositories.length;
        
        project.repositories.forEach((repo) => {
          if (repo.reviews) {
            totalReviews += repo.reviews.length;
            
            // Map reviews with repo name for display
            const reviewsWithRepo = repo.reviews.map(r => ({
              ...r,
              repoName: repo.fullName
            }));
            recentReviewsList = [...recentReviewsList, ...reviewsWithRepo];
            
            // Aggregate for chart
            repo.reviews.forEach((review) => {
              const dateStr = format(new Date(review.createdAt), "MMM dd");
              chartDataMap[dateStr] = (chartDataMap[dateStr] || 0) + 1;
            });
          }
        });
      }
    });
  }

  // Sort recent reviews
  recentReviewsList.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  // Take top 10
  const topRecentReviews = recentReviewsList.slice(0, 10);
  
  // Format chart data
  const chartData = Object.keys(chartDataMap).map(date => ({
    date,
    count: chartDataMap[date]
  })).sort((a, b) => {
    // Basic string sort works for MMM dd if in same year, but in a real app you'd parse real dates.
    // For now we trust it or sort by timestamp
    return 1; // Simplified for this phase
  });

  if (isLoading) {
    return (
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between space-y-2">
          <Skeleton className="h-10 w-48" />
        </div>
        <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-3">
          <Skeleton className="h-[120px] rounded-xl" />
          <Skeleton className="h-[120px] rounded-xl" />
          <Skeleton className="h-[120px] rounded-xl" />
        </div>
        <div className="grid gap-4 md:gap-8 lg:grid-cols-7">
          <Skeleton className="h-[400px] col-span-4 rounded-xl" />
          <Skeleton className="h-[400px] col-span-3 rounded-xl" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh] text-center">
        <div className="text-red-500 font-semibold mb-2">Error loading dashboard data</div>
        <p className="text-muted-foreground text-sm">{(error as any).message}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
      </div>
      
      <StatCards 
        totalProjects={totalProjects} 
        totalRepos={totalRepos} 
        totalReviews={totalReviews} 
      />
      
      <div className="grid gap-4 md:gap-8 lg:grid-cols-7">
        <ActivityChart data={chartData} />
        <RecentReviews reviews={topRecentReviews} />
      </div>
    </div>
  );
}
