export interface PRDDocument {
  id: string;
  title: string;
  fileName: string;
  content: string;
  paragraphs: Paragraph[];
  createdAt: Date;
}

export interface Paragraph {
  id: number;
  type: 'heading' | 'text' | 'list';
  content: string;
  level?: number;
  startIndex: number;
  endIndex: number;
}

export interface ReviewResult {
  documentId: string;
  reviews: Review[];
  createdAt: Date;
}

export interface Review {
  reviewerId: string;
  reviewerName: string;
  icon: string;
  color: string;
  comments: ReviewComment[];
  timestamp: Date;
}

export interface ReviewComment {
  id: string;
  paragraphId: number;
  quotedText: string;
  type: 'question' | 'suggestion' | 'concern' | 'praise';
  content: string;
  severity: 'high' | 'medium' | 'low';
}

export interface Reviewer {
  id: string;
  name: string;
  icon: string;
  color: string;
  focusAreas: string[];
  description: string;
}
