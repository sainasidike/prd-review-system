'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import PRDViewer from '@/components/PRDViewer';
import CommentPanel from '@/components/CommentPanel';
import { useReviewStore } from '@/stores/reviewStore';

export default function ReviewPage() {
  const router = useRouter();
  const document = useReviewStore(state => state.document);
  const reviewResult = useReviewStore(state => state.reviewResult);
  const reset = useReviewStore(state => state.reset);

  useEffect(() => {
    if (!document || !reviewResult) {
      router.push('/');
    }
  }, [document, reviewResult, router]);

  if (!document || !reviewResult) return null;

  const totalComments = reviewResult.reviews.reduce((sum, r) => sum + r.comments.length, 0);
  const highCount = reviewResult.reviews.reduce(
    (sum, r) => sum + r.comments.filter(c => c.severity === 'high').length, 0
  );

  const handleNewReview = () => {
    reset();
    router.push('/');
  };

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 px-5 h-12 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <button
            onClick={handleNewReview}
            className="flex items-center gap-1.5 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            <span className="text-xs">返回</span>
          </button>
          <div className="h-4 w-px bg-gray-200" />
          <h1 className="font-medium text-gray-800 text-sm truncate max-w-md">{document.title}</h1>
        </div>

        <div className="flex items-center gap-4 text-xs text-gray-400">
          <span>{reviewResult.reviews.length} 位评委</span>
          <span>{totalComments} 条评论</span>
          {highCount > 0 && (
            <span className="text-red-500 font-medium">{highCount} 个高优问题</span>
          )}
        </div>
      </header>

      {/* Dual pane */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left: PRD */}
        <div className="w-[55%] border-r border-gray-100 overflow-auto scroll-y bg-white">
          <PRDViewer />
        </div>
        {/* Right: Comments */}
        <div className="w-[45%] overflow-auto scroll-y bg-[#F7F8FA]">
          <CommentPanel />
        </div>
      </div>
    </div>
  );
}
