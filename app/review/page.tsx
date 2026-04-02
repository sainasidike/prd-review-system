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
    <div className="h-screen flex flex-col bg-sand-50">
      {/* Header */}
      <header className="bg-white border-b border-sand-200 px-6 py-3 shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="font-display font-semibold text-ink-700 text-sm">PRD Review</span>
            <div className="h-4 w-px bg-sand-200" />
            <div>
              <h1 className="font-display font-medium text-ink-600 text-sm leading-tight">{document.title}</h1>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-xs text-ink-300">{reviewResult.reviews.length} 评委</span>
                <span className="text-xs text-sand-300">·</span>
                <span className="text-xs text-ink-300">{totalComments} 条评论</span>
                {highCount > 0 && (
                  <>
                    <span className="text-xs text-sand-300">·</span>
                    <span className="text-xs text-red-500 font-medium">{highCount} 高优</span>
                  </>
                )}
              </div>
            </div>
          </div>

          <button
            onClick={handleNewReview}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-ink-400 border border-sand-200 rounded-lg hover:bg-sand-100 hover:text-ink-600 transition-colors"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            新建
          </button>
        </div>
      </header>

      {/* Dual-pane */}
      <div className="flex-1 flex overflow-hidden">
        <div className="w-[56%] border-r border-sand-200 overflow-auto scroll-thin bg-white">
          <PRDViewer />
        </div>
        <div className="w-[44%] overflow-auto scroll-thin bg-sand-50">
          <CommentPanel />
        </div>
      </div>
    </div>
  );
}
