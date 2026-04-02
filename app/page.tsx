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

  return (
    <main className="min-h-screen bg-[#FAFAFB]">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-100 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-primary-500 flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
              </svg>
            </div>
            <span className="font-bold text-gray-900 text-[15px] tracking-tight">PRD Review</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-gray-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 pulse-dot" />
            <span>Gemini AI</span>
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-6 pt-12 pb-16">
        {/* Hero */}
        <div className="animate-fade-up mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary-50 rounded-full text-xs font-medium text-primary-600 mb-5">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
            </svg>
            6 位 AI 专家，多维度评审
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 mb-4 leading-[1.15]">
            上传你的 PRD，<br />
            <span className="text-gradient">获得专业级评审反馈</span>
          </h1>
          <p className="text-gray-500 text-base leading-relaxed max-w-xl">
            AI 分别扮演运营、品牌、技术、产品、交互、BI 六位团队 Leader，
            从各自专业视角深度评审你的产品需求文档。
          </p>
        </div>

        {/* Reviewer cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-12 stagger">
          {REVIEWERS.map(reviewer => (
            <div
              key={reviewer.id}
              className="card-lift bg-white rounded-xl p-4 border border-gray-100"
            >
              <div className="flex items-center gap-3 mb-2.5">
                <ReviewerAvatar reviewerId={reviewer.id} size={38} />
                <div>
                  <span className="font-semibold text-gray-800 text-[13px] block">{reviewer.name.split('·')[0].trim()}</span>
                  <span className="text-[11px] text-gray-400">{reviewer.name.split('·')[1]?.trim()}</span>
                </div>
              </div>
              <p className="text-xs text-gray-400 leading-relaxed">{reviewer.description}</p>
            </div>
          ))}
        </div>

        {!document ? (
          <div className="animate-fade-up" style={{ animationDelay: '0.15s' }}>
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
              <div className="flex">
                {/* Left: Upload */}
                <div className="flex-1 p-8">
                  <h2 className="font-bold text-gray-800 mb-1 text-[15px]">上传你的 PRD</h2>
                  <p className="text-sm text-gray-400 mb-5">支持 PDF、Word、Markdown、纯文本</p>
                  <DocumentUploader />
                </div>

                {/* Divider */}
                <div className="flex flex-col items-center py-8">
                  <div className="w-px flex-1 bg-gray-100" />
                  <span className="text-[11px] text-gray-300 py-3 font-medium">OR</span>
                  <div className="w-px flex-1 bg-gray-100" />
                </div>

                {/* Right: Demo */}
                <div className="w-52 flex flex-col justify-center items-center text-center p-8">
                  <p className="text-sm text-gray-500 mb-4">先看看效果？</p>
                  <button
                    onClick={handleDemoReview}
                    className="w-full py-2.5 bg-primary-50 text-primary-600 rounded-xl text-sm font-semibold hover:bg-primary-100 active:scale-[0.98] transition-all"
                  >
                    体验 Demo
                  </button>
                  <p className="text-[11px] text-gray-300 mt-2.5">预生成结果，无需等待</p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="animate-fade-up space-y-4">
            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
                    <svg className="w-5 h-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800 text-sm">{document.fileName}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{document.paragraphs.length} 个段落 · 准备就绪</p>
                  </div>
                </div>
                <button
                  onClick={() => useReviewStore.getState().setDocument(null)}
                  className="text-xs text-gray-400 hover:text-gray-600 px-3 py-1.5 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  重新上传
                </button>
              </div>

              {isReviewing ? (
                <ReviewProgress />
              ) : (
                <button
                  onClick={handleStartReview}
                  className="w-full py-3 bg-primary-500 text-white rounded-xl text-sm font-semibold hover:bg-primary-600 active:bg-primary-700 active:scale-[0.99] transition-all shadow-sm shadow-primary-200"
                >
                  开始评审（约 1-2 分钟）
                </button>
              )}
            </div>

            {error && (
              <div className="p-4 bg-red-50 border border-red-100 rounded-xl text-red-600 text-sm flex items-center gap-2">
                <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {error}
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
