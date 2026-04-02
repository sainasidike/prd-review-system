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
    <div className="h-screen flex flex-col bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 px-6 py-3.5 shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div>
              <h1 className="text-lg font-bold text-slate-900 leading-tight">{document.title}</h1>
              <div className="flex items-center gap-3 text-sm text-slate-500 mt-0.5">
                <span className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                  {reviewResult.reviews.length} 位评委
                </span>
                <span className="text-slate-300">|</span>
                <span>{totalComments} 条评论</span>
                {highCount > 0 && (
                  <>
                    <span className="text-slate-300">|</span>
                    <span className="text-red-500 font-medium">{highCount} 个高优</span>
                  </>
                )}
              </div>
            </div>
          </div>
          <button
            onClick={handleNewReview}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 hover:border-slate-300 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            新建评审
          </button>
        </div>
      </header>

      {/* Dual-pane layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left: PRD content */}
        <div className="w-[58%] border-r border-slate-200 overflow-auto custom-scrollbar">
          <PRDViewer />
        </div>

        {/* Right: Comments */}
        <div className="w-[42%] overflow-auto custom-scrollbar">
          <CommentPanel />
        </div>
      </div>
    </div>
  );
}
