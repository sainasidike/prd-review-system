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
  const highCount = filteredReviews.reduce(
    (sum, r) => sum + r.comments.filter(c => c.severity === 'high').length, 0
  );

  // Highlight quoted text in paragraph
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
        <mark
          key={`h${i}`}
          className={`cursor-pointer rounded-sm px-0.5 transition-all duration-150 ${
            active ? 'bg-amber-200' : 'bg-amber-100/70 hover:bg-amber-200'
          }`}
          onClick={() => setActiveCommentId(active ? null : h.id)}
        >
          {content.slice(h.start, h.end)}
        </mark>
      );
      last = h.end;
    });
    if (last < content.length) parts.push(<span key="end">{content.slice(last)}</span>);
    return <>{parts}</>;
  }

  function renderParagraphContent(p: { id: number; type: string; content: string; level?: number }) {
    if (p.type === 'heading') {
      const level = p.level || 1;
      const cls: Record<number, string> = {
        1: 'text-xl font-bold text-gray-900 mt-8 mb-2',
        2: 'text-lg font-semibold text-gray-800 mt-7 mb-2',
        3: 'text-[15px] font-semibold text-gray-700 mt-5 mb-1.5',
      };
      return <div className={cls[level] || cls[3]}>{renderText(p.content, p.id)}</div>;
    }
    if (p.type === 'list') {
      return (
        <div className="flex items-start gap-2 ml-4 mb-0.5">
          <span className="text-gray-300 mt-[10px] shrink-0 text-[6px]">●</span>
          <span className="text-gray-600 leading-7 text-[14px]">{renderText(p.content, p.id)}</span>
        </div>
      );
    }
    return <div className="text-gray-600 leading-7 text-[14px] mb-1">{renderText(p.content, p.id)}</div>;
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
        <div className="h-10 flex items-center gap-1.5 border-t border-gray-50">
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
                <span>{reviewer.name.replace(' Leader', '').replace('· ', '')}</span>
                {count > 0 && <span className="text-[10px] text-gray-300">{count}</span>}
              </button>
            );
          })}
        </div>
      </header>

      {/* Main content */}
      <div className="flex-1 overflow-auto">
        <div className="max-w-6xl mx-auto py-8 px-6">
          {document.paragraphs.map(p => {
            const comments = commentsByParagraph.get(p.id);
            const hasComments = comments && comments.length > 0;

            return (
              <div key={p.id} className="relative flex" id={`p-${p.id}`}>
                {/* Left: Document content */}
                <div className="flex-1 max-w-[680px]">
                  {renderParagraphContent(p)}
                </div>

                {/* Right: Comments aligned with paragraph */}
                {hasComments && (
                  <div className="w-[300px] shrink-0 pl-8 pt-1">
                    {comments.map(comment => {
                      const isActive = activeCommentId === comment.id;

                      return (
                        <div
                          key={comment.id}
                          className={`mb-3 rounded-lg border p-3 cursor-pointer transition-all duration-200 ${
                            isActive
                              ? 'bg-white border-gray-200 shadow-md'
                              : 'bg-white border-gray-100 hover:border-gray-200 hover:shadow-sm'
                          }`}
                          onClick={() => setActiveCommentId(isActive ? null : comment.id)}
                        >
                          {/* Header: avatar + name + time */}
                          <div className="flex items-center gap-2 mb-2">
                            <ReviewerAvatar reviewerId={comment.reviewerId} size={24} />
                            <span className="text-sm font-medium text-gray-800">
                              {comment.reviewerName.split('·')[0].trim()}
                            </span>
                            <span className="text-xs text-gray-300">刚刚</span>
                          </div>

                          {/* Comment body */}
                          <p className="text-[13px] text-gray-600 leading-relaxed">
                            {comment.content}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
