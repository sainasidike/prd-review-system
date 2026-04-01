'use client';

import { useReviewStore } from '@/stores/reviewStore';
import { REVIEWERS } from '@/lib/constants';

export default function ReviewProgress() {
  const progress = useReviewStore(state => state.reviewProgress);

  if (!progress) return null;

  const { current, total } = progress;
  const percentage = Math.round((current / total) * 100);

  return (
    <div className="max-w-2xl mx-auto mt-8">
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-lg font-semibold">评审进行中...</h3>
            <span className="text-sm text-gray-600">{current}/{total}</span>
          </div>

          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
            <div
              className="bg-blue-600 h-full transition-all duration-300 rounded-full"
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>

        <div className="space-y-3">
          {REVIEWERS.map((reviewer, index) => (
            <div key={reviewer.id} className="flex items-center space-x-3">
              <div className="text-2xl">{reviewer.icon}</div>
              <div className="flex-1">
                <div className="text-sm font-medium">{reviewer.name}</div>
              </div>
              <div>
                {index < current ? (
                  <span className="text-green-600">✅ 已完成</span>
                ) : index === current ? (
                  <span className="text-blue-600">⏳ 评审中...</span>
                ) : (
                  <span className="text-gray-400">⏺️ 等待中</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
