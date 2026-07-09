import React, { useState } from 'react';
import { ReviewComment } from '../types';
import { Badge } from '@/components/ui/badge';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { FileCode, AlertTriangle, ShieldAlert, CheckCircle, Info, LayoutTemplate, Activity, FileText, ChevronDown } from 'lucide-react';
import { useTheme } from 'next-themes';
import { motion, AnimatePresence } from 'framer-motion';

interface ReviewCommentsListProps {
  comments: ReviewComment[];
}

export function ReviewCommentsList({ comments }: ReviewCommentsListProps) {
  const [filterSeverity, setFilterSeverity] = useState<string>('ALL');
  const [expandedComments, setExpandedComments] = useState<Record<string, boolean>>({});

  const filteredComments = filterSeverity === 'ALL' 
    ? comments 
    : comments.filter(c => c.severity === filterSeverity);

  const toggleExpand = (id: string) => {
    setExpandedComments(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'CRITICAL': return <ShieldAlert className="h-4 w-4 text-[#FF4F00]" />;
      case 'HIGH': return <AlertTriangle className="h-4 w-4 text-[#FF4F00]" />;
      case 'MEDIUM': return <AlertTriangle className="h-4 w-4 text-[#FF9500]" />;
      case 'LOW': return <Info className="h-4 w-4 text-[#00E5FF]" />;
      case 'INFO': return <CheckCircle className="h-4 w-4 text-[#00E5FF]" />;
      default: return <Info className="h-4 w-4 text-[#7E8494]" />;
    }
  };

  const getSeverityTheme = (severity: string) => {
    switch (severity) {
      case 'CRITICAL': 
      case 'HIGH': 
        return { text: 'text-[#FF4F00]', border: 'border-[#FF4F00]/30', bg: 'bg-[#FF4F00]/10', active: 'bg-[#FF4F00] text-black' };
      case 'MEDIUM': 
        return { text: 'text-[#FF9500]', border: 'border-[#FF9500]/30', bg: 'bg-[#FF9500]/10', active: 'bg-[#FF9500] text-black' };
      case 'LOW': 
      case 'INFO': 
        return { text: 'text-[#00E5FF]', border: 'border-[#00E5FF]/30', bg: 'bg-[#00E5FF]/10', active: 'bg-[#00E5FF] text-black' };
      default: 
        return { text: 'text-[#7E8494]', border: 'border-[#7E8494]/30', bg: 'bg-[#7E8494]/10', active: 'bg-[#7E8494] text-black' };
    }
  };

  return (
    <div className="space-y-6">
      {/* Structural Filter Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-y border-white/10 bg-[#181A20] px-4 py-2">
        <div className="text-xs font-mono text-[#7E8494] uppercase tracking-widest flex items-center gap-2">
          <span>Filter_Diagnostic_Logs</span>
        </div>
        <div className="flex items-center gap-1 overflow-x-auto pb-2 sm:pb-0 scrollbar-hide w-full sm:w-auto mt-2 sm:mt-0">
          {['ALL', 'CRITICAL', 'HIGH', 'MEDIUM', 'LOW', 'INFO'].map(sev => {
            const isActive = filterSeverity === sev;
            const theme = sev !== 'ALL' ? getSeverityTheme(sev) : { text: 'text-[#F3F4F6]', active: 'bg-[#F3F4F6] text-black' };
            const count = sev === 'ALL' ? comments.length : comments.filter(c => c.severity === sev).length;
            
            return (
              <button 
                key={sev}
                onClick={() => setFilterSeverity(sev)}
                className={`text-xs font-mono uppercase tracking-wider px-3 py-1.5 transition-colors border border-transparent ${
                  isActive 
                    ? `${theme.active}` 
                    : `text-[#7E8494] hover:border-white/10 hover:bg-white/5`
                }`}
              >
                {sev} [{count}]
              </button>
            );
          })}
        </div>
      </div>

      {filteredComments.length === 0 ? (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center p-12 border border-white/10 bg-[#0F1014] text-[#7E8494]"
        >
          <div className="font-mono text-sm tracking-widest uppercase">No_Anomalies_Detected</div>
          <div className="text-xs mt-2 opacity-70">The system found no issues matching this filter criteria.</div>
        </motion.div>
      ) : (
        <div className="space-y-[1px] bg-white/10">
          <AnimatePresence>
            {filteredComments.map((comment, index) => {
              const isExpanded = expandedComments[comment.id] || false;
              const theme = getSeverityTheme(comment.severity);
              
              return (
                <motion.div 
                  key={comment.id} 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-[#0F1014] overflow-hidden"
                >
                  {/* Log Row Header */}
                  <div 
                    className="p-4 flex flex-col lg:flex-row lg:items-center justify-between gap-4 cursor-pointer hover:bg-[#181A20] transition-colors group"
                    onClick={() => toggleExpand(comment.id)}
                  >
                    <div className="flex items-start gap-4 flex-1">
                      <div className="mt-1 shrink-0">
                        {getSeverityIcon(comment.severity)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <span className={`text-[10px] font-mono tracking-widest uppercase px-1.5 py-0.5 border ${theme.border} ${theme.text} ${theme.bg}`}>
                            {comment.severity}
                          </span>
                          <span className="text-[10px] font-mono text-[#7E8494] uppercase tracking-widest border border-white/10 px-1.5 py-0.5">
                            {comment.category.replace('_', ' ')}
                          </span>
                          <span className="text-[11px] font-mono text-[#7E8494] truncate">
                            {comment.filePath}{comment.lineNumber ? `:${comment.lineNumber}` : ''}
                          </span>
                        </div>
                        <h4 className="font-sans font-medium text-[#F3F4F6] text-sm leading-tight group-hover:text-white transition-colors">{comment.title}</h4>
                      </div>
                    </div>
                    <div className="shrink-0 flex items-center justify-end">
                      <ChevronDown 
                        className={`h-4 w-4 text-[#7E8494] transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} 
                      />
                    </div>
                  </div>
                  
                  {/* Log Row Detail (Expanded) */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <div className="p-6 pt-2 pb-8 border-t border-white/5 bg-[#13141B] ml-8 space-y-6">
                          <div className="text-[14px] text-[#F3F4F6] font-sans leading-relaxed opacity-90">
                            {comment.comment}
                          </div>
                          
                          {comment.codeSnippet && (
                            <div className="border border-white/10 bg-black">
                              <div className="px-3 py-1.5 text-[10px] font-mono text-[#7E8494] uppercase tracking-widest border-b border-white/10 bg-[#0F1014]">
                                _Source_Trace
                              </div>
                              <SyntaxHighlighter 
                                language="typescript" 
                                style={vscDarkPlus}
                                customStyle={{ margin: 0, padding: '1rem', borderRadius: 0, fontSize: '0.8rem', backgroundColor: '#000000' }}
                              >
                                {comment.codeSnippet}
                              </SyntaxHighlighter>
                            </div>
                          )}
          
                          {comment.suggestion && (
                            <div className="border-l-2 border-[#00E5FF] pl-4 py-1">
                              <h5 className="text-[10px] font-mono uppercase tracking-widest text-[#00E5FF] mb-2">
                                _Resolution_Protocol
                              </h5>
                              <div className="text-[14px] text-[#F3F4F6] font-sans whitespace-pre-wrap leading-relaxed opacity-90">
                                {comment.suggestion}
                              </div>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
