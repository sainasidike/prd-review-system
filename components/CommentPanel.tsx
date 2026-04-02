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
    <div className="h-full flex flex-col bg-surface-0">
      {/* Filter bar */}
      <div className="p-4 bg-surface-1 border-b border-surface-3">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-medium text-warm-300/40 tracking-wide uppercase">评委</span>
          <span className="text-[11px] text-warm-300/25">{totalComments} 条</span>
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
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs transition-all duration-200 ${
                  isSelected
                    ? 'border'
                    : 'opacity-35 hover:opacity-60 bg-surface-2'
                }`}
                style={isSelected ? {
                  backgroundColor: `${reviewer.color}12`,
                  borderColor: `${reviewer.color}30`,
                  color: reviewer.color,
                } : {}}
              >
                <span className="text-sm">{reviewer.icon}</span>
                <span className="font-medium">{reviewer.name.split(' ')[0]}</span>
                {count > 0 && (
                  <span className={`text-[10px] px-1.5 rounded-full ${
                    isSelected ? 'bg-white/10' : 'bg-surface-3'
                  }`}>
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Comments */}
      <div className="flex-1 overflow-y-auto p-4 scroll-dark">
        {filteredReviews.length === 0 ? (
          <div className="text-center mt-16">
            <div className="w-12 h-12 mx-auto mb-3 rounded-2xl bg-surface-2 border border-surface-3 flex items-center justify-center">
              <svg className="w-5 h-5 text-warm-300/20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <p className="text-sm text-warm-300/25">选择评委查看评论</p>
          </div>
        ) : (
          <div className="stagger">
            {filteredReviews.map(review => (
              <div key={review.reviewerId} className="mb-8">
                {/* Section header */}
                <div className="flex items-center gap-2.5 mb-3 px-1">
                  <span className="text-lg">{review.icon}</span>
                  <span className="text-xs font-display font-semibold" style={{ color: review.color }}>
                    {review.reviewerName}
                  </span>
                  <div className="flex-1 h-px bg-surface-3" />
                  <span className="text-[11px] text-warm-300/25">{review.comments.length}</span>
                </div>

                <div className="space-y-2.5">
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
