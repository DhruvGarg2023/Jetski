"use client";

import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { projectsService } from '@/features/projects/projects.service';
import { ReviewHistoryCard } from '@/features/reviews/components/ReviewHistoryCard';
import { Search, FileText } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ReviewHistoryPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [repoFilter, setRepoFilter] = useState('ALL');

  const { data: projects, isLoading, error } = useQuery({
    queryKey: ['projects'],
    queryFn: () => projectsService.getProjects(),
  });

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

    reviews.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    return { allReviews: reviews, uniqueRepos: Array.from(repos) };
  }, [projects]);

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
      <div className="flex h-[50vh] flex-col items-center justify-center font-mono text-[#7E8494]">
        <div className="animate-pulse mb-4 text-[#00E5FF]">|</div>
        <span>[ INITIATING_DATABASE_QUERY ]</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 border border-[#FF4F00]/30 bg-[#FF4F00]/5 max-w-2xl mx-auto mt-12">
        <h3 className="text-sm font-mono font-bold text-[#FF4F00] uppercase tracking-widest mb-2">System_Error</h3>
        <p className="text-[#F3F4F6] font-sans">
          {(error as any)?.message || "Could not retrieve review history records."}
        </p>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-8 max-w-5xl mx-auto w-full pb-10 pt-4"
    >
      <div className="border-b border-white/10 pb-6">
        <h1 className="text-2xl font-bold tracking-tight text-[#F3F4F6]">Diagnostic History</h1>
        <p className="text-[#7E8494] mt-2 font-sans text-sm">
          Archived AI codebase analysis reports.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center bg-[#181A20] p-3 border border-white/10">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-[#7E8494]" />
          <input
            placeholder="Query by repo or SHA..."
            className="pl-10 w-full bg-[#0F1014] border border-white/10 text-sm font-mono text-[#F3F4F6] py-2 px-3 focus:outline-none focus:border-[#00E5FF]/50 transition-colors placeholder:text-[#7E8494]/50"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="flex gap-3 w-full sm:w-auto">
          <select 
            className="bg-[#0F1014] border border-white/10 text-xs font-mono text-[#7E8494] py-2.5 px-3 uppercase tracking-widest focus:outline-none focus:border-[#00E5FF]/50"
            value={statusFilter} 
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="ALL">Status: ALL</option>
            <option value="COMPLETED">COMPLETED</option>
            <option value="PENDING">PENDING</option>
            <option value="IN_PROGRESS">IN_PROGRESS</option>
            <option value="FAILED">FAILED</option>
          </select>

          <select 
            className="bg-[#0F1014] border border-white/10 text-xs font-mono text-[#7E8494] py-2.5 px-3 uppercase tracking-widest focus:outline-none focus:border-[#00E5FF]/50 max-w-[200px]"
            value={repoFilter} 
            onChange={(e) => setRepoFilter(e.target.value)}
          >
            <option value="ALL">Repo: ALL</option>
            {uniqueRepos.map(repo => (
              <option key={repo} value={repo}>{repo.split('/')[1] || repo}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex items-center justify-between text-[10px] font-mono text-[#7E8494] uppercase tracking-widest">
        <span>Records_Found: [{filteredReviews.length}]</span>
      </div>

      {filteredReviews.length === 0 ? (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center p-16 border border-white/10 bg-[#0F1014]"
        >
          <div className="font-mono text-sm tracking-widest uppercase text-[#7E8494] mb-2">Null_Result</div>
          <p className="text-xs text-[#7E8494]/70 font-sans">Adjust query parameters to expand search space.</p>
        </motion.div>
      ) : (
        <div className="space-y-[1px] bg-white/10 border border-white/10">
          {filteredReviews.map(review => (
            <ReviewHistoryCard key={review.id} review={review} />
          ))}
        </div>
      )}
    </motion.div>
  );
}
