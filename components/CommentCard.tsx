'use client';

import { ReviewComment } from '@/lib/types';
import { useReviewStore } from '@/stores/reviewStore';

interface CommentCardProps {
  comment: ReviewComment;
  reviewerIcon: string;
  reviewerName: string;
  reviewerColor: string;
}

export default function CommentCard({ comment, reviewerIcon, reviewerName, reviewerColor }: CommentCardProps) {
  const setHighlightedParagraphId = useReviewStore(state => state.setHighlightedParagraphId);

  const severityColor = {
    high: 'bg-red-50 border-red-300',
    medium: 'bg-yellow-50 border-yellow-300',
    low: 'bg-green-50 border-green-300'
  }[comment.severity];

  const severityBadge = {
    high: '🔴 HIGH',
    medium: '🟡 MED',
    low: '🟢 LOW'
  }[comment.severity];

  const typeIcon = {
    question: '❓',
    suggestion: '💡',
    concern: '⚠️',
    praise: '👍'
  }[comment.type];

  return (
    <div
      className={`border rounded-lg p-4 mb-4 ${severityColor} cursor-pointer hover:shadow-md transition-shadow`}
      onMouseEnter={() => setHighlightedParagraphId(comment.paragraphId)}
      onMouseLeave={() => setHighlightedParagraphId(null)}
    >
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center space-x-2">
          <span className="text-2xl">{reviewerIcon}</span>
          <span className="font-semibold" style={{ color: reviewerColor }}>
            {reviewerName}
          </span>
        </div>
        <span className="text-xs font-semibold">{severityBadge}</span>
      </div>

      <div className="mb-2 text-sm text-gray-600">
        📌 &quot;{comment.quotedText}&quot;
      </div>

      <div className="mb-2">
        <span className="text-lg mr-2">{typeIcon}</span>
        <span className="text-sm">{comment.content}</span>
      </div>

      <div className="text-xs text-gray-400">
        段落 {comment.paragraphId}
      </div>
    </div>
  );
}
