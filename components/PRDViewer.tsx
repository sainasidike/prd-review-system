'use client';

import { useReviewStore } from '@/stores/reviewStore';
import { Paragraph } from '@/lib/types';

export default function PRDViewer() {
  const document = useReviewStore(state => state.document);
  const highlightedParagraphId = useReviewStore(state => state.highlightedParagraphId);

  if (!document) return null;

  const renderParagraph = (p: Paragraph) => {
    const isHighlighted = p.id === highlightedParagraphId;

    const baseClasses = 'transition-all duration-300 rounded-lg px-4 py-2';
    const highlightClasses = isHighlighted
      ? 'bg-amber-50 border-l-4 border-amber-400 shadow-sm'
      : 'border-l-4 border-transparent';

    if (p.type === 'heading') {
      const level = p.level || 1;
      const sizes: Record<number, string> = {
        1: 'text-2xl font-bold text-slate-900 mt-8 mb-3',
        2: 'text-xl font-semibold text-slate-800 mt-6 mb-2',
        3: 'text-lg font-semibold text-slate-700 mt-4 mb-2',
      };
      return (
        <div key={p.id} id={`p-${p.id}`} className={`${baseClasses} ${highlightClasses} ${sizes[level] || sizes[3]}`}>
          {p.content}
        </div>
      );
    }

    if (p.type === 'list') {
      return (
        <div key={p.id} id={`p-${p.id}`} className={`${baseClasses} ${highlightClasses} ml-6 mb-0.5 flex items-start gap-2`}>
          <span className="text-slate-300 mt-1.5 shrink-0">
            <svg className="w-1.5 h-1.5" fill="currentColor" viewBox="0 0 8 8"><circle cx="4" cy="4" r="4"/></svg>
          </span>
          <span className="text-slate-600 leading-relaxed">{p.content}</span>
        </div>
      );
    }

    return (
      <div key={p.id} id={`p-${p.id}`} className={`${baseClasses} ${highlightClasses} mb-1 text-slate-600 leading-relaxed`}>
        {p.content}
      </div>
    );
  };

  return (
    <div className="h-full overflow-y-auto p-8 bg-white">
      <div className="max-w-none prose-prd">
        {document.paragraphs.map(renderParagraph)}
      </div>
    </div>
  );
}
