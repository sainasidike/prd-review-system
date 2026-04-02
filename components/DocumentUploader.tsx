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
    <div className="max-w-2xl">
      <div
        className={`relative border rounded-2xl p-12 text-center transition-all duration-300 ${
          isDragging
            ? 'border-warm-400/50 bg-warm-400/[0.04] scale-[1.01]'
            : 'border-surface-3 bg-surface-1/50 hover:border-surface-4 hover:bg-surface-1'
        }`}
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
      >
        {/* Corner accents */}
        <div className="absolute top-0 left-0 w-6 h-6 border-t border-l border-warm-400/20 rounded-tl-2xl" />
        <div className="absolute top-0 right-0 w-6 h-6 border-t border-r border-warm-400/20 rounded-tr-2xl" />
        <div className="absolute bottom-0 left-0 w-6 h-6 border-b border-l border-warm-400/20 rounded-bl-2xl" />
        <div className="absolute bottom-0 right-0 w-6 h-6 border-b border-r border-warm-400/20 rounded-br-2xl" />

        <div className="space-y-5">
          <div className={`mx-auto w-14 h-14 rounded-2xl flex items-center justify-center border transition-colors duration-300 ${
            isDragging
              ? 'bg-warm-400/10 border-warm-400/30'
              : 'bg-surface-2 border-surface-3'
          }`}>
            <svg className={`w-6 h-6 transition-colors ${isDragging ? 'text-warm-400' : 'text-warm-300/30'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
            </svg>
          </div>

          <div>
            <p className="font-display font-semibold text-warm-100 mb-1">
              {isDragging ? '松开上传' : '拖拽文件到这里'}
            </p>
            <p className="text-sm text-warm-300/35">
              PDF · Word · Markdown · 纯文本
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
            <span className={`cursor-pointer inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
              isUploading
                ? 'bg-surface-3 text-warm-300/40 cursor-wait'
                : 'bg-surface-2 text-warm-200 hover:bg-surface-3 border border-surface-4 hover:border-warm-400/20'
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
        </div>
      </div>

      {error && (
        <div role="alert" className="mt-4 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-300 text-sm flex items-center gap-3">
          <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {error}
        </div>
      )}
    </div>
  );
}
