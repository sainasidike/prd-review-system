'use client';

import { useState } from 'react';
import { parseDocument } from '@/lib/parser';
import { useReviewStore } from '@/stores/reviewStore';
import { SUPPORTED_FORMATS } from '@/lib/constants';

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
    <div className="max-w-xl">
      <div
        className={`relative border border-dashed rounded-2xl p-8 text-center transition-all duration-300 ${
          isDragging
            ? 'border-accent/50 bg-accent/[0.03] scale-[1.01]'
            : 'border-sand-300 bg-white hover:border-sand-400'
        }`}
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
      >
        <div className="space-y-3">
          <p className="font-display font-semibold text-ink-600 text-sm">
            {isDragging ? '松开上传' : '拖拽文件到这里'}
          </p>
          <p className="text-xs text-ink-300">
            PDF · Word · Markdown · 纯文本
          </p>

          <label className="inline-block">
            <input
              type="file"
              className="hidden"
              accept=".pdf,.doc,.docx,.md,.txt"
              onChange={handleFileInput}
              disabled={isUploading}
            />
            <span className={`cursor-pointer inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-medium transition-all ${
              isUploading
                ? 'bg-sand-100 text-ink-300 cursor-wait'
                : 'bg-sand-100 text-ink-500 hover:bg-sand-200 border border-sand-200'
            }`}>
              {isUploading ? (
                <>
                  <svg className="animate-spin w-3.5 h-3.5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  解析中...
                </>
              ) : '选择文件'}
            </span>
          </label>
        </div>
      </div>

      {error && (
        <div role="alert" className="mt-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm flex items-center gap-2">
          <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {error}
        </div>
      )}
    </div>
  );
}
