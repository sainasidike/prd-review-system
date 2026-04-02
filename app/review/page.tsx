'use client';

import { useEffect, useMemo, useState, useCallback } from 'react';
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
  const [hoveredParagraph, setHoveredParagraph] = useState<number | null>(null);

  useEffect(() => {
    if (!document || !reviewResult) {
      router.push('/');
    }
  }, [document, reviewResult, router]);

  const filteredReviews = selectedReviewers.length > 0
    ? (reviewResult?.reviews.filter(r => selectedReviewers.includes(r.reviewerId)) ?? [])
    : (reviewResult?.reviews ?? []);

  const commentsByParagraph = useMemo(() => {
    const map = new Map<number, EnrichedComment[]>();
    filteredReviews.forEach(review => {
      review.comments.forEach(comment => {
        if (!map.has(comment.paragraphId)) {
          map.set(comment.paragraphId, []);
        }
        map.get(comment.paragraphId)!.push({
          ...comment,
          reviewerId: review.reviewerId,
          reviewerName: review.reviewerName,
          color: review.color,
        });
      });
    });
    return map;
  }, [filteredReviews]);

  if (!document || !reviewResult) return null;

  const totalComments = filteredReviews.reduce((sum, r) => sum + r.comments.length, 0);

  // Notion-style text highlighting
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
          onClick={(e) => { e.stopPropagation(); setActiveCommentId(active ? null : h.id); }}
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
        return <div className="text-[30px] font-bold text-notion-fg mt-10 mb-1 leading-tight">{renderText(p.content, p.id)}</div>;
      }
      if (level === 2) {
        return <div className="text-[24px] font-semibold text-notion-fg mt-8 mb-1 leading-tight">{renderText(p.content, p.id)}</div>;
      }
      return <div className="text-[20px] font-semibold text-notion-fg mt-6 mb-1 leading-tight">{renderText(p.content, p.id)}</div>;
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

  // Notion reviewer color mapping
  const reviewerTagColor: Record<string, string> = {
    operation: 'bg-[#DBEDDB]',
    brand: 'bg-[#E8DEEE]',
    tech: 'bg-[#D3E5EF]',
    product: 'bg-[#FADEC9]',
    ux: 'bg-[#FFE2DD]',
    bi: 'bg-[#D3E5EF]',
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Top bar */}
      <div className="h-11 flex items-center px-3 border-b border-notion-border sticky top-0 bg-white/95 backdrop-blur-sm z-20">
        <button
          onClick={() => { reset(); router.push('/'); }}
          className="btn-notion text-notion-fg-secondary text-[13px]"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          返回
        </button>

        <div className="h-5 w-px bg-notion-border mx-1" />

        <span className="text-[13px] text-notion-fg-secondary truncate max-w-xs px-2">
          {document.title}
        </span>

        <div className="flex-1" />

        <span className="text-xs text-notion-fg-muted mr-3">
          {totalComments} 条评论
        </span>
      </div>

      {/* Filter bar */}
      <div className="border-b border-notion-border sticky top-11 bg-white/95 backdrop-blur-sm z-10">
        <div className="max-w-[960px] mx-auto px-6 h-10 flex items-center gap-1">
          <span className="text-xs text-notion-fg-muted mr-2">筛选</span>
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
                    : 'bg-notion-bg-hover text-notion-fg-secondary opacity-60 hover:opacity-100'
                }`}
              >
                <ReviewerAvatar reviewerId={reviewer.id} size={13} />
                {reviewer.name.split('·')[0].trim()}
                {count > 0 && <span className="text-[10px] opacity-60">{count}</span>}
              </button>
            );
          })}
        </div>
      </div>

      {/* Document content */}
      <div className="max-w-[960px] mx-auto px-6 py-8">
        {document.paragraphs.map(p => {
          const comments = commentsByParagraph.get(p.id);
          const hasComments = comments && comments.length > 0;
          const commentCount = comments?.length || 0;
          const isHovered = hoveredParagraph === p.id;
          const hasActiveComment = comments?.some(c => c.id === activeCommentId);

          return (
            <div
              key={p.id}
              className="relative group flex"
              id={`p-${p.id}`}
              onMouseEnter={() => setHoveredParagraph(p.id)}
              onMouseLeave={() => setHoveredParagraph(null)}
            >
              {/* Document text */}
              <div className="flex-1 max-w-[680px] py-[3px]">
                {renderParagraph(p)}
              </div>

              {/* Comment cards - shown when paragraph hovered or comment active */}
              {hasComments && (
                <div className={`w-[260px] shrink-0 pl-8 transition-opacity duration-150 ${
                  isHovered || hasActiveComment ? 'opacity-100' : 'opacity-0'
                }`}>
                  {comments.map(comment => {
                    const isActive = activeCommentId === comment.id;
                    return (
                      <div
                        key={comment.id}
                        className={`mb-2 rounded-md border p-3 cursor-pointer transition-all duration-100 ${
                          isActive
                            ? 'border-notion-border bg-white shadow-sm'
                            : 'border-transparent bg-notion-bg-hover hover:border-notion-border'
                        }`}
                        onClick={() => setActiveCommentId(isActive ? null : comment.id)}
                      >
                        <div className="flex items-center gap-1.5 mb-1.5">
                          <ReviewerAvatar reviewerId={comment.reviewerId} size={18} />
                          <span className="text-[13px] font-medium text-notion-fg">
                            {comment.reviewerName.split('·')[0].trim()}
                          </span>
                          <span className="text-[11px] text-notion-fg-muted">刚刚</span>
                        </div>
                        <p className="text-[13px] text-notion-fg-secondary leading-relaxed">
                          {comment.content}
                        </p>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Comment count indicator - always visible when has comments */}
              {hasComments && !isHovered && !hasActiveComment && (
                <div className="absolute right-0 top-1 flex items-center gap-1 text-notion-orange">
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  <span className="text-xs font-medium">{commentCount}</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
