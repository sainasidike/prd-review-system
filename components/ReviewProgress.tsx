'use client';

import { useReviewStore } from '@/stores/reviewStore';
import { REVIEWERS } from '@/lib/constants';

export default function ReviewProgress() {
  const progress = useReviewStore(state => state.reviewProgress);

  if (!progress) return null;

  const { current, total } = progress;
  const percentage = total > 0 ? Math.round((current / total) * 100) : 0;

  return (
    <div className="max-w-2xl">
      <div className="bg-surface-1 border border-surface-3 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-display font-semibold text-warm-100">评审进行中</h3>
          <span className="text-xs text-warm-300/40 bg-surface-2 px-3 py-1 rounded-full border border-surface-3">
            {current} / {total}
          </span>
        </div>

        {/* Progress bar */}
        <div className="w-full h-1 bg-surface-3 rounded-full mb-6 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-warm-400 to-warm-500 rounded-full transition-all duration-700 ease-out"
            style={{ width: `${percentage}%` }}
          />
        </div>

        <div className="space-y-1">
          {REVIEWERS.map((reviewer, index) => {
            const isDone = index < current;
            const isActive = index === current;
            const isPending = index > current;

            return (
              <div
                key={reviewer.id}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-500 ${
                  isActive ? 'bg-warm-400/[0.06] border border-warm-400/15' :
                  isDone ? 'opacity-60' : 'opacity-25'
                }`}
              >
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center text-lg border transition-all ${
                    isActive ? 'scale-105 border-warm-400/20' :
                    isDone ? 'border-surface-3' : 'border-transparent'
                  }`}
                  style={{ backgroundColor: isDone || isActive ? `${reviewer.color}10` : 'transparent' }}
                >
                  {reviewer.icon}
                </div>
                <span className={`text-sm flex-1 ${isActive ? 'text-warm-100 font-medium' : 'text-warm-300/50'}`}>
                  {reviewer.name}
                </span>
                {isDone && (
                  <svg className="w-4 h-4 text-emerald-400/70" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                )}
                {isActive && (
                  <div className="flex gap-1 animate-progress">
                    <span className="w-1 h-1 rounded-full bg-warm-400" />
                    <span className="w-1 h-1 rounded-full bg-warm-400 opacity-60" />
                    <span className="w-1 h-1 rounded-full bg-warm-400 opacity-30" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
