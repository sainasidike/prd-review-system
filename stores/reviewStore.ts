import { create } from 'zustand';
import { PRDDocument, ReviewResult, ReviewProgress } from '@/lib/types';

interface ReviewState {
  // Current document
  document: PRDDocument | null;
  setDocument: (doc: PRDDocument | null) => void;

  // Review result
  reviewResult: ReviewResult | null;
  setReviewResult: (result: ReviewResult | null) => void;

  // Review progress
  reviewProgress: ReviewProgress | null;
  setReviewProgress: (progress: ReviewProgress | null) => void;

  // UI state
  selectedReviewers: string[];
  toggleReviewer: (reviewerId: string) => void;
  highlightedParagraphId: number | null;
  setHighlightedParagraphId: (id: number | null) => void;

  // Reset all state
  reset: () => void;
}

export const useReviewStore = create<ReviewState>((set) => ({
  document: null,
  setDocument: (doc) => set({ document: doc }),

  reviewResult: null,
  setReviewResult: (result) => set({ reviewResult: result }),

  reviewProgress: null,
  setReviewProgress: (progress) => set({ reviewProgress: progress }),

  selectedReviewers: [],
  toggleReviewer: (reviewerId) =>
    set((state) => {
      const isSelected = state.selectedReviewers.includes(reviewerId);
      return {
        selectedReviewers: isSelected
          ? state.selectedReviewers.filter((id) => id !== reviewerId)
          : [...state.selectedReviewers, reviewerId],
      };
    }),

  highlightedParagraphId: null,
  setHighlightedParagraphId: (id) => set({ highlightedParagraphId: id }),

  reset: () =>
    set({
      document: null,
      reviewResult: null,
      reviewProgress: null,
      selectedReviewers: [],
      highlightedParagraphId: null,
    }),
}));
