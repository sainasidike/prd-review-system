'use client';

import { useReviewStore } from '@/stores/reviewStore';
import { REVIEWERS } from '@/lib/constants';
import ReviewerAvatar from './ReviewerAvatar';

export default function ReviewProgress() {
  const progress = useReviewStore(state => state.reviewProgress);

  if (!progress) return null;

  const { current, total } = progress;

  return (
    <div className="mt-2">
      <div className="flex items-center gap-2 mb-4">
        <svg className="animate-spin w-4 h-4 text-notion-accent" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
        <span className="text-sm text-notion-fg">评审进行中</span>
        <span className="text-sm text-notion-fg-muted">{current}/{total}</span>
      </div>

      <div className="space-y-1">
        {REVIEWERS.map((reviewer, index) => {
          const isDone = index < current;
          const isActive = index === current;

          return (
            <div
              key={reviewer.id}
              className={`flex items-center gap-2.5 px-3 py-2 rounded-md transition-colors ${
                isActive ? 'bg-notion-accent-light' :
                isDone ? 'opacity-50' : 'opacity-25'
              }`}
            >
              <ReviewerAvatar reviewerId={reviewer.id} size={20} />
              <span className={`text-sm flex-1 ${isActive ? 'text-notion-accent font-medium' : 'text-notion-fg-secondary'}`}>
                {reviewer.name}
              </span>
              {isDone && (
                <span className="text-xs text-notion-green">完成</span>
              )}
              {isActive && (
                <span className="text-xs text-notion-accent">评审中...</span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
