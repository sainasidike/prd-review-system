'use client';

import { useReviewStore } from '@/stores/reviewStore';
import { Paragraph } from '@/lib/types';

export default function PRDViewer() {
  const document = useReviewStore(state => state.document);
  const highlightedParagraphId = useReviewStore(state => state.highlightedParagraphId);

  if (!document) return null;

  const renderParagraph = (p: Paragraph) => {
    const isHighlighted = p.id === highlightedParagraphId;
    const baseClasses = 'transition-colors duration-200 rounded p-2';
    const highlightClasses = isHighlighted ? 'bg-yellow-100 border-l-4 border-yellow-500' : '';

    if (p.type === 'heading') {
      const HeadingTag = `h${p.level || 1}` as keyof JSX.IntrinsicElements;
      return (
        <HeadingTag
          key={p.id}
          className={`font-bold mb-2 ${baseClasses} ${highlightClasses}`}
          style={{ fontSize: `${2.5 - (p.level || 1) * 0.3}rem` }}
        >
          {p.content}
        </HeadingTag>
      );
    }

    if (p.type === 'list') {
      return (
        <li key={p.id} className={`ml-6 mb-1 ${baseClasses} ${highlightClasses}`}>
          {p.content}
        </li>
      );
    }

    return (
      <p key={p.id} className={`mb-3 leading-relaxed ${baseClasses} ${highlightClasses}`}>
        {p.content}
      </p>
    );
  };

  return (
    <div className="h-full overflow-y-auto p-6 bg-white">
      <h2 className="text-2xl font-bold mb-6">{document.title}</h2>
      <div className="prose max-w-none">
        {document.paragraphs.map(renderParagraph)}
      </div>
    </div>
  );
}
