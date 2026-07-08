"use client";

import React, { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { projectsService } from '@/features/projects/projects.service';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, TrendingUp, CheckCircle, XCircle, Code2 } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { useTheme } from 'next-themes';
import { format, subDays } from 'date-fns';

export default function ReportsPage() {
  const { theme } = useTheme();

  const { data: projects, isLoading, error } = useQuery({
    queryKey: ['projects'],
    queryFn: () => projectsService.getProjects(),
  });

  const stats = useMemo(() => {
    if (!projects) return null;

    let totalReviews = 0;
    let completedReviews = 0;
    let failedReviews = 0;
    let totalScore = 0;
    const scoresWithDates: { date: string, score: number }[] = [];
    const reviewsPerRepo: Record<string, number> = {};

    projects.forEach(project => {
      if (project.repositories) {
        project.repositories.forEach(repo => {
          if (repo.reviews && repo.reviews.length > 0) {
            reviewsPerRepo[repo.fullName] = repo.reviews.length;
            
            repo.reviews.forEach(review => {
              totalReviews++;
              if (review.status === 'COMPLETED') {
                completedReviews++;
                if (review.overallScore !== undefined) {
                  totalScore += review.overallScore;
                  scoresWithDates.push({
                    date: format(new Date(review.createdAt), 'MMM dd'),
                    score: review.overallScore,
                  });
                }
              } else if (review.status === 'FAILED') {
                failedReviews++;
              }
            });
          }
        });
      }
    });

    const averageScore = completedReviews > 0 ? Math.round(totalScore / completedReviews) : 0;
    
    // Sort line chart by date
    scoresWithDates.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    // Format for Pie Chart
    const statusData = [
      { name: 'Completed', value: completedReviews },
      { name: 'Failed', value: failedReviews },
      { name: 'In Progress', value: totalReviews - completedReviews - failedReviews },
    ].filter(d => d.value > 0);

    // Format for Bar Chart (Top 5 repos)
    const repoData = Object.entries(reviewsPerRepo)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    return {
      totalReviews,
      averageScore,
      statusData,
      repoData,
      scoresWithDates
    };
  }, [projects]);

  if (isLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2 text-muted-foreground">Generating reports...</span>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="p-6 text-center">
        <h3 className="text-xl font-semibold text-red-500 mb-2">Error Loading Data</h3>
        <p className="text-muted-foreground">We couldn't fetch the required data for your reports.</p>
      </div>
    );
  }

  const COLORS = ['#22c55e', '#ef4444', '#3b82f6'];

  return (
    <div className="space-y-6 max-w-6xl mx-auto w-full pb-10">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Analytics & Reports</h1>
        <p className="text-muted-foreground mt-2">
          High-level statistics and insights across all your AI code reviews.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Reviews</CardTitle>
            <Code2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalReviews}</div>
            <p className="text-xs text-muted-foreground">Across all connected repositories</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Review Score</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.averageScore}/100</div>
            <p className="text-xs text-muted-foreground">Higher is better</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed vs Failed</CardTitle>
            {stats.statusData.find(s => s.name === 'Failed') ? (
              <XCircle className="h-4 w-4 text-red-500" />
            ) : (
              <CheckCircle className="h-4 w-4 text-green-500" />
            )}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.statusData.find(s => s.name === 'Completed')?.value || 0} / {stats.totalReviews}
            </div>
            <p className="text-xs text-muted-foreground">Successfully processed by AI</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-1 lg:col-span-4">
          <CardHeader>
            <CardTitle>Score Trends</CardTitle>
            <CardDescription>Average review scores over recent reviews.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              {stats.scoresWithDates.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={stats.scoresWithDates} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                    <XAxis dataKey="date" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} domain={[0, 100]} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: theme === 'dark' ? '#1f2937' : '#ffffff', borderRadius: '8px' }}
                    />
                    <Line type="monotone" dataKey="score" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex h-full items-center justify-center text-muted-foreground text-sm border-2 border-dashed rounded-md">
                  Not enough data for trend analysis.
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-1 lg:col-span-3">
          <CardHeader>
            <CardTitle>Review Status Distribution</CardTitle>
            <CardDescription>Pass vs fail rates for all reviews.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              {stats.totalReviews > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={stats.statusData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {stats.statusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ backgroundColor: theme === 'dark' ? '#1f2937' : '#ffffff', borderRadius: '8px' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex h-full items-center justify-center text-muted-foreground text-sm border-2 border-dashed rounded-md">
                  No review data available.
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Top Repositories by Review Volume</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            {stats.repoData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.repoData} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} opacity={0.2} />
                  <XAxis type="number" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis dataKey="name" type="category" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} width={150} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: theme === 'dark' ? '#1f2937' : '#ffffff', borderRadius: '8px' }}
                    cursor={{ fill: theme === 'dark' ? '#374151' : '#f3f4f6' }}
                  />
                  <Bar dataKey="count" fill="#8b5cf6" radius={[0, 4, 4, 0]} barSize={32} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-full items-center justify-center text-muted-foreground text-sm border-2 border-dashed rounded-md">
                No repositories reviewed yet.
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
