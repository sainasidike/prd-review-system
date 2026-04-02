'use client';

import { useReviewStore } from '@/stores/reviewStore';
import { REVIEWERS } from '@/lib/constants';
import CommentCard from './CommentCard';
import ReviewerAvatar from './ReviewerAvatar';

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
      <div className="p-4 bg-white border-b border-gray-100">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-gray-500">筛选评委</span>
          <span className="text-xs text-gray-300">{totalComments} 条评论</span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {REVIEWERS.map(reviewer => {
            const isSelected = selectedReviewers.includes(reviewer.id);
            const count = reviewResult.reviews.find(r => r.reviewerId === reviewer.id)?.comments.length || 0;

            return (
              <button
                key={reviewer.id}
                onClick={() => toggleReviewer(reviewer.id)}
                className={`flex items-center gap-1 px-2 py-1 rounded-md text-xs transition-all ${
                  isSelected
                    ? 'bg-white border shadow-sm font-medium'
                    : 'bg-gray-50 border border-transparent text-gray-400 hover:text-gray-600 hover:bg-gray-100'
                }`}
                style={isSelected ? {
                  borderColor: `${reviewer.color}30`,
                  color: reviewer.color,
                  backgroundColor: `${reviewer.color}08`,
                } : {}}
              >
                <ReviewerAvatar reviewerId={reviewer.id} size={20} />
                <span>{reviewer.name.replace(' Leader', '').replace('团队 ', '')}</span>
                {count > 0 && <span className="text-[10px] text-gray-300 ml-0.5">{count}</span>}
              </button>
            );
          })}
        </div>
      </div>

      {/* Comments */}
      <div className="flex-1 overflow-y-auto p-4 scroll-y">
        {filteredReviews.length === 0 ? (
          <div className="text-center text-gray-300 text-sm mt-16">选择评委查看评论</div>
        ) : (
          <div className="space-y-6 stagger">
            {filteredReviews.map(review => (
              <div key={review.reviewerId}>
                <div className="flex items-center gap-2 mb-2.5 px-1">
                  <ReviewerAvatar reviewerId={review.reviewerId} size={24} />
                  <span className="text-xs font-medium" style={{ color: review.color }}>{review.reviewerName}</span>
                  <div className="flex-1 h-px bg-gray-100" />
                  <span className="text-[11px] text-gray-300">{review.comments.length} 条</span>
                </div>
                <div className="space-y-2">
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
