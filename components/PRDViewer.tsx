'use client';

import { useReviewStore } from '@/stores/reviewStore';
import { Paragraph } from '@/lib/types';

export default function PRDViewer() {
  const document = useReviewStore(state => state.document);
  const highlightedParagraphId = useReviewStore(state => state.highlightedParagraphId);

  if (!document) return null;

  const renderParagraph = (p: Paragraph) => {
    const isHighlighted = p.id === highlightedParagraphId;

    const base = 'transition-all duration-300 rounded-lg px-4 py-1.5 border-l-[3px]';
    const highlight = isHighlighted
      ? 'border-l-warm-400 bg-warm-400/10'
      : 'border-l-transparent';

    if (p.type === 'heading') {
      const level = p.level || 1;
      const styles: Record<number, string> = {
        1: 'text-[1.6rem] font-bold text-neutral-900 mt-10 mb-3 font-display',
        2: 'text-xl font-semibold text-neutral-800 mt-7 mb-2 font-display',
        3: 'text-base font-semibold text-neutral-700 mt-5 mb-2 font-display',
      };
      return (
        <div key={p.id} id={`p-${p.id}`} className={`${base} ${highlight} ${styles[level] || styles[3]}`}>
          {p.content}
        </div>
      );
    }

    if (p.type === 'list') {
      return (
        <div key={p.id} id={`p-${p.id}`} className={`${base} ${highlight} ml-5 mb-0.5 flex items-start gap-2.5`}>
          <span className="text-warm-400/60 mt-2 shrink-0">
            <svg className="w-1.5 h-1.5" fill="currentColor" viewBox="0 0 8 8"><circle cx="4" cy="4" r="4"/></svg>
          </span>
          <span className="text-neutral-600 leading-[1.8] text-[0.9rem]">{p.content}</span>
        </div>
      );
    }

    return (
      <div key={p.id} id={`p-${p.id}`} className={`${base} ${highlight} mb-1 text-neutral-600 leading-[1.8] text-[0.9rem]`}>
        {p.content}
      </div>
    );
  };

  return (
    <div className="h-full overflow-y-auto px-10 py-8">
      <div className="max-w-[680px] mx-auto">
        {document.paragraphs.map(renderParagraph)}
      </div>
    </div>
  );
}
