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
    <div className="h-full flex flex-col">
      {/* Filter */}
      <div className="p-4 bg-white border-b border-sand-200">
        <div className="flex items-center justify-between mb-2.5">
          <span className="text-xs font-medium text-ink-400 tracking-wide">评委筛选</span>
          <span className="text-[11px] text-ink-300">{totalComments} 条</span>
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
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs transition-all ${
                  isSelected
                    ? 'border shadow-sm'
                    : 'opacity-40 hover:opacity-70 bg-sand-100'
                }`}
                style={isSelected ? {
                  backgroundColor: `${reviewer.color}08`,
                  borderColor: `${reviewer.color}25`,
                  color: reviewer.color,
                } : {}}
              >
                <span className="text-sm">{reviewer.icon}</span>
                <span className="font-medium">{reviewer.name.split(' ')[0]}</span>
                {count > 0 && (
                  <span className={`text-[10px] px-1.5 rounded-full ${
                    isSelected ? 'bg-white/50' : 'bg-sand-200'
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
      <div className="flex-1 overflow-y-auto p-4 scroll-thin">
        {filteredReviews.length === 0 ? (
          <div className="text-center mt-16 text-ink-300 text-sm">
            选择评委查看评论
          </div>
        ) : (
          <div className="stagger">
            {filteredReviews.map(review => (
              <div key={review.reviewerId} className="mb-7">
                <div className="flex items-center gap-2 mb-3 px-1">
                  <span className="text-base">{review.icon}</span>
                  <span className="text-xs font-display font-semibold" style={{ color: review.color }}>
                    {review.reviewerName}
                  </span>
                  <div className="flex-1 h-px bg-sand-200" />
                  <span className="text-[11px] text-ink-300">{review.comments.length}</span>
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
