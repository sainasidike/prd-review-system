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
    high: { dot: 'bg-red-500', label: 'HIGH' },
    medium: { dot: 'bg-amber-500', label: 'MED' },
    low: { dot: 'bg-emerald-500', label: 'LOW' },
  }[comment.severity];

  const typeLabel = {
    question: '提问',
    suggestion: '建议',
    concern: '顾虑',
    praise: '肯定',
  }[comment.type];

  return (
    <div
      className="border border-sand-200 rounded-xl p-4 bg-white hover:border-sand-300 hover:shadow-sm cursor-pointer transition-all duration-200"
      onMouseEnter={() => setHighlightedParagraphId(comment.paragraphId)}
      onMouseLeave={() => setHighlightedParagraphId(null)}
    >
      <div className="flex items-center gap-2 mb-2.5">
        <span className="text-[11px] text-ink-400 font-medium px-2 py-0.5 rounded bg-sand-100">
          {typeLabel}
        </span>
        <span className="text-[11px] text-ink-300">P{comment.paragraphId}</span>
        <div className="flex-1" />
        <div className="flex items-center gap-1.5">
          <span className={`w-1.5 h-1.5 rounded-full ${severity.dot}`} />
          <span className="text-[10px] text-ink-300 font-medium tracking-wider">{severity.label}</span>
        </div>
      </div>

      <div
        className="mb-2.5 px-3 py-1.5 rounded-lg bg-sand-50 border-l-2 text-xs text-ink-400 italic leading-relaxed"
        style={{ borderColor: `${reviewerColor}60` }}
      >
        &ldquo;{comment.quotedText}&rdquo;
      </div>

      <p className="text-[13px] text-ink-500 leading-[1.7]">
        {comment.content}
      </p>
    </div>
  );
}
