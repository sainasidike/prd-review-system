'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useReviewStore } from '@/stores/reviewStore';
import { REVIEWERS } from '@/lib/constants';
import ReviewerAvatar from '@/components/ReviewerAvatar';
import { ReviewComment } from '@/lib/types';

interface EnrichedComment extends ReviewComment {
  reviewerId: string;
  reviewerName: string;
  color: string;
}

export default function ReviewPage() {
  const router = useRouter();
  const document = useReviewStore(state => state.document);
  const reviewResult = useReviewStore(state => state.reviewResult);
  const selectedReviewers = useReviewStore(state => state.selectedReviewers);
  const toggleReviewer = useReviewStore(state => state.toggleReviewer);
  const reset = useReviewStore(state => state.reset);
  const [activeCommentId, setActiveCommentId] = useState<string | null>(null);

  useEffect(() => {
    if (!document || !reviewResult) {
      router.push('/');
    }
  }, [document, reviewResult, router]);

  const filteredReviews = selectedReviewers.length > 0
    ? (reviewResult?.reviews.filter(r => selectedReviewers.includes(r.reviewerId)) ?? [])
    : (reviewResult?.reviews ?? []);

  const allComments = useMemo(() => {
    const list: EnrichedComment[] = [];
    filteredReviews.forEach(review => {
      review.comments.forEach(comment => {
        list.push({
          ...comment,
          reviewerId: review.reviewerId,
          reviewerName: review.reviewerName,
          color: review.color,
        });
      });
    });
    return list;
  }, [filteredReviews]);

  const commentsByParagraph = useMemo(() => {
    const map = new Map<number, EnrichedComment[]>();
    allComments.forEach(comment => {
      if (!map.has(comment.paragraphId)) {
        map.set(comment.paragraphId, []);
      }
      map.get(comment.paragraphId)!.push(comment);
    });
    return map;
  }, [allComments]);

  if (!document || !reviewResult) return null;

  const totalComments = allComments.length;

  function renderText(content: string, paragraphId: number) {
    const comments = commentsByParagraph.get(paragraphId);
    if (!comments || comments.length === 0) return <>{content}</>;

    type H = { start: number; end: number; id: string; color: string };
    const highlights: H[] = [];
    comments.forEach(c => {
      const idx = content.indexOf(c.quotedText);
      if (idx !== -1) {
        highlights.push({ start: idx, end: idx + c.quotedText.length, id: c.id, color: c.color });
      }
    });
    if (highlights.length === 0) return <>{content}</>;

    highlights.sort((a, b) => a.start - b.start);
    const parts: JSX.Element[] = [];
    let last = 0;

    highlights.forEach((h, i) => {
      if (h.start > last) parts.push(<span key={`t${i}`}>{content.slice(last, h.start)}</span>);
      const active = activeCommentId === h.id;
      parts.push(
        <span
          key={`h${i}`}
          className="cursor-pointer border-b-2 border-dashed transition-colors duration-100"
          style={{
            borderColor: active ? h.color : '#D9730D',
            backgroundColor: active ? 'rgba(251, 236, 221, 0.5)' : 'rgba(251, 236, 221, 0.3)',
          }}
          onClick={(e) => {
            e.stopPropagation();
            setActiveCommentId(active ? null : h.id);
          }}
        >
          {content.slice(h.start, h.end)}
        </span>
      );
      last = h.end;
    });
    if (last < content.length) parts.push(<span key="end">{content.slice(last)}</span>);
    return <>{parts}</>;
  }

  function renderParagraph(p: { id: number; type: string; content: string; level?: number }) {
    if (p.type === 'heading') {
      const level = p.level || 1;
      if (level === 1) {
        return <div className="text-[28px] font-bold text-notion-fg mt-10 mb-1 leading-tight">{renderText(p.content, p.id)}</div>;
      }
      if (level === 2) {
        return <div className="text-[22px] font-semibold text-notion-fg mt-8 mb-1 leading-tight">{renderText(p.content, p.id)}</div>;
      }
      return <div className="text-[18px] font-semibold text-notion-fg mt-6 mb-1 leading-tight">{renderText(p.content, p.id)}</div>;
    }
    if (p.type === 'list') {
      return (
        <div className="flex items-baseline gap-2 pl-1.5">
          <span className="text-notion-fg-muted text-xs select-none">•</span>
          <span className="text-notion-fg leading-[1.7]">{renderText(p.content, p.id)}</span>
        </div>
      );
    }
    return <div className="text-notion-fg leading-[1.7]">{renderText(p.content, p.id)}</div>;
  }

  const reviewerTagColor: Record<string, string> = {
    operation: 'bg-[#DBEDDB]',
    brand: 'bg-[#E8DEEE]',
    tech: 'bg-[#D3E5EF]',
    product: 'bg-[#FADEC9]',
    ux: 'bg-[#FFE2DD]',
    bi: 'bg-[#D3E5EF]',
  };

  const severityLabel: Record<string, { text: string; color: string; bg: string }> = {
    high: { text: '高优', color: '#EB5757', bg: '#FBE4E4' },
    medium: { text: '中', color: '#D9730D', bg: '#FADEC9' },
    low: { text: '低', color: '#0F7B6C', bg: '#DBEDDB' },
  };

  function scrollToParagraph(paragraphId: number) {
    const el = window.document.getElementById(`p-${paragraphId}`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      el.style.backgroundColor = 'rgba(251, 236, 221, 0.4)';
      setTimeout(() => { el.style.backgroundColor = ''; }, 1500);
    }
  }

  return (
    <div className="h-screen flex flex-col bg-white">
      {/* Top bar */}
      <div className="h-11 flex items-center px-3 border-b border-notion-border shrink-0 bg-white z-20">
        <button
          onClick={() => { reset(); router.push('/'); }}
          className="btn-notion text-notion-fg-secondary text-[13px]"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          返回
        </button>
        <div className="h-5 w-px bg-notion-border mx-1" />
        <span className="text-[13px] text-notion-fg-secondary truncate max-w-sm px-2">
          {document.title}
        </span>
        <div className="flex-1" />
        <span className="text-xs text-notion-fg-muted">
          {totalComments} 条评论
        </span>
      </div>

      {/* Main layout: left document + right comments */}
      <div className="flex flex-1 overflow-hidden">

        {/* Left: Document */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-[680px] mx-auto px-12 py-10">
            {document.paragraphs.map(p => (
              <div key={p.id} id={`p-${p.id}`} className="py-[2px] transition-colors duration-300">
                {renderParagraph(p)}
              </div>
            ))}
          </div>
        </div>

        {/* Right panel: Comments */}
        <div className="w-[380px] shrink-0 border-l border-notion-border flex flex-col bg-[#FBFBFA]">
          {/* Filter */}
          <div className="px-4 py-3 border-b border-notion-border">
            <div className="text-xs text-notion-fg-muted mb-2">筛选评委</div>
            <div className="flex flex-wrap gap-1">
              {REVIEWERS.map(reviewer => {
                const isSelected = selectedReviewers.includes(reviewer.id);
                const count = reviewResult.reviews.find(r => r.reviewerId === reviewer.id)?.comments.length || 0;
                return (
                  <button
                    key={reviewer.id}
                    onClick={() => toggleReviewer(reviewer.id)}
                    className={`tag gap-1 cursor-pointer transition-opacity ${
                      isSelected
                        ? `${reviewerTagColor[reviewer.id]} opacity-100`
                        : 'bg-notion-bg-hover text-notion-fg-secondary opacity-50 hover:opacity-100'
                    }`}
                  >
                    <ReviewerAvatar reviewerId={reviewer.id} size={13} />
                    {reviewer.name.split('·')[0].trim()}
                    {count > 0 && <span className="text-[10px] opacity-50">{count}</span>}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Comment list */}
          <div className="flex-1 overflow-y-auto px-3 py-2">
            {allComments.length === 0 ? (
              <div className="text-sm text-notion-fg-muted text-center mt-12">暂无评论</div>
            ) : (
              allComments.map(comment => {
                const isActive = activeCommentId === comment.id;
                const sev = severityLabel[comment.severity];

                return (
                  <div
                    key={comment.id}
                    className={`mb-1 p-3 rounded-md cursor-pointer transition-colors duration-100 ${
                      isActive
                        ? 'bg-white border border-notion-border'
                        : 'hover:bg-notion-bg-hover border border-transparent'
                    }`}
                    onClick={() => {
                      setActiveCommentId(isActive ? null : comment.id);
                      scrollToParagraph(comment.paragraphId);
                    }}
                  >
                    {/* Header */}
                    <div className="flex items-center gap-1.5 mb-1.5">
                      <ReviewerAvatar reviewerId={comment.reviewerId} size={18} />
                      <span className="text-[13px] font-medium text-notion-fg">
                        {comment.reviewerName.split('·')[0].trim()}
                      </span>
                      <span className="text-[11px] text-notion-fg-muted">
                        {comment.reviewerName.split('·')[1]?.trim()}
                      </span>
                      <div className="flex-1" />
                      <span
                        className="tag text-[10px]"
                        style={{ backgroundColor: sev.bg, color: sev.color }}
                      >
                        {sev.text}
                      </span>
                    </div>

                    {/* Quoted text */}
                    {comment.quotedText && (
                      <div
                        className="text-[12px] text-notion-fg-muted mb-1.5 pl-2 border-l-2 leading-relaxed"
                        style={{ borderColor: '#D9730D' }}
                      >
                        &ldquo;{comment.quotedText}&rdquo;
                      </div>
                    )}

                    {/* Content */}
                    <p className="text-[13px] text-notion-fg-secondary leading-relaxed">
                      {comment.content}
                    </p>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
