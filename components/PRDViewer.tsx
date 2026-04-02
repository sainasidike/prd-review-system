'use client';

import { useReviewStore } from '@/stores/reviewStore';
import { Paragraph } from '@/lib/types';

export default function PRDViewer() {
  const document = useReviewStore(state => state.document);
  const highlightedParagraphId = useReviewStore(state => state.highlightedParagraphId);

  if (!document) return null;

  const renderParagraph = (p: Paragraph) => {
    const isHighlighted = p.id === highlightedParagraphId;
    const highlightCls = isHighlighted
      ? 'bg-amber-50 border-l-[3px] border-l-amber-400 pl-4'
      : 'border-l-[3px] border-l-transparent pl-4';
    const base = `transition-all duration-200 rounded-md py-1 ${highlightCls}`;

    if (p.type === 'heading') {
      const level = p.level || 1;
      const hStyles: Record<number, string> = {
        1: 'text-xl font-bold text-gray-900 mt-8 mb-2',
        2: 'text-lg font-semibold text-gray-800 mt-6 mb-2',
        3: 'text-base font-semibold text-gray-700 mt-4 mb-1.5',
      };
      return (
        <div key={p.id} id={`p-${p.id}`} className={`${base} ${hStyles[level] || hStyles[3]}`}>
          {p.content}
        </div>
      );
    }

    if (p.type === 'list') {
      return (
        <div key={p.id} id={`p-${p.id}`} className={`${base} ml-4 flex items-start gap-2`}>
          <span className="text-gray-300 mt-[9px] shrink-0 text-[6px]">●</span>
          <span className="text-gray-600 leading-7 text-[14px]">{p.content}</span>
        </div>
      );
    }

    return (
      <div key={p.id} id={`p-${p.id}`} className={`${base} text-gray-600 leading-7 text-[14px] mb-0.5`}>
        {p.content}
      </div>
    );
  };

  return (
    <div className="px-10 py-8 max-w-[680px] mx-auto">
      {document.paragraphs.map(renderParagraph)}
    </div>
  );
}
