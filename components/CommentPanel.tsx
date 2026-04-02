'use client';

import { useReviewStore } from '@/stores/reviewStore';
import { REVIEWERS } from '@/lib/constants';
import CommentCard from './CommentCard';

export default function CommentPanel() {
  const reviewResult = useReviewStore(state => state.reviewResult);
  const selectedReviewers = useReviewStore(state => state.selectedReviewers);
  const toggleReviewer = useReviewStore(state => state.toggleReviewer);

  if (!reviewResult) return null;

  const filteredReviews = selectedReviewers.length > 0
    ? reviewResult.reviews.filter(r => selectedReviewers.includes(r.reviewerId))
    : reviewResult.reviews;

  const totalComments = filteredReviews.reduce((sum, r) => sum + r.comments.length, 0);

  return (
    <div className="h-full flex flex-col bg-slate-50">
      {/* Filter header */}
      <div className="p-4 bg-white border-b border-slate-200">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-slate-700">评委筛选</h3>
          <span className="text-xs text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
            {totalComments} 条评论
          </span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {REVIEWERS.map(reviewer => {
            const isSelected = selectedReviewers.includes(reviewer.id);
            const reviewData = reviewResult.reviews.find(r => r.reviewerId === reviewer.id);
            const count = reviewData?.comments.length || 0;

            return (
              <button
                key={reviewer.id}
                onClick={() => toggleReviewer(reviewer.id)}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  isSelected
                    ? 'shadow-sm ring-1'
                    : 'opacity-50 hover:opacity-80 bg-slate-50'
                }`}
                style={{
                  ...(isSelected ? {
                    backgroundColor: `${reviewer.color}10`,
                    color: reviewer.color,
                    ringColor: `${reviewer.color}40`,
                  } : {})
                }}
              >
                <span className="text-base">{reviewer.icon}</span>
                <span>{reviewer.name.split(' ')[0]}</span>
                {count > 0 && (
                  <span className={`ml-0.5 px-1.5 py-0.5 rounded-full text-[10px] ${
                    isSelected ? 'bg-white/60' : 'bg-slate-200/80'
                  }`}>
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Comments list */}
      <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
        {filteredReviews.length === 0 ? (
          <div className="text-center text-slate-400 mt-12">
            <svg className="w-12 h-12 mx-auto mb-3 text-slate-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
            <p className="text-sm">未选择评委</p>
          </div>
        ) : (
          <div className="stagger-children">
            {filteredReviews.map(review => (
              <div key={review.reviewerId} className="mb-6">
                <div className="flex items-center gap-2 mb-3 px-1">
                  <span className="text-lg">{review.icon}</span>
                  <h4 className="text-sm font-semibold" style={{ color: review.color }}>
                    {review.reviewerName}
                  </h4>
                  <div className="flex-1 h-px bg-slate-200 ml-2" />
                  <span className="text-xs text-slate-400">
                    {review.comments.length} 条
                  </span>
                </div>

                <div className="space-y-3">
                  {review.comments.map(comment => (
                    <CommentCard
                      key={comment.id}
                      comment={comment}
                      reviewerIcon={review.icon}
                      reviewerName={review.reviewerName}
                      reviewerColor={review.color}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
