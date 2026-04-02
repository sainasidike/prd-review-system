'use client';

import { ReviewComment } from '@/lib/types';
import { useReviewStore } from '@/stores/reviewStore';

interface CommentCardProps {
  comment: ReviewComment;
  reviewerIcon: string;
  reviewerName: string;
  reviewerColor: string;
}

export default function CommentCard({ comment, reviewerColor }: CommentCardProps) {
  const setHighlightedParagraphId = useReviewStore(state => state.setHighlightedParagraphId);

  const severityConfig = {
    high: { bg: 'bg-red-50', border: 'border-red-200', badge: 'bg-red-100 text-red-700', label: '高' },
    medium: { bg: 'bg-amber-50', border: 'border-amber-200', badge: 'bg-amber-100 text-amber-700', label: '中' },
    low: { bg: 'bg-green-50', border: 'border-green-200', badge: 'bg-green-100 text-green-700', label: '低' },
  }[comment.severity];

  const typeConfig = {
    question: { icon: '?', bg: 'bg-blue-100', text: 'text-blue-600' },
    suggestion: { icon: '!', bg: 'bg-purple-100', text: 'text-purple-600' },
    concern: { icon: '!', bg: 'bg-orange-100', text: 'text-orange-600' },
    praise: { icon: '+', bg: 'bg-green-100', text: 'text-green-600' },
  }[comment.type];

  return (
    <div
      className={`group border rounded-xl p-4 ${severityConfig.bg} ${severityConfig.border} cursor-pointer hover:shadow-md transition-all duration-200 hover:-translate-y-0.5`}
      onMouseEnter={() => setHighlightedParagraphId(comment.paragraphId)}
      onMouseLeave={() => setHighlightedParagraphId(null)}
    >
      {/* Top row: type + severity */}
      <div className="flex items-center justify-between mb-2.5">
        <div className="flex items-center gap-2">
          <span className={`w-5 h-5 rounded-md flex items-center justify-center text-xs font-bold ${typeConfig.bg} ${typeConfig.text}`}>
            {typeConfig.icon}
          </span>
          <span className="text-xs text-slate-400">
            段落 {comment.paragraphId}
          </span>
        </div>
        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${severityConfig.badge}`}>
          {severityConfig.label}
        </span>
      </div>

      {/* Quoted text */}
      <div className="mb-2.5 text-xs py-1.5 px-2.5 rounded-lg bg-white/60 border-l-2 text-slate-500 italic" style={{ borderColor: reviewerColor }}>
        &ldquo;{comment.quotedText}&rdquo;
      </div>

      {/* Comment content */}
      <p className="text-sm text-slate-700 leading-relaxed">
        {comment.content}
      </p>
    </div>
  );
}
