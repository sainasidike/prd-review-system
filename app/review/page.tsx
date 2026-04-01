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

  const handleNewReview = () => {
    reset();
    router.push('/');
  };

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white border-b px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">{document.title}</h1>
            <p className="text-sm text-gray-600 mt-1">
              {reviewResult.reviews.length} 位评委 · {reviewResult.reviews.reduce((sum, r) => sum + r.comments.length, 0)} 条评论
            </p>
          </div>
          <button
            onClick={handleNewReview}
            className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            📄 新建评审
          </button>
        </div>
      </header>

      {/* Dual-pane layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left: PRD content (60%) */}
        <div className="w-[60%] border-r overflow-auto">
          <PRDViewer />
        </div>

        {/* Right: Comments (40%) */}
        <div className="w-[40%] overflow-auto">
          <CommentPanel />
        </div>
      </div>
    </div>
  );
}
