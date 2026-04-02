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
    <div>
      <label
        className={`flex items-center gap-3 p-4 rounded-md border cursor-pointer transition-colors duration-100 ${
          isDragging
            ? 'border-notion-accent bg-notion-accent-light'
            : 'border-notion-border hover:bg-notion-bg-hover'
        }`}
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
      >
        <input
          type="file"
          className="hidden"
          accept=".pdf,.doc,.docx,.md,.txt"
          onChange={handleFileInput}
          disabled={isUploading}
        />

        {isUploading ? (
          <div className="flex items-center gap-2 text-sm text-notion-fg-secondary w-full justify-center py-1">
            <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            正在解析...
          </div>
        ) : (
          <>
            <div className="text-xl">📎</div>
            <div className="flex-1">
              <p className="text-sm text-notion-fg">
                {isDragging ? '松开上传' : '拖拽或点击上传文件'}
              </p>
              <p className="text-xs text-notion-fg-muted mt-0.5">支持 PDF、Word、Markdown、TXT，最大 10MB</p>
            </div>
          </>
        )}
      </label>

      {error && (
        <div role="alert" className="mt-2 p-2 rounded-md bg-[#FBE4E4] text-notion-red text-sm">
          {error}
        </div>
      )}
    </div>
  );
}
