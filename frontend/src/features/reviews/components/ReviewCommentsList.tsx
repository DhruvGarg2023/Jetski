import React, { useState } from 'react';
import { ReviewComment } from '../types';
import { Badge } from '@/components/ui/badge';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { FileCode, AlertTriangle, ShieldAlert, CheckCircle, Info, LayoutTemplate, Activity, FileText } from 'lucide-react';
import { useTheme } from 'next-themes';

interface ReviewCommentsListProps {
  comments: ReviewComment[];
}

export function ReviewCommentsList({ comments }: ReviewCommentsListProps) {
  const [filterSeverity, setFilterSeverity] = useState<string>('ALL');
  const { theme } = useTheme();

  const filteredComments = filterSeverity === 'ALL' 
    ? comments 
    : comments.filter(c => c.severity === filterSeverity);

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'CRITICAL': return <ShieldAlert className="h-4 w-4 text-red-500" />;
      case 'HIGH': return <AlertTriangle className="h-4 w-4 text-orange-500" />;
      case 'MEDIUM': return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'LOW': return <Info className="h-4 w-4 text-blue-500" />;
      case 'INFO': return <CheckCircle className="h-4 w-4 text-green-500" />;
      default: return <Info className="h-4 w-4" />;
    }
  };

  const getSeverityBadgeColor = (severity: string) => {
    switch (severity) {
      case 'CRITICAL': return 'bg-red-500/10 text-red-500 hover:bg-red-500/20';
      case 'HIGH': return 'bg-orange-500/10 text-orange-500 hover:bg-orange-500/20';
      case 'MEDIUM': return 'bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20';
      case 'LOW': return 'bg-blue-500/10 text-blue-500 hover:bg-blue-500/20';
      case 'INFO': return 'bg-green-500/10 text-green-500 hover:bg-green-500/20';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Security': return <ShieldAlert className="h-4 w-4" />;
      case 'Performance': return <Activity className="h-4 w-4" />;
      case 'Bug': return <AlertTriangle className="h-4 w-4" />;
      case 'Code_Style': return <LayoutTemplate className="h-4 w-4" />;
      case 'Documentation': return <FileText className="h-4 w-4" />;
      default: return <FileCode className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {['ALL', 'CRITICAL', 'HIGH', 'MEDIUM', 'LOW', 'INFO'].map(sev => (
          <Badge 
            key={sev}
            variant="outline"
            className={`cursor-pointer whitespace-nowrap ${filterSeverity === sev ? 'bg-primary text-primary-foreground' : ''}`}
            onClick={() => setFilterSeverity(sev)}
          >
            {sev === 'ALL' ? 'All Issues' : sev}
            <span className="ml-2 text-xs opacity-70">
              {sev === 'ALL' ? comments.length : comments.filter(c => c.severity === sev).length}
            </span>
          </Badge>
        ))}
      </div>

      {filteredComments.length === 0 ? (
        <div className="text-center p-8 border rounded-lg bg-muted/50 text-muted-foreground">
          No issues found for this filter.
        </div>
      ) : (
        <div className="space-y-4">
          {filteredComments.map((comment) => (
            <div key={comment.id} className="border rounded-lg bg-card overflow-hidden shadow-sm">
              <div className="p-4 border-b bg-muted/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  {getSeverityIcon(comment.severity)}
                  <div>
                    <h4 className="font-semibold">{comment.title}</h4>
                    <div className="flex flex-wrap items-center gap-2 mt-1 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <FileCode className="h-3 w-3" />
                        {comment.filePath}
                      </span>
                      {comment.lineNumber && (
                        <span>Line {comment.lineNumber}</span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="flex items-center gap-1">
                    {getCategoryIcon(comment.category)}
                    {comment.category.replace('_', ' ')}
                  </Badge>
                  <Badge variant="secondary" className={getSeverityBadgeColor(comment.severity)}>
                    {comment.severity}
                  </Badge>
                </div>
              </div>
              
              <div className="p-4 space-y-4">
                <div className="text-sm whitespace-pre-wrap">{comment.comment}</div>
                
                {comment.codeSnippet && (
                  <div className="rounded-md overflow-hidden border">
                    <div className="bg-muted px-3 py-1 text-xs font-mono border-b text-muted-foreground">
                      Offending Code
                    </div>
                    <SyntaxHighlighter 
                      language="typescript" 
                      style={vscDarkPlus}
                      customStyle={{ margin: 0, borderRadius: 0, fontSize: '0.85rem' }}
                    >
                      {comment.codeSnippet}
                    </SyntaxHighlighter>
                  </div>
                )}

                {comment.suggestion && (
                  <div className="bg-primary/5 border-l-4 border-primary p-4 rounded-r-md">
                    <h5 className="text-sm font-semibold mb-1 text-primary">Suggestion</h5>
                    <div className="text-sm whitespace-pre-wrap">{comment.suggestion}</div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
