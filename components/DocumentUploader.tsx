'use client';

import { useState } from 'react';
import { parseDocument } from '@/lib/parser';
import { useReviewStore } from '@/stores/reviewStore';
import { SUPPORTED_FORMATS, MAX_FILE_SIZE } from '@/lib/constants';

export default function DocumentUploader() {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const setDocument = useReviewStore(state => state.setDocument);

  const handleFile = async (file: File) => {
    setError(null);
    setIsUploading(true);

    try {
      // Validate file format
      const ext = '.' + file.name.split('.').pop()?.toLowerCase();
      if (!SUPPORTED_FORMATS.includes(ext)) {
        throw new Error(`不支持的文件格式，仅支持：${SUPPORTED_FORMATS.join(', ')}`);
      }

      // Parse document (file size validation happens in parser)
      const doc = await parseDocument(file);
      setDocument(doc);

    } catch (err) {
      setError(err instanceof Error ? err.message : '文件解析失败');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
    // Reset input to allow re-selecting the same file
    e.target.value = '';
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div
        className={`border-2 border-dashed rounded-lg p-12 text-center transition-colors ${
          isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
        }`}
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
      >
        <div className="space-y-4">
          <div className="text-6xl">📄</div>
          <div>
            <h3 className="text-xl font-semibold mb-2">上传 PRD 文档</h3>
            <p className="text-gray-600 mb-4">
              支持 PDF、Word、Markdown、纯文本
            </p>
          </div>

          <label className="inline-block">
            <input
              type="file"
              className="hidden"
              accept=".pdf,.doc,.docx,.md,.txt"
              onChange={handleFileInput}
              disabled={isUploading}
            />
            <span className="cursor-pointer bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors inline-block">
              {isUploading ? '解析中...' : '选择文件'}
            </span>
          </label>

          <p className="text-sm text-gray-500">
            或拖拽文件到此处
          </p>
        </div>
      </div>

      {error && (
        <div
          role="alert"
          className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700"
        >
          ❌ {error}
        </div>
      )}
    </div>
  );
}
