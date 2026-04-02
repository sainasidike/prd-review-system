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
    <main className="min-h-screen bg-sand-50">
      {/* Nav */}
      <nav className="flex items-center justify-between px-8 py-6 max-w-6xl mx-auto">
        <span className="font-display font-semibold text-ink-700 tracking-tight text-lg">PRD Review</span>
        <div className="flex items-center gap-2 text-xs text-ink-300">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          Gemini AI
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-4xl mx-auto px-8 pt-12 pb-16">
        <div className="animate-fade-up">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-px w-10 bg-accent/40" />
            <span className="text-xs font-medium tracking-[0.15em] uppercase text-accent">
              AI-Powered Review
            </span>
          </div>

          <h1 className="font-display text-5xl md:text-6xl font-bold tracking-tight leading-[1] mb-5 text-ink-700">
            PRD 智能<br />评审系统
          </h1>

          <p className="text-base text-ink-400 max-w-lg leading-relaxed mb-12">
            上传产品需求文档，六位 AI 团队 Leader 从运营、品牌、技术、产品、交互、BI 六个维度进行深度评审
          </p>

          {/* Reviewer strip */}
          <div className="flex items-center gap-5 mb-14 stagger">
            {REVIEWERS.map((reviewer) => (
              <div key={reviewer.id} className="group relative">
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center text-xl border transition-all duration-300 group-hover:scale-110 group-hover:-translate-y-1"
                  style={{
                    backgroundColor: `${reviewer.color}0A`,
                    borderColor: `${reviewer.color}20`,
                  }}
                >
                  {reviewer.icon}
                </div>
                <div className="absolute -bottom-9 left-1/2 -translate-x-1/2 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                  <span className="text-[11px] text-ink-400 bg-white px-2 py-1 rounded-md border border-sand-200 shadow-sm">
                    {reviewer.name}
                  </span>
                </div>
              </div>
            ))}
            <div className="h-px flex-1 bg-gradient-to-r from-sand-200 to-transparent" />
          </div>
        </div>

        {!document ? (
          <div className="animate-fade-up" style={{ animationDelay: '0.15s' }}>
            <div className="flex items-center gap-4 mb-14">
              <button
                onClick={handleDemoReview}
                className="btn-lift px-7 py-3 bg-ink-700 text-white rounded-xl font-display font-semibold text-sm"
              >
                体验 Demo
              </button>
              <span className="text-ink-300 text-sm">或上传自己的 PRD</span>
            </div>

            <DocumentUploader />
          </div>
        ) : (
          <div className="animate-fade-up space-y-5" style={{ animationDelay: '0.1s' }}>
            {/* Uploaded file */}
            <div className="bg-white border border-sand-200 rounded-2xl p-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center">
                  <svg className="w-5 h-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <p className="font-display font-semibold text-ink-700 text-sm">{document.fileName}</p>
                  <p className="text-xs text-ink-300 mt-0.5">{document.paragraphs.length} 个段落</p>
                </div>
              </div>
              <button
                onClick={() => useReviewStore.getState().setDocument(null)}
                className="text-xs text-ink-300 hover:text-ink-500 px-3 py-1.5 rounded-lg hover:bg-sand-100 transition-colors"
              >
                重新上传
              </button>
            </div>

            {isReviewing ? (
              <ReviewProgress />
            ) : (
              <div className="pt-2">
                <button
                  onClick={handleStartReview}
                  className="btn-lift w-full py-3.5 bg-ink-700 text-white rounded-xl font-display font-semibold text-sm"
                >
                  开始评审
                </button>
                <p className="text-center text-xs text-ink-300 mt-3">约 1-2 分钟 · 完全免费</p>
              </div>
            )}

            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm flex items-center gap-3">
                <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {error}
              </div>
            )}
          </div>
        )}
      </section>

      <footer className="border-t border-sand-200 py-8 px-8 max-w-6xl mx-auto">
        <div className="flex items-center justify-between text-xs text-ink-300/50">
          <span>PRD Review</span>
          <span>Powered by Google Gemini</span>
        </div>
      </footer>
    </main>
  );
}
