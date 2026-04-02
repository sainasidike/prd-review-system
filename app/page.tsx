'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import DocumentUploader from '@/components/DocumentUploader';
import ReviewProgress from '@/components/ReviewProgress';
import { useReviewStore } from '@/stores/reviewStore';
import { reviewPRDWithGemini } from '@/lib/gemini-reviewer';
import { DEMO_DOCUMENT, DEMO_REVIEW_RESULT } from '@/lib/demo-data';
import { REVIEWERS } from '@/lib/constants';
import ReviewerAvatar from '@/components/ReviewerAvatar';

export default function Home() {
  const router = useRouter();
  const [isReviewing, setIsReviewing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const document = useReviewStore(state => state.document);
  const setDocument = useReviewStore(state => state.setDocument);
  const setReviewResult = useReviewStore(state => state.setReviewResult);
  const setReviewProgress = useReviewStore(state => state.setReviewProgress);

  const handleDemoReview = () => {
    setDocument(DEMO_DOCUMENT);
    setReviewResult(DEMO_REVIEW_RESULT);
    router.push('/review');
  };

  const handleStartReview = async () => {
    if (!document) {
      setError('请先上传文档');
      return;
    }
    setError(null);
    setIsReviewing(true);
    try {
      const result = await reviewPRDWithGemini(
        document,
        (current, total) => setReviewProgress({ current, total })
      );
      if (result.reviews.length === 0) throw new Error('所有评委评审失败，请重试');
      setReviewResult(result);
      setReviewProgress(null);
      router.push('/review');
    } catch (err) {
      setError(err instanceof Error ? err.message : '评审失败，请重试');
      setReviewProgress(null);
    } finally {
      setIsReviewing(false);
    }
  };

  const reviewerColors: Record<string, string> = {
    operation: 'bg-[#DBEDDB] text-[#0F7B6C]',
    brand: 'bg-[#E8DEEE] text-[#6940A5]',
    tech: 'bg-[#D3E5EF] text-[#2383E2]',
    product: 'bg-[#FADEC9] text-[#D9730D]',
    ux: 'bg-[#FFE2DD] text-[#EB5757]',
    bi: 'bg-[#D3E5EF] text-[#2383E2]',
  };

  return (
    <main className="min-h-screen bg-white">
      {/* Top bar - Notion style, ultra minimal */}
      <div className="h-11 flex items-center px-4 text-sm">
        <span className="text-notion-fg-secondary text-[13px]">PRD Review</span>
      </div>

      {/* Main content area - centered like Notion page */}
      <div className="max-w-[720px] mx-auto px-24 pt-16 pb-24">
        {/* Page icon + title - Notion page header style */}
        <div className="mb-2 text-[40px] leading-none">📋</div>
        <h1 className="text-[40px] font-bold text-notion-fg leading-tight tracking-tight mb-1">
          PRD 智能评审
        </h1>
        <p className="text-notion-fg-muted text-base mb-10">
          上传你的产品需求文档，AI 将扮演 6 位团队 Leader 进行多角度评审
        </p>

        {/* Reviewers - Notion database row style */}
        <div className="mb-10">
          <div className="text-xs font-medium text-notion-fg-muted uppercase tracking-wider mb-3">
            评审团
          </div>
          <div className="flex flex-wrap gap-2">
            {REVIEWERS.map(reviewer => (
              <div
                key={reviewer.id}
                className={`tag ${reviewerColors[reviewer.id] || 'bg-notion-bg-hover text-notion-fg-secondary'}`}
              >
                <ReviewerAvatar reviewerId={reviewer.id} size={14} />
                <span className="ml-1.5">{reviewer.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-notion-border mb-8" />

        {!document ? (
          <>
            {/* Upload block */}
            <div className="mb-6">
              <DocumentUploader />
            </div>

            {/* Demo link - Notion text style */}
            <div className="flex items-center gap-2 text-sm">
              <span className="text-notion-fg-secondary">或者</span>
              <button
                onClick={handleDemoReview}
                className="text-notion-accent hover:underline underline-offset-2 cursor-pointer"
              >
                查看 Demo 评审结果
              </button>
              <span className="text-notion-fg-muted text-xs">（预生成，无需等待）</span>
            </div>
          </>
        ) : (
          <>
            {/* Uploaded file block */}
            <div className="flex items-center gap-3 p-3 rounded-md bg-notion-bg-hover mb-4">
              <div className="text-xl">📄</div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-notion-fg truncate">{document.fileName}</p>
                <p className="text-xs text-notion-fg-muted">{document.paragraphs.length} 个段落</p>
              </div>
              <button
                onClick={() => useReviewStore.getState().setDocument(null)}
                className="btn-notion text-xs text-notion-fg-secondary"
              >
                移除
              </button>
            </div>

            {isReviewing ? (
              <ReviewProgress />
            ) : (
              <button
                onClick={handleStartReview}
                className="btn-notion btn-notion-primary text-sm"
              >
                开始评审
              </button>
            )}

            {error && (
              <div className="mt-4 p-3 rounded-md bg-[#FBE4E4] text-notion-red text-sm">
                {error}
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
}
