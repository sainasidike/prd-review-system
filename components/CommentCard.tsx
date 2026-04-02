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

  const severity = {
    high: { dot: 'bg-red-400', label: 'HIGH', ring: 'border-red-500/20 bg-red-500/5' },
    medium: { dot: 'bg-amber-400', label: 'MED', ring: 'border-amber-500/20 bg-amber-500/5' },
    low: { dot: 'bg-emerald-400', label: 'LOW', ring: 'border-emerald-500/20 bg-emerald-500/5' },
  }[comment.severity];

  const typeLabel = {
    question: '提问',
    suggestion: '建议',
    concern: '顾虑',
    praise: '肯定',
  }[comment.type];

  return (
    <div
      className="group border border-surface-3 rounded-xl p-4 bg-surface-1 hover:bg-surface-2 hover:border-surface-4 cursor-pointer transition-all duration-200"
      onMouseEnter={() => setHighlightedParagraphId(comment.paragraphId)}
      onMouseLeave={() => setHighlightedParagraphId(null)}
    >
      {/* Meta row */}
      <div className="flex items-center gap-2 mb-3">
        <span className="text-[11px] text-warm-300/30 font-medium px-2 py-0.5 rounded bg-surface-2 border border-surface-3">
          {typeLabel}
        </span>
        <span className="text-[11px] text-warm-300/20">P{comment.paragraphId}</span>
        <div className="flex-1" />
        <div className="flex items-center gap-1.5">
          <span className={`w-1.5 h-1.5 rounded-full ${severity.dot}`} />
          <span className="text-[10px] text-warm-300/30 font-medium tracking-wider">{severity.label}</span>
        </div>
      </div>

      {/* Quote */}
      <div
        className="mb-3 px-3 py-2 rounded-lg bg-surface-0/50 border-l-2 text-xs text-warm-300/40 italic leading-relaxed"
        style={{ borderColor: `${reviewerColor}50` }}
      >
        &ldquo;{comment.quotedText}&rdquo;
      </div>

      {/* Content */}
      <p className="text-[13px] text-warm-200/80 leading-[1.7]">
        {comment.content}
      </p>
    </div>
  );
}
