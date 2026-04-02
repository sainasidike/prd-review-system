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
      const ext = '.' + file.name.split('.').pop()?.toLowerCase();
      if (!SUPPORTED_FORMATS.includes(ext)) {
        throw new Error(`不支持的文件格式，仅支持：${SUPPORTED_FORMATS.join(', ')}`);
      }

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
    e.target.value = '';
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div
        className={`relative border-2 border-dashed rounded-2xl p-14 text-center transition-all duration-300 ${
          isDragging
            ? 'border-blue-400 bg-blue-50/80 scale-[1.02] shadow-lg shadow-blue-100'
            : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-md'
        }`}
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
      >
        <div className="space-y-5">
          <div className={`mx-auto w-16 h-16 rounded-2xl flex items-center justify-center transition-colors ${
            isDragging ? 'bg-blue-100' : 'bg-slate-100'
          }`}>
            <svg className={`w-8 h-8 transition-colors ${isDragging ? 'text-blue-500' : 'text-slate-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-slate-800 mb-1">
              {isDragging ? '松开即可上传' : '上传 PRD 文档'}
            </h3>
            <p className="text-sm text-slate-400">
              支持 PDF、Word、Markdown、纯文本格式
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
            <span className={`cursor-pointer inline-flex items-center gap-2 px-6 py-2.5 rounded-xl font-medium transition-all ${
              isUploading
                ? 'bg-slate-100 text-slate-400 cursor-wait'
                : 'bg-slate-900 text-white hover:bg-slate-800 shadow-sm hover:shadow-md'
            }`}>
              {isUploading ? (
                <>
                  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  解析中...
                </>
              ) : '选择文件'}
            </span>
          </label>

          <p className="text-xs text-slate-300">
            或将文件拖拽到此处 · 最大 10MB
          </p>
        </div>
      </div>

      {error && (
        <div
          role="alert"
          className="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm flex items-start gap-3"
        >
          <svg className="w-5 h-5 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}
