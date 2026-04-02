'use client';

import { useReviewStore } from '@/stores/reviewStore';
import { REVIEWERS } from '@/lib/constants';

export default function ReviewProgress() {
  const progress = useReviewStore(state => state.reviewProgress);

  if (!progress) return null;

  const { current, total } = progress;
  const percentage = total > 0 ? Math.round((current / total) * 100) : 0;

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <div className="mb-6">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-lg font-semibold text-slate-800">评审进行中</h3>
            <span className="text-sm font-medium text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
              {current}/{total}
            </span>
          </div>

          <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
            <div
              className="bg-gradient-to-r from-blue-500 to-indigo-500 h-full transition-all duration-500 ease-out rounded-full"
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>

        <div className="space-y-2">
          {REVIEWERS.map((reviewer, index) => {
            const isDone = index < current;
            const isActive = index === current;
            const isPending = index > current;

            return (
              <div
                key={reviewer.id}
                className={`flex items-center gap-3 p-3 rounded-xl transition-all duration-300 ${
                  isActive ? 'bg-blue-50 border border-blue-100' :
                  isDone ? 'bg-slate-50' : ''
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl transition-all ${
                    isActive ? 'scale-110' : isPending ? 'opacity-40' : ''
                  }`}
                  style={{ backgroundColor: `${reviewer.color}15` }}
                >
                  {reviewer.icon}
                </div>
                <div className="flex-1">
                  <div className={`text-sm font-medium ${isPending ? 'text-slate-400' : 'text-slate-700'}`}>
                    {reviewer.name}
                  </div>
                </div>
                <div>
                  {isDone ? (
                    <div className="flex items-center gap-1.5 text-sm text-green-600">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>完成</span>
                    </div>
                  ) : isActive ? (
                    <div className="flex items-center gap-1.5 text-sm text-blue-600">
                      <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      <span>评审中</span>
                    </div>
                  ) : (
                    <span className="text-sm text-slate-300">等待中</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
