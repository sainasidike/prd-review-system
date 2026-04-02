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

      if (result.reviews.length === 0) {
        throw new Error('所有评委评审失败，请重试');
      }

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
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 text-white">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-500/20 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-400/5 rounded-full" />
        </div>

        <div className="relative max-w-5xl mx-auto px-6 pt-16 pb-20">
          <div className="text-center animate-fade-in-up">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-sm mb-8">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              由 Google Gemini AI 驱动 · 完全免费
            </div>

            <h1 className="text-5xl font-bold mb-4 tracking-tight">
              PRD 智能评审系统
            </h1>
            <p className="text-lg text-blue-100 max-w-2xl mx-auto mb-12">
              上传 PRD 文档，AI 自动扮演 6 位团队 Leader 进行多角度专业评审
            </p>

            {/* Reviewer avatars */}
            <div className="flex justify-center gap-4 mb-12 stagger-children">
              {REVIEWERS.map((reviewer, i) => (
                <div
                  key={reviewer.id}
                  className="group flex flex-col items-center"
                  style={{ animationDelay: `${i * 0.1}s` }}
                >
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shadow-lg transition-transform group-hover:scale-110 group-hover:-translate-y-1"
                    style={{ backgroundColor: `${reviewer.color}20`, border: `2px solid ${reviewer.color}40` }}
                  >
                    {reviewer.icon}
                  </div>
                  <span className="text-xs text-blue-200 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    {reviewer.name.replace(' Leader', '')}
                  </span>
                </div>
              ))}
            </div>

            {/* Demo CTA */}
            {!document && (
              <div className="flex flex-col items-center gap-3">
                <button
                  onClick={handleDemoReview}
                  className="group relative px-8 py-3.5 bg-white text-slate-900 rounded-xl font-semibold hover:bg-blue-50 transition-all shadow-xl shadow-black/20 hover:shadow-2xl hover:shadow-black/30 hover:-translate-y-0.5"
                >
                  <span className="flex items-center gap-2">
                    体验 Demo
                    <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </span>
                </button>
                <span className="text-sm text-blue-200/70">
                  预生成的评审结果，无需等待
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Wave divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 60L1440 60L1440 30C1440 30 1200 0 720 0C240 0 0 30 0 30L0 60Z" className="fill-slate-50" />
          </svg>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-4xl mx-auto px-6 -mt-4 pb-20">
        {!document ? (
          <div className="animate-fade-in-up">
            <div className="flex items-center gap-4 my-10">
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent" />
              <span className="text-sm text-slate-400 font-medium">或上传自己的 PRD</span>
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent" />
            </div>
            <DocumentUploader />
          </div>
        ) : (
          <div className="animate-fade-in-up space-y-6 mt-8">
            {/* Uploaded file card */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center">
                    <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900">{document.fileName}</h3>
                    <p className="text-sm text-slate-500">
                      {document.paragraphs.length} 个段落 · 准备就绪
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => useReviewStore.getState().setDocument(null)}
                  className="text-sm text-slate-400 hover:text-slate-600 px-3 py-1.5 rounded-lg hover:bg-slate-100 transition-colors"
                >
                  重新上传
                </button>
              </div>
            </div>

            {/* Free notice */}
            <div className="bg-gradient-to-r from-emerald-50 to-blue-50 rounded-2xl p-5 border border-emerald-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center shrink-0">
                  <svg className="w-5 h-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p className="font-medium text-slate-800">完全免费，由 Google Gemini 提供支持</p>
                  <p className="text-sm text-slate-500">无需注册 · 无需登录 · 6 位 AI 评委即将开始工作</p>
                </div>
              </div>
            </div>

            {isReviewing ? (
              <ReviewProgress />
            ) : (
              <div className="text-center pt-4">
                <button
                  onClick={handleStartReview}
                  className="group relative px-12 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl text-lg font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30 hover:-translate-y-0.5"
                >
                  <span className="flex items-center gap-2">
                    开始免费评审
                    <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </span>
                </button>
                <p className="text-sm text-slate-400 mt-3">
                  评审过程约 1-2 分钟
                </p>
              </div>
            )}

            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 flex items-start gap-3">
                <svg className="w-5 h-5 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{error}</span>
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
