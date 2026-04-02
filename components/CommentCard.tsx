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

  const severityDot = {
    high: 'bg-red-500',
    medium: 'bg-amber-400',
    low: 'bg-emerald-400',
  }[comment.severity];

  const severityLabel = {
    high: '高',
    medium: '中',
    low: '低',
  }[comment.severity];

  const typeLabel = {
    question: '提问',
    suggestion: '建议',
    concern: '顾虑',
    praise: '肯定',
  }[comment.type];

  return (
    <div
      className="bg-white border border-gray-100 rounded-lg p-3.5 hover:border-gray-200 hover:shadow-sm cursor-pointer transition-all duration-150"
      onMouseEnter={() => setHighlightedParagraphId(comment.paragraphId)}
      onMouseLeave={() => setHighlightedParagraphId(null)}
    >
      {/* Tags */}
      <div className="flex items-center gap-1.5 mb-2">
        <span className="text-[11px] text-gray-500 bg-gray-50 px-1.5 py-0.5 rounded">{typeLabel}</span>
        <span className="text-[11px] text-gray-300">P{comment.paragraphId}</span>
        <div className="flex-1" />
        <span className={`w-1.5 h-1.5 rounded-full ${severityDot}`} />
        <span className="text-[10px] text-gray-400">{severityLabel}</span>
      </div>

      {/* Quote */}
      <div
        className="mb-2 px-2.5 py-1.5 rounded bg-gray-50 border-l-2 text-xs text-gray-400 leading-relaxed"
        style={{ borderColor: `${reviewerColor}50` }}
      >
        &ldquo;{comment.quotedText}&rdquo;
      </div>

      {/* Content */}
      <p className="text-[13px] text-gray-600 leading-relaxed">
        {comment.content}
      </p>
    </div>
  );
}
