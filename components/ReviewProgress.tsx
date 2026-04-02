'use client';

import { useReviewStore } from '@/stores/reviewStore';
import { REVIEWERS } from '@/lib/constants';

export default function ReviewProgress() {
  const progress = useReviewStore(state => state.reviewProgress);

  if (!progress) return null;

  const { current, total } = progress;
  const percentage = total > 0 ? Math.round((current / total) * 100) : 0;

  return (
    <div className="max-w-xl">
      <div className="bg-white border border-sand-200 rounded-2xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-display font-semibold text-ink-700 text-sm">评审进行中</h3>
          <span className="text-xs text-ink-300 bg-sand-100 px-2.5 py-0.5 rounded-full">
            {current} / {total}
          </span>
        </div>

        <div className="w-full h-1 bg-sand-200 rounded-full mb-5 overflow-hidden">
          <div
            className="h-full bg-ink-700 rounded-full transition-all duration-700 ease-out"
            style={{ width: `${percentage}%` }}
          />
        </div>

        <div className="space-y-1">
          {REVIEWERS.map((reviewer, index) => {
            const isDone = index < current;
            const isActive = index === current;

            return (
              <div
                key={reviewer.id}
                className={`flex items-center gap-3 px-3 py-2 rounded-xl transition-all ${
                  isActive ? 'bg-sand-100' : isDone ? 'opacity-50' : 'opacity-25'
                }`}
              >
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-base border"
                  style={{
                    backgroundColor: isDone || isActive ? `${reviewer.color}08` : 'transparent',
                    borderColor: isActive ? `${reviewer.color}25` : 'transparent',
                  }}
                >
                  {reviewer.icon}
                </div>
                <span className={`text-sm flex-1 ${isActive ? 'text-ink-600 font-medium' : 'text-ink-400'}`}>
                  {reviewer.name}
                </span>
                {isDone && (
                  <svg className="w-4 h-4 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                )}
                {isActive && (
                  <svg className="animate-spin w-3.5 h-3.5 text-ink-400" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
