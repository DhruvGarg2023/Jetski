"use client";

import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { projectsService } from '@/features/projects/projects.service';
import { ReviewHistoryCard } from '@/features/reviews/components/ReviewHistoryCard';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Search, SlidersHorizontal } from 'lucide-react';

export default function ReviewHistoryPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [repoFilter, setRepoFilter] = useState('ALL');

  const { data: projects, isLoading, error } = useQuery({
    queryKey: ['projects'],
    queryFn: () => projectsService.getProjects(),
  });

  // Extract and enrich all reviews from projects
  const { allReviews, uniqueRepos } = useMemo(() => {
    if (!projects) return { allReviews: [], uniqueRepos: [] };

    const repos = new Set<string>();
    const reviews: any[] = [];

    projects.forEach(project => {
      if (project.repositories) {
        project.repositories.forEach(repo => {
          repos.add(repo.fullName);
          if (repo.reviews) {
            repo.reviews.forEach(review => {
              reviews.push({
                ...review,
                repoName: repo.fullName,
              });
            });
          }
        });
      }
    });

    // Sort by newest first
    reviews.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    return { allReviews: reviews, uniqueRepos: Array.from(repos) };
  }, [projects]);

  // Apply filters and search
  const filteredReviews = useMemo(() => {
    return allReviews.filter(review => {
      const matchesSearch = 
        review.repoName.toLowerCase().includes(searchQuery.toLowerCase()) || 
        review.targetId.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesStatus = statusFilter === 'ALL' || review.status === statusFilter;
      const matchesRepo = repoFilter === 'ALL' || review.repoName === repoFilter;

      return matchesSearch && matchesStatus && matchesRepo;
    });
  }, [allReviews, searchQuery, statusFilter, repoFilter]);

  if (isLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2 text-muted-foreground">Loading history...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-center">
        <h3 className="text-xl font-semibold text-red-500 mb-2">Error Loading Reviews</h3>
        <p className="text-muted-foreground">{(error as any)?.message || "Could not fetch review history."}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto w-full pb-10">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Review History</h1>
        <p className="text-muted-foreground mt-2">
          Browse and filter your past AI code reviews across all repositories.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-center bg-card p-4 rounded-lg border shadow-sm">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by repo or commit SHA..."
            className="pl-9 w-full"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="flex gap-4 w-full sm:w-auto">
          <Select value={statusFilter} onValueChange={(val) => setStatusFilter(val || 'ALL')}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Statuses</SelectItem>
              <SelectItem value="COMPLETED">Completed</SelectItem>
              <SelectItem value="PENDING">Pending</SelectItem>
              <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
              <SelectItem value="FAILED">Failed</SelectItem>
            </SelectContent>
          </Select>

          <Select value={repoFilter} onValueChange={(val) => setRepoFilter(val || 'ALL')}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Repository" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Repositories</SelectItem>
              {uniqueRepos.map(repo => (
                <SelectItem key={repo} value={repo}>{repo}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>Showing {filteredReviews.length} review{filteredReviews.length !== 1 ? 's' : ''}</span>
      </div>

      {filteredReviews.length === 0 ? (
        <div className="text-center p-12 border rounded-xl bg-card shadow-sm flex flex-col items-center justify-center">
          <SlidersHorizontal className="h-10 w-10 text-muted-foreground/50 mb-4" />
          <h3 className="text-lg font-medium">No reviews found</h3>
          <p className="text-muted-foreground mt-1">Try adjusting your filters or search query.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredReviews.map(review => (
            <ReviewHistoryCard key={review.id} review={review} />
          ))}
        </div>
      )}
    </div>
  );
}
