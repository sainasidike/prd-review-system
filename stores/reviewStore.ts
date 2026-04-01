import { create } from 'zustand';
import { PRDDocument, ReviewResult } from '@/lib/types';

interface ReviewState {
  // Current document
  document: PRDDocument | null;
  setDocument: (doc: PRDDocument | null) => void;

  // Review result
  reviewResult: ReviewResult | null;
  setReviewResult: (result: ReviewResult | null) => void;

  // Review progress
  reviewProgress: { current: number; total: number } | null;
  setReviewProgress: (progress: { current: number; total: number } | null) => void;

  // API Key
  apiKey: string;
  setApiKey: (key: string) => void;

  // UI state
  selectedReviewers: string[];
  toggleReviewer: (reviewerId: string) => void;
  highlightedParagraphId: number | null;
  setHighlightedParagraphId: (id: number | null) => void;

  // Reset
  reset: () => void;
}

export const useReviewStore = create<ReviewState>((set) => ({
  document: null,
  setDocument: (doc) => set({ document: doc }),

  reviewResult: null,
  setReviewResult: (result) => set({ reviewResult: result }),

  reviewProgress: null,
  setReviewProgress: (progress) => set({ reviewProgress: progress }),

  apiKey: '',
  setApiKey: (key) => set({ apiKey: key }),

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
