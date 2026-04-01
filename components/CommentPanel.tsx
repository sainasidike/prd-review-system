'use client';

import { useReviewStore } from '@/stores/reviewStore';
import { REVIEWERS } from '@/lib/constants';
import CommentCard from './CommentCard';

export default function CommentPanel() {
  const reviewResult = useReviewStore(state => state.reviewResult);
  const selectedReviewers = useReviewStore(state => state.selectedReviewers);
  const toggleReviewer = useReviewStore(state => state.toggleReviewer);

  if (!reviewResult) return null;

  // Filter reviews by selected reviewers
  const filteredReviews = selectedReviewers.length > 0
    ? reviewResult.reviews.filter(r => selectedReviewers.includes(r.reviewerId))
    : reviewResult.reviews;

  // Count total comments
  const totalComments = filteredReviews.reduce((sum, r) => sum + r.comments.length, 0);

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Filter header */}
      <div className="p-4 bg-white border-b">
        <h3 className="font-semibold mb-3">🔍 筛选评委</h3>
        <div className="flex flex-wrap gap-2">
          {REVIEWERS.map(reviewer => {
            const isSelected = selectedReviewers.includes(reviewer.id);
            return (
              <button
                key={reviewer.id}
                onClick={() => toggleReviewer(reviewer.id)}
                className={`px-3 py-2 rounded-lg border transition-all ${
                  isSelected
                    ? 'border-2 shadow-sm'
                    : 'border-gray-300 opacity-50 hover:opacity-100'
                }`}
                style={{
                  borderColor: isSelected ? reviewer.color : undefined,
                  backgroundColor: isSelected ? `${reviewer.color}10` : undefined
                }}
              >
                <span className="text-xl mr-1">{reviewer.icon}</span>
                <span className="text-sm">{reviewer.name.split(' ')[0]}</span>
              </button>
            );
          })}
        </div>
        <div className="mt-3 text-sm text-gray-600">
          共 {totalComments} 条评论
        </div>
      </div>

      {/* Comments list */}
      <div className="flex-1 overflow-y-auto p-4">
        {filteredReviews.length === 0 ? (
          <div className="text-center text-gray-500 mt-8">
            未选择评委
          </div>
        ) : (
          filteredReviews.map(review => (
            <div key={review.reviewerId} className="mb-6">
              <div className="flex items-center mb-3">
                <span className="text-2xl mr-2">{review.icon}</span>
                <h4 className="font-semibold" style={{ color: review.color }}>
                  {review.reviewerName}
                </h4>
                <span className="ml-auto text-sm text-gray-500">
                  {review.comments.length} 条评论
                </span>
              </div>

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
          ))
        )}
      </div>
    </div>
  );
}
