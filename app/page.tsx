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
    <main className="min-h-screen relative overflow-hidden">
      {/* Ambient glow orbs */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-warm-400/[0.04] blur-[120px] animate-glow" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full bg-warm-400/[0.03] blur-[100px] animate-glow" style={{ animationDelay: '1.5s' }} />
      </div>

      <div className="relative z-10">
        {/* Navigation */}
        <nav className="flex items-center justify-between px-8 py-6 max-w-7xl mx-auto">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-warm-400/20 border border-warm-400/30 flex items-center justify-center">
              <span className="text-warm-400 text-sm font-bold font-display">R</span>
            </div>
            <span className="font-display font-semibold text-warm-100 tracking-tight">Review Room</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-warm-300/40">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500/80 animate-pulse" />
            Gemini AI
          </div>
        </nav>

        {/* Hero */}
        <section className="max-w-5xl mx-auto px-8 pt-16 pb-20">
          <div className="animate-fade-up">
            {/* Eyebrow */}
            <div className="flex items-center gap-3 mb-8">
              <div className="h-px w-12 bg-warm-400/40" />
              <span className="text-xs font-medium tracking-[0.2em] uppercase text-warm-400/70">
                AI-Powered Document Review
              </span>
            </div>

            {/* Title */}
            <h1 className="font-display text-6xl md:text-7xl font-bold tracking-tight leading-[0.95] mb-6">
              <span className="text-warm-50">PRD 智能</span>
              <br />
              <span className="text-warm-400">评审系统</span>
            </h1>

            <p className="text-lg text-warm-300/60 max-w-xl leading-relaxed mb-14 font-light">
              上传产品需求文档，六位 AI 团队 Leader 从运营、品牌、技术、产品、交互、BI 六个维度进行深度评审
            </p>

            {/* Reviewer strip */}
            <div className="flex items-center gap-6 mb-16 stagger">
              {REVIEWERS.map((reviewer) => (
                <div key={reviewer.id} className="group relative">
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl border transition-all duration-300 group-hover:scale-110 group-hover:-translate-y-1"
                    style={{
                      backgroundColor: `${reviewer.color}10`,
                      borderColor: `${reviewer.color}25`,
                    }}
                  >
                    {reviewer.icon}
                  </div>
                  {/* Tooltip */}
                  <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                    <span className="text-[11px] text-warm-300/70 bg-surface-3 px-2.5 py-1 rounded-md border border-surface-4">
                      {reviewer.name}
                    </span>
                  </div>
                </div>
              ))}

              <div className="h-px flex-1 bg-gradient-to-r from-surface-3 to-transparent" />
            </div>
          </div>

          {!document ? (
            <div className="animate-fade-up" style={{ animationDelay: '0.2s' }}>
              {/* CTA buttons */}
              <div className="flex items-center gap-4 mb-20">
                <button
                  onClick={handleDemoReview}
                  className="btn-lift px-8 py-3.5 bg-warm-400 text-surface-0 rounded-xl font-display font-semibold text-sm tracking-wide"
                >
                  体验 Demo
                </button>
                <span className="text-warm-300/30 text-sm">或上传自己的 PRD</span>
              </div>

              {/* Upload area */}
              <DocumentUploader />
            </div>
          ) : (
            <div className="animate-fade-up space-y-6" style={{ animationDelay: '0.1s' }}>
              {/* Uploaded file */}
              <div className="bg-surface-1 border border-surface-3 rounded-2xl p-6 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                    <svg className="w-5 h-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-display font-semibold text-warm-100">{document.fileName}</p>
                    <p className="text-sm text-warm-300/50 mt-0.5">{document.paragraphs.length} 个段落 · 准备就绪</p>
                  </div>
                </div>
                <button
                  onClick={() => useReviewStore.getState().setDocument(null)}
                  className="text-sm text-warm-300/40 hover:text-warm-300/70 px-3 py-1.5 rounded-lg hover:bg-surface-2 transition-colors"
                >
                  重新上传
                </button>
              </div>

              {isReviewing ? (
                <ReviewProgress />
              ) : (
                <div className="pt-4">
                  <button
                    onClick={handleStartReview}
                    className="btn-lift w-full py-4 bg-warm-400 text-surface-0 rounded-xl font-display font-semibold text-base tracking-wide"
                  >
                    开始评审
                  </button>
                  <p className="text-center text-sm text-warm-300/30 mt-3">约 1-2 分钟 · 完全免费</p>
                </div>
              )}

              {error && (
                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-300 text-sm flex items-center gap-3">
                  <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {error}
                </div>
              )}
            </div>
          )}
        </section>

        {/* Footer */}
        <footer className="border-t border-surface-2 py-8 px-8 max-w-7xl mx-auto">
          <div className="flex items-center justify-between text-xs text-warm-300/25">
            <span>PRD Review Room</span>
            <span>Powered by Google Gemini</span>
          </div>
        </footer>
      </div>
    </main>
  );
}
