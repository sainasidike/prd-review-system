'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import DocumentUploader from '@/components/DocumentUploader';
import ReviewProgress from '@/components/ReviewProgress';
import { useReviewStore } from '@/stores/reviewStore';
import { reviewPRDWithGemini } from '@/lib/gemini-reviewer';
import { DEMO_DOCUMENT, DEMO_REVIEW_RESULT } from '@/lib/demo-data';
import { REVIEWERS } from '@/lib/constants';

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
    <main className="min-h-screen bg-[#F7F8FA]">
      {/* Header */}
      <header className="bg-white border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <span className="font-semibold text-gray-900 text-[15px]">PRD 智能评审</span>
          </div>
          <span className="text-xs text-gray-400">由 Google Gemini AI 驱动</span>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-6 py-10">
        {/* Hero */}
        <div className="animate-fade-up mb-10">
          <h1 className="text-3xl font-bold text-gray-900 mb-3">
            上传 PRD，获得 6 位专家评审
          </h1>
          <p className="text-gray-500 text-[15px] leading-relaxed max-w-lg">
            AI 分别扮演运营、品牌、技术、产品、交互、BI 六位团队 Leader，从各自专业视角对你的产品需求文档进行深度评审，精准定位到每个段落。
          </p>
        </div>

        {/* Reviewer cards */}
        <div className="grid grid-cols-3 gap-3 mb-10 stagger">
          {REVIEWERS.map(reviewer => (
            <div
              key={reviewer.id}
              className="bg-white rounded-xl p-4 border border-gray-100 hover:border-gray-200 hover:shadow-sm transition-all duration-200"
            >
              <div className="flex items-center gap-3 mb-2">
                <div
                  className="w-9 h-9 rounded-lg flex items-center justify-center text-lg"
                  style={{ backgroundColor: `${reviewer.color}12` }}
                >
                  {reviewer.icon}
                </div>
                <span className="font-medium text-gray-800 text-sm">{reviewer.name}</span>
              </div>
              <p className="text-xs text-gray-400 leading-relaxed">{reviewer.description}</p>
            </div>
          ))}
        </div>

        {!document ? (
          <div className="animate-fade-up" style={{ animationDelay: '0.15s' }}>
            {/* Action area */}
            <div className="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm">
              <div className="flex gap-8">
                {/* Left: Upload */}
                <div className="flex-1">
                  <h2 className="font-semibold text-gray-800 mb-1 text-[15px]">上传你的 PRD</h2>
                  <p className="text-sm text-gray-400 mb-5">支持 PDF、Word、Markdown、纯文本</p>
                  <DocumentUploader />
                </div>

                {/* Divider */}
                <div className="flex flex-col items-center gap-3 py-4">
                  <div className="w-px flex-1 bg-gray-100" />
                  <span className="text-xs text-gray-300 bg-white px-1">或</span>
                  <div className="w-px flex-1 bg-gray-100" />
                </div>

                {/* Right: Demo */}
                <div className="w-56 flex flex-col justify-center items-center text-center">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center mb-4">
                    <svg className="w-6 h-6 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <p className="text-sm text-gray-500 mb-4">先看看效果？</p>
                  <button
                    onClick={handleDemoReview}
                    className="px-5 py-2 bg-indigo-50 text-indigo-600 rounded-lg text-sm font-medium hover:bg-indigo-100 transition-colors"
                  >
                    体验 Demo
                  </button>
                  <p className="text-xs text-gray-300 mt-2">预生成结果，无需等待</p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="animate-fade-up space-y-4">
            {/* File ready */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
                    <svg className="w-5 h-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium text-gray-800 text-sm">{document.fileName}</p>
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
                  className="w-full py-3 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 active:bg-indigo-800 transition-colors shadow-sm shadow-indigo-200"
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
