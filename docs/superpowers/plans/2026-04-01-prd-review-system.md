# PRD 智能评审系统 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build an AI-powered PRD review system with 6 virtual team leaders providing multi-angle feedback on product requirement documents.

**Architecture:** Pure frontend Next.js app with static export, document parsing in browser, direct Claude API calls, dual-pane UI with comment-to-paragraph precise positioning.

**Tech Stack:** Next.js 14, React 18, TypeScript, Tailwind CSS, pdfjs-dist, mammoth, zustand

---

## File Structure

**Create:**
```
app/
├── page.tsx                      # Home page (upload interface)
├── review/[id]/page.tsx         # Review result page
├── layout.tsx                    # Root layout
└── globals.css                   # Global styles

components/
├── DocumentUploader.tsx          # File upload with drag & drop
├── APIKeyInput.tsx              # API Key input and management
├── ReviewProgress.tsx           # Review progress indicator
├── PRDViewer.tsx                # Left pane: PRD content display
├── CommentPanel.tsx             # Right pane: Comments display
├── CommentCard.tsx              # Individual comment card
├── ReviewerFilter.tsx           # Reviewer filter buttons
└── ParagraphHighlight.tsx       # Highlighted paragraph component

lib/
├── types.ts                     # TypeScript interfaces
├── constants.ts                 # Reviewers config & constants
├── parser.ts                    # Document parsing (PDF/Word/MD)
├── segmenter.ts                 # PRD segmentation algorithm
├── reviewer.ts                  # Claude API review engine
├── storage.ts                   # localStorage utilities
└── utils.ts                     # Utility functions (UUID, etc.)

stores/
└── reviewStore.ts               # Zustand state management

public/
└── sample-prd.md                # Sample PRD for testing

__tests__/
├── segmenter.test.ts            # Segmentation algorithm tests
├── parser.test.ts               # Document parsing tests
└── reviewer.test.ts             # Review engine tests

Config Files:
├── package.json                 # Dependencies
├── tsconfig.json                # TypeScript config
├── tailwind.config.ts           # Tailwind CSS config
├── next.config.js               # Next.js config (static export)
└── .gitignore                   # Git ignore
```

---

## Task 1: Project Initialization

**Files:**
- Create: `package.json`
- Create: `tsconfig.json`
- Create: `next.config.js`
- Create: `tailwind.config.ts`
- Create: `.gitignore`

- [ ] **Step 1: Initialize Next.js project**

```bash
npx create-next-app@latest prd-review-system-app --typescript --tailwind --app --no-src-dir
cd prd-review-system-app
```

Expected: Next.js project scaffolded

- [ ] **Step 2: Update package.json dependencies**

```json
{
  "name": "prd-review-system",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "test": "jest"
  },
  "dependencies": {
    "next": "14.1.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "typescript": "^5.3.3",
    "tailwindcss": "^3.4.0",
    "pdfjs-dist": "^4.0.269",
    "mammoth": "^1.6.0",
    "uuid": "^9.0.1",
    "zustand": "^4.5.0"
  },
  "devDependencies": {
    "@types/react": "^18.2.0",
    "@types/react-dom": "^18.2.0",
    "@types/uuid": "^9.0.7",
    "@types/node": "^20.0.0",
    "eslint": "^8.56.0",
    "eslint-config-next": "14.1.0",
    "jest": "^29.7.0",
    "@testing-library/react": "^14.1.2",
    "@testing-library/jest-dom": "^6.1.5",
    "autoprefixer": "^10.4.16",
    "postcss": "^8.4.32"
  }
}
```

- [ ] **Step 3: Install dependencies**

```bash
npm install
```

Expected: All packages installed

- [ ] **Step 4: Configure Next.js for static export**

```javascript
// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true
  }
}

module.exports = nextConfig
```

- [ ] **Step 5: Update .gitignore**

```
# dependencies
/node_modules
/.pnp
.pnp.js

# testing
/coverage

# next.js
/.next/
/out/

# production
/build

# misc
.DS_Store
*.pem

# debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# local env files
.env*.local

# vercel
.vercel

# typescript
*.tsbuildinfo
next-env.d.ts
```

- [ ] **Step 6: Commit initial setup**

```bash
git add .
git commit -m "chore: initialize Next.js project with TypeScript and Tailwind

- Configure static export for Vercel deployment
- Add pdfjs-dist, mammoth for document parsing
- Add zustand for state management

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

## Task 2: TypeScript Types and Constants

**Files:**
- Create: `lib/types.ts`
- Create: `lib/constants.ts`

- [ ] **Step 1: Define TypeScript interfaces**

```typescript
// lib/types.ts
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
  comments: Comment[];
  timestamp: Date;
}

export interface Comment {
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
```

- [ ] **Step 2: Define reviewers configuration**

```typescript
// lib/constants.ts
import { Reviewer } from './types';

export const REVIEWERS: Reviewer[] = [
  {
    id: 'operation',
    name: '运营团队 Leader',
    icon: '🏃',
    color: '#10B981',
    focusAreas: ['用户增长', '市场推广', '运营策略', 'KPI指标'],
    description: '关注产品的市场推广、用户增长路径、运营成本和数据指标'
  },
  {
    id: 'brand',
    name: '品牌团队 Leader',
    icon: '💼',
    color: '#8B5CF6',
    focusAreas: ['品牌定位', '用户体验', '视觉呈现', '品牌调性'],
    description: '关注品牌定位的清晰度、用户感知和品牌一致性'
  },
  {
    id: 'tech',
    name: '技术团队 Leader',
    icon: '💻',
    color: '#3B82F6',
    focusAreas: ['技术可行性', '架构设计', '性能优化', '技术风险'],
    description: '关注技术实现难度、架构合理性、性能指标和技术债务'
  },
  {
    id: 'product',
    name: '产品团队 Leader',
    icon: '📱',
    color: '#F59E0B',
    focusAreas: ['产品逻辑', '功能完整性', '用户价值', '竞品分析'],
    description: '关注功能逻辑、需求完整性、用户价值和市场竞争力'
  },
  {
    id: 'ux',
    name: '交互团队 Leader',
    icon: '🎨',
    color: '#EC4899',
    focusAreas: ['交互设计', '用户流程', '可用性', '体验细节'],
    description: '关注用户流程的流畅性、交互的合理性和体验细节'
  },
  {
    id: 'bi',
    name: 'BI 团队 Leader',
    icon: '📊',
    color: '#06B6D4',
    focusAreas: ['数据埋点', '指标设计', '分析维度', '数据驱动'],
    description: '关注数据埋点方案、关键指标定义和数据分析能力'
  }
];

export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
export const SUPPORTED_FORMATS = ['.pdf', '.doc', '.docx', '.md', '.txt'];
export const MAX_PARAGRAPHS = 200;
```

- [ ] **Step 3: Add utility functions**

```typescript
// lib/utils.ts
import { v4 as uuidv4 } from 'uuid';

export function generateUUID(): string {
  return uuidv4();
}

export function extractTitle(content: string): string {
  const lines = content.split('\n');
  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.startsWith('# ')) {
      return trimmed.substring(2);
    }
    if (trimmed.length > 0 && trimmed.length < 100) {
      return trimmed;
    }
  }
  return '未命名文档';
}

export function formatTimestamp(date: Date): string {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const minutes = Math.floor(diff / 60000);
  
  if (minutes < 1) return '刚刚';
  if (minutes < 60) return `${minutes} 分钟前`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} 小时前`;
  return date.toLocaleDateString('zh-CN');
}
```

- [ ] **Step 4: Commit types and constants**

```bash
git add lib/types.ts lib/constants.ts lib/utils.ts
git commit -m "feat: add TypeScript types, reviewers config, and utilities

- Define PRD document, review, and comment interfaces
- Configure 6 reviewer roles with focus areas
- Add UUID generation and timestamp formatting

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

## Task 3: Document Segmentation Algorithm (TDD)

**Files:**
- Create: `lib/segmenter.ts`
- Create: `__tests__/segmenter.test.ts`

- [ ] **Step 1: Write failing test for segmentation**

```typescript
// __tests__/segmenter.test.ts
import { segmentPRD } from '../lib/segmenter';

describe('segmentPRD', () => {
  it('should segment markdown with headings', () => {
    const content = `# 产品背景
本产品旨在解决用户痛点。

## 目标用户
目标用户为 25-35 岁的职场人士。`;

    const paragraphs = segmentPRD(content);

    expect(paragraphs).toHaveLength(3);
    expect(paragraphs[0].type).toBe('heading');
    expect(paragraphs[0].level).toBe(1);
    expect(paragraphs[0].content).toBe('产品背景');
  });

  it('should identify list items', () => {
    const content = `- 功能 A
- 功能 B`;

    const paragraphs = segmentPRD(content);

    expect(paragraphs).toHaveLength(2);
    expect(paragraphs[0].type).toBe('list');
    expect(paragraphs[0].content).toBe('功能 A');
  });

  it('should skip empty lines', () => {
    const content = `段落1


段落2`;

    const paragraphs = segmentPRD(content);

    expect(paragraphs).toHaveLength(2);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npm run test -- segmenter.test.ts
```

Expected: FAIL with "Cannot find module '../lib/segmenter'"

- [ ] **Step 3: Implement segmentation algorithm**

```typescript
// lib/segmenter.ts
import { Paragraph } from './types';
import { MAX_PARAGRAPHS } from './constants';

export function segmentPRD(content: string): Paragraph[] {
  const paragraphs: Paragraph[] = [];
  let id = 1;
  let currentIndex = 0;
  
  const lines = content.split('\n');
  
  for (const line of lines) {
    // Stop if max paragraphs reached
    if (paragraphs.length >= MAX_PARAGRAPHS) {
      break;
    }
    
    const trimmed = line.trim();
    if (!trimmed) {
      currentIndex += line.length + 1;
      continue;
    }
    
    // Identify Markdown heading
    const headingMatch = trimmed.match(/^(#{1,6})\s+(.+)$/);
    if (headingMatch) {
      paragraphs.push({
        id: id++,
        type: 'heading',
        level: headingMatch[1].length,
        content: headingMatch[2],
        startIndex: currentIndex,
        endIndex: currentIndex + line.length
      });
    } 
    // Identify list item
    else if (trimmed.match(/^[-*]\s+.+$/)) {
      paragraphs.push({
        id: id++,
        type: 'list',
        content: trimmed.replace(/^[-*]\s+/, ''),
        startIndex: currentIndex,
        endIndex: currentIndex + line.length
      });
    }
    // Regular paragraph
    else {
      paragraphs.push({
        id: id++,
        type: 'text',
        content: trimmed,
        startIndex: currentIndex,
        endIndex: currentIndex + line.length
      });
    }
    
    currentIndex += line.length + 1;
  }
  
  return paragraphs;
}
```

- [ ] **Step 4: Run test to verify it passes**

```bash
npm run test -- segmenter.test.ts
```

Expected: PASS (3 tests)

- [ ] **Step 5: Commit segmentation algorithm**

```bash
git add lib/segmenter.ts __tests__/segmenter.test.ts
git commit -m "feat: implement PRD segmentation algorithm with tests

- Parse Markdown headings (# to ######)
- Identify list items (- and *)
- Skip empty lines and limit to 200 paragraphs
- Add comprehensive unit tests

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

## Task 4: Document Parser (PDF/Word/Markdown)

**Files:**
- Create: `lib/parser.ts`
- Create: `__tests__/parser.test.ts`

- [ ] **Step 1: Write test for Markdown parsing**

```typescript
// __tests__/parser.test.ts
import { parseMarkdown, parseText } from '../lib/parser';

describe('parseMarkdown', () => {
  it('should extract text from markdown file', async () => {
    const mockFile = new File(['# Title\n\nContent'], 'test.md', { type: 'text/markdown' });
    const content = await parseMarkdown(mockFile);
    
    expect(content).toContain('# Title');
    expect(content).toContain('Content');
  });
});

describe('parseText', () => {
  it('should extract text from txt file', async () => {
    const mockFile = new File(['Plain text content'], 'test.txt', { type: 'text/plain' });
    const content = await parseText(mockFile);
    
    expect(content).toBe('Plain text content');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npm run test -- parser.test.ts
```

Expected: FAIL with "Cannot find module '../lib/parser'"

- [ ] **Step 3: Implement basic parsers (Markdown/Text)**

```typescript
// lib/parser.ts
import * as pdfjsLib from 'pdfjs-dist';
import mammoth from 'mammoth';
import { PRDDocument } from './types';
import { generateUUID, extractTitle } from './utils';
import { segmentPRD } from './segmenter';

export async function parseDocument(file: File): Promise<PRDDocument> {
  const ext = file.name.split('.').pop()?.toLowerCase();
  
  let content: string;
  
  switch (ext) {
    case 'pdf':
      content = await parsePDF(file);
      break;
    case 'doc':
    case 'docx':
      content = await parseWord(file);
      break;
    case 'md':
      content = await parseMarkdown(file);
      break;
    case 'txt':
      content = await parseText(file);
      break;
    default:
      throw new Error(`不支持的文件格式: ${ext}`);
  }
  
  const paragraphs = segmentPRD(content);
  
  return {
    id: generateUUID(),
    title: extractTitle(content),
    fileName: file.name,
    content,
    paragraphs,
    createdAt: new Date()
  };
}

export async function parseMarkdown(file: File): Promise<string> {
  return await file.text();
}

export async function parseText(file: File): Promise<string> {
  return await file.text();
}

export async function parsePDF(file: File): Promise<string> {
  // Set worker source
  pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;
  
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  let fullText = '';
  
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const textContent = await page.getTextContent();
    const pageText = textContent.items
      .map((item: any) => item.str)
      .join(' ');
    fullText += pageText + '\n';
  }
  
  return fullText.trim();
}

export async function parseWord(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const result = await mammoth.extractRawText({ arrayBuffer });
  return result.value.trim();
}
```

- [ ] **Step 4: Run test to verify it passes**

```bash
npm run test -- parser.test.ts
```

Expected: PASS (2 tests)

- [ ] **Step 5: Commit document parser**

```bash
git add lib/parser.ts __tests__/parser.test.ts
git commit -m "feat: implement document parsers for PDF/Word/Markdown/Text

- Add PDF parsing with pdfjs-dist
- Add Word parsing with mammoth
- Add Markdown and plain text parsing
- Integrate with segmentation algorithm

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

## Task 5: Claude API Review Engine (TDD)

**Files:**
- Create: `lib/reviewer.ts`
- Create: `__tests__/reviewer.test.ts`

- [ ] **Step 1: Write test for prompt generation**

```typescript
// __tests__/reviewer.test.ts
import { generateReviewPrompt } from '../lib/reviewer';
import { REVIEWERS } from '../lib/constants';
import { PRDDocument } from '../lib/types';

describe('generateReviewPrompt', () => {
  it('should generate prompt with reviewer role and PRD content', () => {
    const mockPRD: PRDDocument = {
      id: '1',
      title: 'Test PRD',
      fileName: 'test.md',
      content: 'Full content',
      paragraphs: [
        { id: 1, type: 'heading', content: '产品背景', startIndex: 0, endIndex: 10 },
        { id: 2, type: 'text', content: '这是背景描述', startIndex: 11, endIndex: 25 }
      ],
      createdAt: new Date()
    };
    
    const prompt = generateReviewPrompt(REVIEWERS[0], mockPRD);
    
    expect(prompt).toContain(REVIEWERS[0].name);
    expect(prompt).toContain('用户增长');
    expect(prompt).toContain('[段落1] 产品背景');
    expect(prompt).toContain('[段落2] 这是背景描述');
    expect(prompt).toContain('paragraphId');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npm run test -- reviewer.test.ts
```

Expected: FAIL with "Cannot find module '../lib/reviewer'"

- [ ] **Step 3: Implement prompt generation**

```typescript
// lib/reviewer.ts
import { PRDDocument, Review, ReviewResult, Reviewer, Comment } from './types';
import { REVIEWERS } from './constants';
import { generateUUID } from './utils';

export function generateReviewPrompt(reviewer: Reviewer, prd: PRDDocument): string {
  return `你是一位资深的${reviewer.name}，负责评审产品需求文档（PRD）。

## 你的角色
- 职位：${reviewer.name}
- 关注领域：${reviewer.focusAreas.join('、')}
- 职责：${reviewer.description}

## 评审任务
仔细阅读以下 PRD，从你的专业角度找出**问题、遗漏和改进建议**。

## PRD 内容（已分段标号）
${prd.paragraphs.map(p => `[段落${p.id}] ${p.content}`).join('\n\n')}

## 输出要求
**必须**返回有效的 JSON 格式，结构如下：

\`\`\`json
{
  "comments": [
    {
      "paragraphId": 2,
      "quotedText": "用户留存率低",
      "type": "question",
      "content": "缺少竞品对比数据，建议补充行业平均留存率作为参考基准",
      "severity": "high"
    }
  ]
}
\`\`\`

## 字段说明
- **paragraphId**: 段落编号（整数）
- **quotedText**: 引用的原文片段（5-15字，精确引用）
- **type**: 评论类型 (question | suggestion | concern | praise)
- **content**: 评论内容（50-150字，具体、可执行）
- **severity**: 重要程度 (high | medium | low)

## 评审原则
1. **精准定位**：quotedText 必须是段落中的原文（逐字匹配）
2. **具体可执行**：给出明确的改进方向，而非空泛的建议
3. **聚焦专业**：从你的角色视角出发，不要越界
4. **控制数量**：每个段落最多 2-3 条评论，总数 10-20 条
5. **优先级清晰**：高优先级问题必须是影响产品成败的关键点

现在开始评审，直接返回 JSON，不要其他解释。`;
}

export async function reviewPRD(
  prd: PRDDocument,
  apiKey: string,
  onProgress: (current: number, total: number) => void
): Promise<ReviewResult> {
  const reviews: Review[] = [];
  
  for (let i = 0; i < REVIEWERS.length; i++) {
    const reviewer = REVIEWERS[i];
    
    try {
      const prompt = generateReviewPrompt(reviewer, prd);
      
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01',
          'content-type': 'application/json'
        },
        body: JSON.stringify({
          model: 'claude-3-5-sonnet-20241022',
          max_tokens: 2000,
          messages: [{ role: 'user', content: prompt }]
        })
      });
      
      if (!response.ok) {
        const error = await response.text();
        throw new Error(`Claude API error ${response.status}: ${error}`);
      }
      
      const data = await response.json();
      const content = data.content[0].text;
      
      // Extract JSON from response
      const jsonMatch = content.match(/```json\n([\s\S]*?)\n```/) ||
                        content.match(/```\n([\s\S]*?)\n```/) ||
                        [null, content];
      
      const parsed = JSON.parse(jsonMatch[1] || content);
      
      // Add UUID to each comment
      const comments: Comment[] = parsed.comments.map((c: any) => ({
        ...c,
        id: generateUUID()
      }));
      
      reviews.push({
        reviewerId: reviewer.id,
        reviewerName: reviewer.name,
        icon: reviewer.icon,
        color: reviewer.color,
        comments,
        timestamp: new Date()
      });
      
      onProgress(i + 1, REVIEWERS.length);
      
    } catch (error) {
      console.error(`评委 ${reviewer.name} 评审失败:`, error);
      // Continue with other reviewers
    }
  }
  
  return {
    documentId: prd.id,
    reviews,
    createdAt: new Date()
  };
}
```

- [ ] **Step 4: Run test to verify it passes**

```bash
npm run test -- reviewer.test.ts
```

Expected: PASS (1 test)

- [ ] **Step 5: Commit review engine**

```bash
git add lib/reviewer.ts __tests__/reviewer.test.ts
git commit -m "feat: implement Claude API review engine

- Generate role-specific prompts for 6 reviewers
- Call Claude API with structured JSON output
- Extract and parse comments from API response
- Add error handling for failed reviews

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

## Task 6: localStorage Utilities

**Files:**
- Create: `lib/storage.ts`

- [ ] **Step 1: Implement API Key storage**

```typescript
// lib/storage.ts
const API_KEY_STORAGE_KEY = 'prd_review_api_key';
const REMEMBER_KEY_STORAGE_KEY = 'prd_review_remember_key';

export function saveAPIKey(apiKey: string, remember: boolean): void {
  if (remember) {
    localStorage.setItem(API_KEY_STORAGE_KEY, apiKey);
    localStorage.setItem(REMEMBER_KEY_STORAGE_KEY, 'true');
  } else {
    localStorage.removeItem(API_KEY_STORAGE_KEY);
    localStorage.setItem(REMEMBER_KEY_STORAGE_KEY, 'false');
  }
}

export function loadAPIKey(): string | null {
  const remember = localStorage.getItem(REMEMBER_KEY_STORAGE_KEY);
  if (remember === 'true') {
    return localStorage.getItem(API_KEY_STORAGE_KEY);
  }
  return null;
}

export function clearAPIKey(): void {
  localStorage.removeItem(API_KEY_STORAGE_KEY);
  localStorage.removeItem(REMEMBER_KEY_STORAGE_KEY);
}

export function isAPIKeyRemembered(): boolean {
  return localStorage.getItem(REMEMBER_KEY_STORAGE_KEY) === 'true';
}
```

- [ ] **Step 2: Commit storage utilities**

```bash
git add lib/storage.ts
git commit -m "feat: add localStorage utilities for API Key management

- Save/load API Key with remember option
- Clear API Key functionality
- Check if key is remembered

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

## Task 7: Zustand State Management

**Files:**
- Create: `stores/reviewStore.ts`

- [ ] **Step 1: Create Zustand store**

```typescript
// stores/reviewStore.ts
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
  toggleReviewer: (reviewerId) => set((state) => {
    const isSelected = state.selectedReviewers.includes(reviewerId);
    return {
      selectedReviewers: isSelected
        ? state.selectedReviewers.filter(id => id !== reviewerId)
        : [...state.selectedReviewers, reviewerId]
    };
  }),
  
  highlightedParagraphId: null,
  setHighlightedParagraphId: (id) => set({ highlightedParagraphId: id }),
  
  reset: () => set({
    document: null,
    reviewResult: null,
    reviewProgress: null,
    selectedReviewers: [],
    highlightedParagraphId: null
  })
}));
```

- [ ] **Step 2: Commit Zustand store**

```bash
git add stores/reviewStore.ts
git commit -m "feat: add Zustand store for global state management

- Document and review result state
- Review progress tracking
- API Key state
- Reviewer filter and paragraph highlight state

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

## Task 8: DocumentUploader Component

**Files:**
- Create: `components/DocumentUploader.tsx`

- [ ] **Step 1: Create upload component**

```typescript
// components/DocumentUploader.tsx
'use client';

import { useState } from 'react';
import { parseDocument } from '@/lib/parser';
import { useReviewStore } from '@/stores/reviewStore';
import { SUPPORTED_FORMATS, MAX_FILE_SIZE } from '@/lib/constants';

export default function DocumentUploader() {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const setDocument = useReviewStore(state => state.setDocument);
  
  const handleFile = async (file: File) => {
    setError(null);
    setIsUploading(true);
    
    try {
      // Validate file size
      if (file.size > MAX_FILE_SIZE) {
        throw new Error(`文件过大，最大支持 ${MAX_FILE_SIZE / 1024 / 1024}MB`);
      }
      
      // Validate file format
      const ext = '.' + file.name.split('.').pop()?.toLowerCase();
      if (!SUPPORTED_FORMATS.includes(ext)) {
        throw new Error(`不支持的文件格式，仅支持：${SUPPORTED_FORMATS.join(', ')}`);
      }
      
      // Parse document
      const doc = await parseDocument(file);
      setDocument(doc);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : '文件解析失败');
    } finally {
      setIsUploading(false);
    }
  };
  
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };
  
  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };
  
  return (
    <div className="max-w-2xl mx-auto">
      <div
        className={`border-2 border-dashed rounded-lg p-12 text-center transition-colors ${
          isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
        }`}
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
      >
        <div className="space-y-4">
          <div className="text-6xl">📄</div>
          <div>
            <h3 className="text-xl font-semibold mb-2">上传 PRD 文档</h3>
            <p className="text-gray-600 mb-4">
              支持 PDF、Word、Markdown、纯文本
            </p>
          </div>
          
          <label className="inline-block">
            <input
              type="file"
              className="hidden"
              accept=".pdf,.doc,.docx,.md,.txt"
              onChange={handleFileInput}
              disabled={isUploading}
            />
            <span className="cursor-pointer bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors inline-block">
              {isUploading ? '解析中...' : '选择文件'}
            </span>
          </label>
          
          <p className="text-sm text-gray-500">
            或拖拽文件到此处
          </p>
        </div>
      </div>
      
      {error && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          ❌ {error}
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Commit DocumentUploader**

```bash
git add components/DocumentUploader.tsx
git commit -m "feat: add DocumentUploader component with drag & drop

- Drag and drop file upload
- File format and size validation
- Document parsing integration
- Error handling UI

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

## Task 9: APIKeyInput Component

**Files:**
- Create: `components/APIKeyInput.tsx`

- [ ] **Step 1: Create API Key input component**

```typescript
// components/APIKeyInput.tsx
'use client';

import { useState, useEffect } from 'react';
import { useReviewStore } from '@/stores/reviewStore';
import { loadAPIKey, saveAPIKey, clearAPIKey } from '@/lib/storage';

export default function APIKeyInput() {
  const [key, setKey] = useState('');
  const [remember, setRemember] = useState(false);
  const [showKey, setShowKey] = useState(false);
  const setApiKey = useReviewStore(state => state.setApiKey);
  
  useEffect(() => {
    const savedKey = loadAPIKey();
    if (savedKey) {
      setKey(savedKey);
      setRemember(true);
      setApiKey(savedKey);
    }
  }, [setApiKey]);
  
  const handleSave = () => {
    saveAPIKey(key, remember);
    setApiKey(key);
  };
  
  const handleClear = () => {
    clearAPIKey();
    setKey('');
    setRemember(false);
    setApiKey('');
  };
  
  return (
    <div className="max-w-2xl mx-auto mt-8 p-6 bg-white rounded-lg border border-gray-200">
      <h3 className="text-lg font-semibold mb-4">🔑 Claude API Key</h3>
      
      <div className="space-y-4">
        <div className="relative">
          <input
            type={showKey ? 'text' : 'password'}
            value={key}
            onChange={(e) => setKey(e.target.value)}
            placeholder="sk-ant-api03-..."
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-20"
          />
          <button
            onClick={() => setShowKey(!showKey)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
          >
            {showKey ? '👁️' : '👁️‍🗨️'}
          </button>
        </div>
        
        <label className="flex items-center space-x-2 text-sm text-gray-600">
          <input
            type="checkbox"
            checked={remember}
            onChange={(e) => setRemember(e.target.checked)}
            className="rounded"
          />
          <span>记住 API Key（仅保存在本地浏览器）</span>
        </label>
        
        <div className="flex gap-3">
          <button
            onClick={handleSave}
            disabled={!key}
            className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            保存
          </button>
          <button
            onClick={handleClear}
            className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            清除
          </button>
        </div>
        
        <div className="text-xs text-gray-500 bg-gray-50 p-3 rounded">
          <p>🔒 API Key 安全说明：</p>
          <ul className="list-disc list-inside mt-1 space-y-1">
            <li>仅存储在浏览器本地，不上传到任何服务器</li>
            <li>评审费用由您的 API Key 承担（约 $0.01-0.05/次）</li>
            <li>在 <a href="https://console.anthropic.com" target="_blank" className="text-blue-600 hover:underline">Anthropic Console</a> 获取 API Key</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Commit APIKeyInput**

```bash
git add components/APIKeyInput.tsx
git commit -m "feat: add APIKeyInput component with persistence

- API Key input with show/hide toggle
- Remember option with localStorage
- Clear functionality
- Security notice UI

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

## Task 10: ReviewProgress Component

**Files:**
- Create: `components/ReviewProgress.tsx`

- [ ] **Step 1: Create progress indicator**

```typescript
// components/ReviewProgress.tsx
'use client';

import { useReviewStore } from '@/stores/reviewStore';
import { REVIEWERS } from '@/lib/constants';

export default function ReviewProgress() {
  const progress = useReviewStore(state => state.reviewProgress);
  
  if (!progress) return null;
  
  const { current, total } = progress;
  const percentage = Math.round((current / total) * 100);
  
  return (
    <div className="max-w-2xl mx-auto mt-8">
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-lg font-semibold">评审进行中...</h3>
            <span className="text-sm text-gray-600">{current}/{total}</span>
          </div>
          
          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
            <div
              className="bg-blue-600 h-full transition-all duration-300 rounded-full"
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>
        
        <div className="space-y-3">
          {REVIEWERS.map((reviewer, index) => (
            <div key={reviewer.id} className="flex items-center space-x-3">
              <div className="text-2xl">{reviewer.icon}</div>
              <div className="flex-1">
                <div className="text-sm font-medium">{reviewer.name}</div>
              </div>
              <div>
                {index < current ? (
                  <span className="text-green-600">✅ 已完成</span>
                ) : index === current ? (
                  <span className="text-blue-600">⏳ 评审中...</span>
                ) : (
                  <span className="text-gray-400">⏺️ 等待中</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Commit ReviewProgress**

```bash
git add components/ReviewProgress.tsx
git commit -m "feat: add ReviewProgress component

- Progress bar with percentage
- Per-reviewer status indicator
- Real-time updates during review

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

## Task 11: PRDViewer and CommentPanel Components

**Files:**
- Create: `components/PRDViewer.tsx`
- Create: `components/CommentPanel.tsx`
- Create: `components/CommentCard.tsx`

- [ ] **Step 1: Create PRDViewer (left pane)**

```typescript
// components/PRDViewer.tsx
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
```

- [ ] **Step 2: Create CommentCard**

```typescript
// components/CommentCard.tsx
'use client';

import { Comment } from '@/lib/types';
import { formatTimestamp } from '@/lib/utils';
import { useReviewStore } from '@/stores/reviewStore';

interface CommentCardProps {
  comment: Comment;
  reviewerIcon: string;
  reviewerName: string;
  reviewerColor: string;
}

export default function CommentCard({ comment, reviewerIcon, reviewerName, reviewerColor }: CommentCardProps) {
  const setHighlightedParagraphId = useReviewStore(state => state.setHighlightedParagraphId);
  
  const severityColor = {
    high: 'bg-red-50 border-red-300',
    medium: 'bg-yellow-50 border-yellow-300',
    low: 'bg-green-50 border-green-300'
  }[comment.severity];
  
  const severityBadge = {
    high: '🔴 HIGH',
    medium: '🟡 MED',
    low: '🟢 LOW'
  }[comment.severity];
  
  const typeIcon = {
    question: '❓',
    suggestion: '💡',
    concern: '⚠️',
    praise: '👍'
  }[comment.type];
  
  return (
    <div
      className={`border rounded-lg p-4 mb-4 ${severityColor} cursor-pointer hover:shadow-md transition-shadow`}
      onMouseEnter={() => setHighlightedParagraphId(comment.paragraphId)}
      onMouseLeave={() => setHighlightedParagraphId(null)}
    >
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center space-x-2">
          <span className="text-2xl">{reviewerIcon}</span>
          <span className="font-semibold" style={{ color: reviewerColor }}>
            {reviewerName}
          </span>
        </div>
        <span className="text-xs font-semibold">{severityBadge}</span>
      </div>
      
      <div className="mb-2 text-sm text-gray-600">
        📌 &quot;{comment.quotedText}&quot;
      </div>
      
      <div className="mb-2">
        <span className="text-lg mr-2">{typeIcon}</span>
        <span className="text-sm">{comment.content}</span>
      </div>
      
      <div className="text-xs text-gray-400">
        段落 {comment.paragraphId}
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Create CommentPanel (right pane)**

```typescript
// components/CommentPanel.tsx
'use client';

import { useReviewStore } from '@/stores/reviewStore';
import { REVIEWERS } from '@/lib/constants';
import CommentCard from './CommentCard';

export default function CommentPanel() {
  const reviewResult = useReviewStore(state => state.reviewResult);
  const selectedReviewers = useReviewStore(state => state.selectedReviewers);
  const toggleReviewer = useReviewStore(state => state.toggleReviewer);
  
  if (!reviewResult) return null;
  
  // Filter reviews by selected reviewers
  const filteredReviews = selectedReviewers.length > 0
    ? reviewResult.reviews.filter(r => selectedReviewers.includes(r.reviewerId))
    : reviewResult.reviews;
  
  // Count total comments
  const totalComments = filteredReviews.reduce((sum, r) => sum + r.comments.length, 0);
  
  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Filter header */}
      <div className="p-4 bg-white border-b">
        <h3 className="font-semibold mb-3">🔍 筛选评委</h3>
        <div className="flex flex-wrap gap-2">
          {REVIEWERS.map(reviewer => {
            const isSelected = selectedReviewers.includes(reviewer.id);
            return (
              <button
                key={reviewer.id}
                onClick={() => toggleReviewer(reviewer.id)}
                className={`px-3 py-2 rounded-lg border transition-all ${
                  isSelected
                    ? 'border-2 shadow-sm'
                    : 'border-gray-300 opacity-50 hover:opacity-100'
                }`}
                style={{
                  borderColor: isSelected ? reviewer.color : undefined,
                  backgroundColor: isSelected ? `${reviewer.color}10` : undefined
                }}
              >
                <span className="text-xl mr-1">{reviewer.icon}</span>
                <span className="text-sm">{reviewer.name.split(' ')[0]}</span>
              </button>
            );
          })}
        </div>
        <div className="mt-3 text-sm text-gray-600">
          共 {totalComments} 条评论
        </div>
      </div>
      
      {/* Comments list */}
      <div className="flex-1 overflow-y-auto p-4">
        {filteredReviews.length === 0 ? (
          <div className="text-center text-gray-500 mt-8">
            未选择评委
          </div>
        ) : (
          filteredReviews.map(review => (
            <div key={review.reviewerId} className="mb-6">
              <div className="flex items-center mb-3">
                <span className="text-2xl mr-2">{review.icon}</span>
                <h4 className="font-semibold" style={{ color: review.color }}>
                  {review.reviewerName}
                </h4>
                <span className="ml-auto text-sm text-gray-500">
                  {review.comments.length} 条评论
                </span>
              </div>
              
              {review.comments.map(comment => (
                <CommentCard
                  key={comment.id}
                  comment={comment}
                  reviewerIcon={review.icon}
                  reviewerName={review.reviewerName}
                  reviewerColor={review.color}
                />
              ))}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Commit viewer and panel components**

```bash
git add components/PRDViewer.tsx components/CommentPanel.tsx components/CommentCard.tsx
git commit -m "feat: add PRDViewer and CommentPanel with highlight linking

- PRDViewer shows document with paragraph highlighting
- CommentPanel displays comments grouped by reviewer
- CommentCard shows individual comments with hover interaction
- Reviewer filter toggles

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

## Task 12: Main Pages (Upload and Review)

**Files:**
- Modify: `app/page.tsx`
- Create: `app/review/page.tsx`
- Modify: `app/layout.tsx`

- [ ] **Step 1: Create home page (upload interface)**

```typescript
// app/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import DocumentUploader from '@/components/DocumentUploader';
import APIKeyInput from '@/components/APIKeyInput';
import ReviewProgress from '@/components/ReviewProgress';
import { useReviewStore } from '@/stores/reviewStore';
import { reviewPRD } from '@/lib/reviewer';

export default function Home() {
  const router = useRouter();
  const [isReviewing, setIsReviewing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const document = useReviewStore(state => state.document);
  const apiKey = useReviewStore(state => state.apiKey);
  const setReviewResult = useReviewStore(state => state.setReviewResult);
  const setReviewProgress = useReviewStore(state => state.setReviewProgress);
  
  const handleStartReview = async () => {
    if (!document || !apiKey) {
      setError('请先上传文档并输入 API Key');
      return;
    }
    
    setError(null);
    setIsReviewing(true);
    
    try {
      const result = await reviewPRD(
        document,
        apiKey,
        (current, total) => setReviewProgress({ current, total })
      );
      
      setReviewResult(result);
      setReviewProgress(null);
      router.push('/review');
      
    } catch (err) {
      setError(err instanceof Error ? err.message : '评审失败');
      setReviewProgress(null);
    } finally {
      setIsReviewing(false);
    }
  };
  
  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">PRD 智能评审系统</h1>
          <p className="text-gray-600">
            上传 PRD 文档，AI 自动扮演 6 位团队 Leader 进行多角度评审
          </p>
        </div>
        
        {!document ? (
          <DocumentUploader />
        ) : (
          <>
            <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-lg mb-1">✅ 文档已上传</h3>
                  <p className="text-gray-600">{document.fileName}</p>
                  <p className="text-sm text-gray-500 mt-1">
                    共 {document.paragraphs.length} 个段落
                  </p>
                </div>
                <button
                  onClick={() => useReviewStore.getState().setDocument(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✖️ 重新上传
                </button>
              </div>
            </div>
            
            <APIKeyInput />
            
            {isReviewing ? (
              <ReviewProgress />
            ) : (
              <div className="mt-8 text-center">
                <button
                  onClick={handleStartReview}
                  disabled={!apiKey}
                  className="bg-blue-600 text-white px-12 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                >
                  🚀 开始评审
                </button>
              </div>
            )}
            
            {error && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                ❌ {error}
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
}
```

- [ ] **Step 2: Create review result page**

```typescript
// app/review/page.tsx
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import PRDViewer from '@/components/PRDViewer';
import CommentPanel from '@/components/CommentPanel';
import { useReviewStore } from '@/stores/reviewStore';

export default function ReviewPage() {
  const router = useRouter();
  const document = useReviewStore(state => state.document);
  const reviewResult = useReviewStore(state => state.reviewResult);
  const reset = useReviewStore(state => state.reset);
  
  useEffect(() => {
    if (!document || !reviewResult) {
      router.push('/');
    }
  }, [document, reviewResult, router]);
  
  if (!document || !reviewResult) return null;
  
  const handleNewReview = () => {
    reset();
    router.push('/');
  };
  
  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white border-b px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">{document.title}</h1>
            <p className="text-sm text-gray-600 mt-1">
              {reviewResult.reviews.length} 位评委 · {reviewResult.reviews.reduce((sum, r) => sum + r.comments.length, 0)} 条评论
            </p>
          </div>
          <button
            onClick={handleNewReview}
            className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            📄 新建评审
          </button>
        </div>
      </header>
      
      {/* Dual-pane layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left: PRD content (60%) */}
        <div className="w-[60%] border-r overflow-auto">
          <PRDViewer />
        </div>
        
        {/* Right: Comments (40%) */}
        <div className="w-[40%] overflow-auto">
          <CommentPanel />
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Update root layout**

```typescript
// app/layout.tsx
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'PRD 智能评审系统',
  description: 'AI 驱动的产品需求文档多角度评审工具',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
```

- [ ] **Step 4: Commit main pages**

```bash
git add app/page.tsx app/review/page.tsx app/layout.tsx
git commit -m "feat: add main pages with upload and review interfaces

- Home page with upload, API key input, and review trigger
- Review result page with dual-pane layout
- Root layout with Chinese locale

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

## Task 13: Sample PRD and Testing

**Files:**
- Create: `public/sample-prd.md`

- [ ] **Step 1: Create sample PRD**

```markdown
<!-- public/sample-prd.md -->
# 产品需求文档：用户增长计划 v2.0

## 1. 产品背景

本产品旨在通过创新的用户增长策略，解决目前市场上用户留存率低的问题。

当前竞品分析显示，用户在使用 3 天后流失率高达 60%，导致获客成本居高不下。

## 2. 目标用户

目标用户为 25-35 岁的职场人士，具有以下特征：

- 有一定的消费能力
- 对效率工具有需求
- 活跃在社交媒体平台

## 3. 核心功能

### 3.1 功能 A

实现用户快速注册和登录，支持第三方账号绑定。

### 3.2 功能 B

提供个性化推荐算法，根据用户行为推送相关内容。

## 4. 技术实现

采用 React + Node.js 架构，部署在云服务器。

## 5. 运营策略

通过社交媒体推广和 KOL 合作，预计 3 个月内获取 10 万用户。

## 6. 时间规划

- Week 1-2: 设计阶段
- Week 3-6: 开发阶段
- Week 7-8: 测试和上线
```

- [ ] **Step 2: Manual testing checklist**

Run the following tests manually:

```bash
# 1. Start dev server
npm run dev

# 2. Test document upload
- Visit http://localhost:3000
- Upload sample-prd.md
- Verify document is parsed correctly
- Check paragraph count matches

# 3. Test API Key
- Enter a valid Claude API Key
- Toggle "remember" checkbox
- Refresh page and verify key persists
- Click "clear" and verify key is removed

# 4. Test review (requires valid API Key)
- Upload document
- Enter API Key
- Click "Start Review"
- Verify progress updates for each reviewer
- Check all 6 reviewers complete

# 5. Test review result page
- Verify dual-pane layout
- Click on a comment and check paragraph highlights
- Toggle reviewer filters
- Verify comment counts match

# 6. Test error handling
- Upload invalid file format
- Upload file >10MB
- Start review with no API Key
- Start review with invalid API Key
```

Expected: All tests pass

- [ ] **Step 3: Commit sample PRD**

```bash
git add public/sample-prd.md
git commit -m "test: add sample PRD for testing

- Complete sample document with 6 sections
- Covers typical PRD structure
- Includes headings, lists, and paragraphs

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

## Task 14: Deployment Configuration

**Files:**
- Modify: `package.json`
- Create: `vercel.json`

- [ ] **Step 1: Add build scripts**

```json
// package.json (add to existing scripts)
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "test": "jest",
    "export": "next build && next export"
  }
}
```

- [ ] **Step 2: Create Vercel config**

```json
// vercel.json
{
  "buildCommand": "npm run build",
  "outputDirectory": "out",
  "framework": "nextjs",
  "regions": ["sin1", "hnd1"],
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-XSS-Protection",
          "value": "1; mode=block"
        }
      ]
    }
  ]
}
```

- [ ] **Step 3: Test production build**

```bash
npm run build
```

Expected: Build succeeds, static export in `out/` directory

- [ ] **Step 4: Commit deployment config**

```bash
git add package.json vercel.json
git commit -m "chore: add Vercel deployment configuration

- Configure static export
- Add security headers
- Set up Asia-Pacific regions

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

## Task 15: Final Integration and Documentation

**Files:**
- Create: `README.md`
- Create: `DEPLOYMENT.md`

- [ ] **Step 1: Write README**

```markdown
# PRD 智能评审系统

AI 驱动的产品需求文档（PRD）多角度评审工具

## 🎯 功能特性

- **多角度评审**：6 位虚拟团队 Leader（运营、品牌、技术、产品、交互、BI）
- **精准定位**：AI 评论直接关联到 PRD 具体段落
- **双栏展示**：左侧 PRD 内容，右侧评委评论，高亮联动
- **零成本运营**：纯前端架构，用户自带 API Key，无服务器成本

## 📦 技术栈

- **框架**：Next.js 14 (App Router), React 18, TypeScript
- **样式**：Tailwind CSS
- **文档解析**：pdfjs-dist, mammoth
- **AI 模型**：Claude 3.5 Sonnet (通过 REST API)
- **状态管理**：Zustand
- **部署**：Vercel 静态导出

## 🚀 快速开始

### 安装依赖

\`\`\`bash
npm install
\`\`\`

### 启动开发服务器

\`\`\`bash
npm run dev
\`\`\`

访问 http://localhost:3000

### 构建生产版本

\`\`\`bash
npm run build
\`\`\`

## 📖 使用说明

1. **上传 PRD 文档**（支持 PDF、Word、Markdown、纯文本）
2. **输入 Claude API Key**（在 [Anthropic Console](https://console.anthropic.com) 获取）
3. **点击"开始评审"**，AI 自动进行 6 轮评审
4. **查看结果**：左侧 PRD 内容，右侧评委评论，鼠标悬停高亮联动

## 💰 成本说明

- **服务器成本**：$0（纯静态部署）
- **API 成本**：由用户 API Key 承担，约 $0.01-0.05/次（5000 字 PRD）

## 🔒 安全与隐私

- API Key 仅存储在浏览器 localStorage
- PRD 内容不上传服务器，仅发送给 Claude API
- 所有处理在浏览器完成

## 📄 License

MIT
```

- [ ] **Step 2: Write deployment guide**

```markdown
# 部署指南

## Vercel 部署（推荐）

### 1. 准备工作

- 确保代码已推送到 GitHub
- 注册 [Vercel](https://vercel.com) 账号

### 2. 导入项目

1. 登录 Vercel
2. 点击 "New Project"
3. 导入 GitHub 仓库
4. 选择 Framework Preset: **Next.js**
5. 保持默认配置

### 3. 部署

点击 "Deploy"，等待构建完成（约 2-3 分钟）

### 4. 访问

部署成功后，Vercel 会生成一个 URL：`https://your-project.vercel.app`

### 5. 自定义域名（可选）

在 Vercel 项目设置中添加自定义域名

## 其他部署选项

### Netlify

1. 连接 GitHub 仓库
2. Build command: `npm run build`
3. Publish directory: `out`

### GitHub Pages

```bash
npm run build
# 将 out/ 目录内容推送到 gh-pages 分支
```

## 环境要求

- Node.js 18+
- npm 9+

## 构建验证

本地测试生产构建：

```bash
npm run build
npx serve out
```

访问 http://localhost:3000 验证功能正常
```

- [ ] **Step 3: Final integration test**

```bash
# Run all tests
npm run test

# Build and verify
npm run build
ls -la out/

# Check file sizes
du -sh out/
```

Expected: All tests pass, build succeeds, output ~2-5MB

- [ ] **Step 4: Commit documentation**

```bash
git add README.md DEPLOYMENT.md
git commit -m "docs: add README and deployment guide

- Complete feature overview
- Installation and usage instructions
- Vercel deployment guide
- Cost and security notes

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

- [ ] **Step 5: Final commit and push**

```bash
git push origin main
```

Expected: All changes pushed to GitHub

---

## Implementation Complete! 🎉

**Next Steps:**

1. **Deploy to Vercel**
   - Connect GitHub repository
   - Automatic deployment on push
   - Get production URL

2. **Test with Real PRD**
   - Use actual Claude API Key
   - Upload real PRD documents
   - Verify review quality

3. **Optional Enhancements**
   - Add export PDF functionality
   - Add review history
   - Add custom reviewer roles
   - Add multi-language support

**Total Tasks:** 15
**Total Steps:** ~75
**Estimated Time:** 3-5 hours (with TDD)
