'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import DocumentUploader from '@/components/DocumentUploader';
import APIKeyInput from '@/components/APIKeyInput';
import ReviewProgress from '@/components/ReviewProgress';
import { useReviewStore } from '@/stores/reviewStore';
import { reviewPRD } from '@/lib/reviewer';

export default function Home() {
  const router = useRouter();
  const [isReviewing, setIsReviewing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const document = useReviewStore(state => state.document);
  const apiKey = useReviewStore(state => state.apiKey);
  const setReviewResult = useReviewStore(state => state.setReviewResult);
  const setReviewProgress = useReviewStore(state => state.setReviewProgress);

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
          <p className="text-gray-600">
            上传 PRD 文档，AI 自动扮演 6 位团队 Leader 进行多角度评审
          </p>
        </div>

        {!document ? (
          <DocumentUploader />
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
