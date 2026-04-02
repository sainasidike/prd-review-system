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
    <div className="h-screen flex flex-col bg-surface-0">
      {/* Header */}
      <header className="bg-surface-1 border-b border-surface-3 px-6 py-3 shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* Logo */}
            <div className="w-7 h-7 rounded-lg bg-warm-400/20 border border-warm-400/30 flex items-center justify-center">
              <span className="text-warm-400 text-xs font-bold font-display">R</span>
            </div>

            <div className="h-5 w-px bg-surface-3" />

            <div>
              <h1 className="font-display font-semibold text-warm-100 text-sm leading-tight">{document.title}</h1>
              <div className="flex items-center gap-3 mt-0.5">
                <span className="text-xs text-warm-300/35">
                  {reviewResult.reviews.length} 位评委
                </span>
                <span className="text-xs text-warm-300/20">·</span>
                <span className="text-xs text-warm-300/35">
                  {totalComments} 条评论
                </span>
                {highCount > 0 && (
                  <>
                    <span className="text-xs text-warm-300/20">·</span>
                    <span className="text-xs text-red-400/80 font-medium">
                      {highCount} 高优
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>

          <button
            onClick={handleNewReview}
            className="flex items-center gap-2 px-3.5 py-1.5 text-xs font-medium text-warm-300/50 border border-surface-3 rounded-lg hover:bg-surface-2 hover:text-warm-200 hover:border-surface-4 transition-colors"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            新建评审
          </button>
        </div>
      </header>

      {/* Dual-pane */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left: PRD content - light background for readability */}
        <div className="w-[56%] border-r border-surface-3 overflow-auto scroll-light bg-warm-50">
          <PRDViewer />
        </div>

        {/* Right: Comments - dark */}
        <div className="w-[44%] overflow-auto scroll-dark">
          <CommentPanel />
        </div>
      </div>
    </div>
  );
}
