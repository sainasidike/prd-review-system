'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useReviewStore } from '@/stores/reviewStore';
import { REVIEWERS } from '@/lib/constants';
import ReviewerAvatar from '@/components/ReviewerAvatar';
import InlineComment from '@/components/InlineComment';
import { ReviewComment } from '@/lib/types';

interface ParagraphComments {
  paragraphId: number;
  comments: (ReviewComment & { reviewerId: string; reviewerName: string; color: string })[];
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

  // Filter reviews and flatten comments by paragraph
  const filteredReviews = selectedReviewers.length > 0
    ? (reviewResult?.reviews.filter(r => selectedReviewers.includes(r.reviewerId)) ?? [])
    : (reviewResult?.reviews ?? []);

  // Group comments by paragraph
  const commentsByParagraph = useMemo(() => {
    const map = new Map<number, ParagraphComments>();
    filteredReviews.forEach(review => {
      review.comments.forEach(comment => {
        if (!map.has(comment.paragraphId)) {
          map.set(comment.paragraphId, { paragraphId: comment.paragraphId, comments: [] });
        }
        map.get(comment.paragraphId)!.comments.push({
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
  const highCount = filteredReviews.reduce(
    (sum, r) => sum + r.comments.filter(c => c.severity === 'high').length, 0
  );

  // Highlight quoted text within paragraph content
  function renderHighlightedText(content: string, paragraphId: number) {
    const pComments = commentsByParagraph.get(paragraphId);
    if (!pComments || pComments.comments.length === 0) {
      return <>{content}</>;
    }

    // Find all quoted texts and their positions
    type Highlight = { start: number; end: number; commentId: string; color: string };
    const highlights: Highlight[] = [];

    pComments.comments.forEach(c => {
      const idx = content.indexOf(c.quotedText);
      if (idx !== -1) {
        highlights.push({
          start: idx,
          end: idx + c.quotedText.length,
          commentId: c.id,
          color: c.color,
        });
      }
    });

    if (highlights.length === 0) return <>{content}</>;

    // Sort by start position
    highlights.sort((a, b) => a.start - b.start);

    // Build segments
    const segments: JSX.Element[] = [];
    let lastEnd = 0;

    highlights.forEach((h, i) => {
      // Non-highlighted text before this highlight
      if (h.start > lastEnd) {
        segments.push(<span key={`t-${i}`}>{content.slice(lastEnd, h.start)}</span>);
      }
      // Highlighted text
      const isActive = activeCommentId === h.commentId;
      segments.push(
        <mark
          key={`h-${i}`}
          className={`cursor-pointer rounded-sm transition-colors duration-200 ${
            isActive ? 'bg-amber-200' : 'bg-amber-100 hover:bg-amber-200'
          }`}
          style={{ borderBottom: `2px solid ${h.color}` }}
          onClick={() => setActiveCommentId(isActive ? null : h.commentId)}
        >
          {content.slice(h.start, h.end)}
        </mark>
      );
      lastEnd = h.end;
    });

    // Remaining text
    if (lastEnd < content.length) {
      segments.push(<span key="tail">{content.slice(lastEnd)}</span>);
    }

    return <>{segments}</>;
  }

  function renderParagraph(p: { id: number; type: string; content: string; level?: number }) {
    const hasComments = commentsByParagraph.has(p.id);

    if (p.type === 'heading') {
      const level = p.level || 1;
      const styles: Record<number, string> = {
        1: 'text-xl font-bold text-gray-900 mt-8 mb-2',
        2: 'text-lg font-semibold text-gray-800 mt-7 mb-2',
        3: 'text-[15px] font-semibold text-gray-700 mt-5 mb-1.5',
      };
      return (
        <div className={styles[level] || styles[3]}>
          {renderHighlightedText(p.content, p.id)}
        </div>
      );
    }

    if (p.type === 'list') {
      return (
        <div className="flex items-start gap-2 ml-4 mb-0.5">
          <span className="text-gray-300 mt-[10px] shrink-0 text-[6px]">●</span>
          <span className="text-gray-600 leading-7 text-[14px]">
            {renderHighlightedText(p.content, p.id)}
          </span>
        </div>
      );
    }

    return (
      <div className="text-gray-600 leading-7 text-[14px] mb-1">
        {renderHighlightedText(p.content, p.id)}
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-[#F7F8FA]">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 px-5 shrink-0">
        <div className="h-12 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => { reset(); router.push('/'); }}
              className="flex items-center gap-1 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
              <span className="text-xs">返回</span>
            </button>
            <div className="h-4 w-px bg-gray-200" />
            <span className="font-medium text-gray-800 text-sm truncate max-w-md">{document.title}</span>
          </div>
          <div className="flex items-center gap-4 text-xs text-gray-400">
            <span>{totalComments} 条评论</span>
            {highCount > 0 && <span className="text-red-500 font-medium">{highCount} 个高优</span>}
          </div>
        </div>

        {/* Reviewer filter */}
        <div className="h-10 flex items-center gap-1.5 border-t border-gray-50 -mx-1">
          {REVIEWERS.map(reviewer => {
            const isSelected = selectedReviewers.includes(reviewer.id);
            const count = reviewResult.reviews.find(r => r.reviewerId === reviewer.id)?.comments.length || 0;
            return (
              <button
                key={reviewer.id}
                onClick={() => toggleReviewer(reviewer.id)}
                className={`flex items-center gap-1.5 px-2 py-1 rounded-md text-xs transition-all ${
                  isSelected
                    ? 'bg-white border shadow-sm font-medium'
                    : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'
                }`}
                style={isSelected ? {
                  borderColor: `${reviewer.color}30`,
                  color: reviewer.color,
                  backgroundColor: `${reviewer.color}08`,
                } : {}}
              >
                <ReviewerAvatar reviewerId={reviewer.id} size={18} />
                <span>{reviewer.name.replace(' Leader', '').replace('团队 ', '')}</span>
                {count > 0 && <span className="text-[10px] text-gray-300">{count}</span>}
              </button>
            );
          })}
        </div>
      </header>

      {/* Document with inline comments */}
      <div className="flex-1 overflow-auto scroll-y bg-white">
        <div className="max-w-5xl mx-auto px-8 py-8">
          {document.paragraphs.map(p => {
            const pComments = commentsByParagraph.get(p.id);
            const hasComments = pComments && pComments.comments.length > 0;

            return (
              <div key={p.id} className="flex gap-6 group" id={`row-${p.id}`}>
                {/* Document content */}
                <div className="flex-1 min-w-0">
                  {renderParagraph(p)}
                </div>

                {/* Comment rail */}
                <div className="w-[300px] shrink-0">
                  {hasComments && (
                    <div className="space-y-2 animate-slide-up">
                      {pComments.comments.map(comment => (
                        <InlineComment
                          key={comment.id}
                          comment={comment}
                          reviewerId={comment.reviewerId}
                          reviewerName={comment.reviewerName}
                          color={comment.color}
                          isActive={activeCommentId === comment.id}
                          onToggle={() => setActiveCommentId(
                            activeCommentId === comment.id ? null : comment.id
                          )}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
