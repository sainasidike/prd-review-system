'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import DocumentUploader from '@/components/DocumentUploader';
import APIKeyInput from '@/components/APIKeyInput';
import ReviewProgress from '@/components/ReviewProgress';
import { useReviewStore } from '@/stores/reviewStore';
import { reviewPRD } from '@/lib/reviewer';
import { DEMO_DOCUMENT, DEMO_REVIEW_RESULT } from '@/lib/demo-data';

export default function Home() {
  const router = useRouter();
  const [isReviewing, setIsReviewing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const document = useReviewStore(state => state.document);
  const apiKey = useReviewStore(state => state.apiKey);
  const setDocument = useReviewStore(state => state.setDocument);
  const setReviewResult = useReviewStore(state => state.setReviewResult);
  const setReviewProgress = useReviewStore(state => state.setReviewProgress);

  const handleDemoReview = () => {
    // 加载 Demo 数据
    setDocument(DEMO_DOCUMENT);
    setReviewResult(DEMO_REVIEW_RESULT);
    // 直接跳转到评审结果页
    router.push('/review');
  };

  const handleStartReview = async () => {
    if (!document || !apiKey) {
      setError('请先上传文档并输入 API Key');
      return;
    }

    setError(null);
    setIsReviewing(true);

    try {
      const result = await reviewPRD(
        document,
        apiKey,
        (current, total) => setReviewProgress({ current, total })
      );

      setReviewResult(result);
      setReviewProgress(null);
      router.push('/review');

    } catch (err) {
      setError(err instanceof Error ? err.message : '评审失败');
      setReviewProgress(null);
    } finally {
      setIsReviewing(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">PRD 智能评审系统</h1>
          <p className="text-gray-600 mb-8">
            上传 PRD 文档，AI 自动扮演 6 位团队 Leader 进行多角度评审
          </p>

          {/* Demo 体验按钮 */}
          {!document && (
            <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-6 mb-8 border-2 border-purple-200">
              <div className="flex items-center justify-center gap-4 mb-4">
                <span className="text-3xl">✨</span>
                <h2 className="text-xl font-semibold text-gray-800">
                  无需 API Key，立即体验
                </h2>
              </div>
              <p className="text-gray-600 mb-4 text-sm">
                查看预生成的评审示例，了解 6 位 AI 评委如何从不同角度分析 PRD
              </p>
              <button
                onClick={handleDemoReview}
                className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-blue-700 transition-all shadow-lg hover:shadow-xl"
              >
                🚀 体验 Demo
              </button>
              <p className="text-xs text-gray-500 mt-3">
                （Demo 使用预生成的评审结果，无需等待）
              </p>
            </div>
          )}
        </div>

        {!document ? (
          <>
            <div className="text-center mb-4 text-gray-500 text-sm">
              ──────  或上传自己的 PRD 文档  ──────
            </div>
            <DocumentUploader />
          </>
        ) : (
          <>
            <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-lg mb-1">✅ 文档已上传</h3>
                  <p className="text-gray-600">{document.fileName}</p>
                  <p className="text-sm text-gray-500 mt-1">
                    共 {document.paragraphs.length} 个段落
                  </p>
                </div>
                <button
                  onClick={() => useReviewStore.getState().setDocument(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✖️ 重新上传
                </button>
              </div>
            </div>

            <APIKeyInput />

            {isReviewing ? (
              <ReviewProgress />
            ) : (
              <div className="mt-8 text-center">
                <button
                  onClick={handleStartReview}
                  disabled={!apiKey}
                  className="bg-blue-600 text-white px-12 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                >
                  🚀 开始评审
                </button>
              </div>
            )}

            {error && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                ❌ {error}
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
}
