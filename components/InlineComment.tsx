'use client';

import { ReviewComment } from '@/lib/types';
import ReviewerAvatar from './ReviewerAvatar';

interface InlineCommentProps {
  comment: ReviewComment;
  reviewerId: string;
  reviewerName: string;
  color: string;
  isActive: boolean;
  onToggle: () => void;
}

export default function InlineComment({
  comment,
  reviewerId,
  reviewerName,
  color,
  isActive,
  onToggle,
}: InlineCommentProps) {
  const severityDot = {
    high: 'bg-red-500',
    medium: 'bg-amber-400',
    low: 'bg-emerald-400',
  }[comment.severity];

  return (
    <div
      className={`rounded-lg border p-3 cursor-pointer transition-all duration-200 ${
        isActive
          ? 'bg-white border-gray-200 shadow-md'
          : 'bg-gray-50 border-gray-100 hover:bg-white hover:border-gray-200 hover:shadow-sm'
      }`}
      onClick={onToggle}
    >
      {/* Header: avatar + name + severity */}
      <div className="flex items-center gap-2 mb-2">
        <ReviewerAvatar reviewerId={reviewerId} size={22} />
        <span className="text-xs font-medium" style={{ color }}>{reviewerName}</span>
        <div className="flex-1" />
        <span className={`w-1.5 h-1.5 rounded-full ${severityDot}`} />
      </div>

      {/* Content */}
      <p className={`text-[13px] leading-relaxed transition-all ${
        isActive ? 'text-gray-700' : 'text-gray-500'
      }`}>
        {comment.content}
      </p>
    </div>
  );
}
