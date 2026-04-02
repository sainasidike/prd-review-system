'use client';

import { useReviewStore } from '@/stores/reviewStore';
import { REVIEWERS } from '@/lib/constants';
import ReviewerAvatar from './ReviewerAvatar';

export default function ReviewProgress() {
  const progress = useReviewStore(state => state.reviewProgress);

  if (!progress) return null;

  const { current, total } = progress;
  const percentage = total > 0 ? Math.round((current / total) * 100) : 0;

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-medium text-gray-700">评审进行中...</span>
        <span className="text-xs text-gray-400">{current}/{total}</span>
      </div>

      <div className="w-full h-1.5 bg-gray-100 rounded-full mb-4 overflow-hidden">
        <div
          className="h-full bg-indigo-600 rounded-full transition-all duration-700 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>

      <div className="grid grid-cols-3 gap-2">
        {REVIEWERS.map((reviewer, index) => {
          const isDone = index < current;
          const isActive = index === current;

          return (
            <div
              key={reviewer.id}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all ${
                isActive ? 'bg-indigo-50 ring-1 ring-indigo-100' :
                isDone ? 'bg-gray-50 opacity-60' : 'opacity-25'
              }`}
            >
              <ReviewerAvatar reviewerId={reviewer.id} size={28} />
              <span className={`text-xs flex-1 truncate ${isActive ? 'text-indigo-700 font-medium' : 'text-gray-500'}`}>
                {reviewer.name.replace(' Leader', '')}
              </span>
              {isDone && (
                <svg className="w-3.5 h-3.5 text-emerald-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              )}
              {isActive && (
                <svg className="animate-spin w-3.5 h-3.5 text-indigo-500 shrink-0" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
