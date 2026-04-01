// Mock pdfjs-dist and mammoth since they use ES modules
jest.mock('pdfjs-dist', () => ({
  GlobalWorkerOptions: { workerSrc: '' },
  getDocument: jest.fn(),
  version: '4.0.269'
}));

jest.mock('mammoth', () => ({
  extractRawText: jest.fn()
}));

import { parseMarkdown, parseText, parsePDF, parseWord, parseDocument } from '../lib/parser';
import * as pdfjsLib from 'pdfjs-dist';
import mammoth from 'mammoth';

// Helper to create a mock File with text() method
function createMockFile(content: string, fileName: string, type: string): File {
  const blob = new Blob([content], { type });
  const file = new File([blob], fileName, { type });

  // Add text() method if not present (Node environment)
  if (!file.text) {
    (file as any).text = async () => content;
  }

  // Add arrayBuffer() method if not present (Node environment)
  if (!file.arrayBuffer) {
    (file as any).arrayBuffer = async () => {
      // Use Buffer (Node.js) to create ArrayBuffer
      const buffer = Buffer.from(content, 'utf-8');
      return buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength);
    };
  }

  return file;
}

describe('parseMarkdown', () => {
  it('should extract text from markdown file', async () => {
    const mockFile = createMockFile('# Title\n\nContent', 'test.md', 'text/markdown');
    const content = await parseMarkdown(mockFile);

    expect(content).toContain('# Title');
    expect(content).toContain('Content');
  });
});

describe('parseText', () => {
  it('should extract text from txt file', async () => {
    const mockFile = createMockFile('Plain text content', 'test.txt', 'text/plain');
    const content = await parseText(mockFile);

    expect(content).toBe('Plain text content');
  });
});

describe('parsePDF', () => {
  it('should extract text from PDF file', async () => {
    const mockPage = {
      getTextContent: jest.fn().mockResolvedValue({
        items: [
          { str: 'PDF' },
          { str: 'Content' }
        ]
      })
    };

    const mockPDF = {
      numPages: 1,
      getPage: jest.fn().mockResolvedValue(mockPage)
    };

    (pdfjsLib.getDocument as jest.Mock).mockReturnValue({
      promise: Promise.resolve(mockPDF)
    });

    const mockFile = createMockFile('dummy', 'test.pdf', 'application/pdf');
    const content = await parsePDF(mockFile);

    expect(content).toBe('PDF Content');
    expect(pdfjsLib.getDocument).toHaveBeenCalled();
  });
});

describe('parseWord', () => {
  it('should extract text from Word file', async () => {
    (mammoth.extractRawText as jest.Mock).mockResolvedValue({
      value: 'Word document content'
    });

    const mockFile = createMockFile('dummy', 'test.docx', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
    const content = await parseWord(mockFile);

    expect(content).toBe('Word document content');
    expect(mammoth.extractRawText).toHaveBeenCalled();
  });
});

describe('parseDocument', () => {
  it('should parse markdown file and return PRDDocument', async () => {
    const mockFile = createMockFile('# Test PRD\n\nThis is a test', 'test.md', 'text/markdown');
    const doc = await parseDocument(mockFile);

    expect(doc.title).toBe('Test PRD');
    expect(doc.fileName).toBe('test.md');
    expect(doc.content).toContain('# Test PRD');
    expect(doc.paragraphs.length).toBeGreaterThan(0);
    expect(doc.id).toBeDefined();
    expect(doc.createdAt).toBeInstanceOf(Date);
  });

  it('should throw error for unsupported file format', async () => {
    const mockFile = createMockFile('dummy', 'test.xyz', 'application/xyz');
    await expect(parseDocument(mockFile)).rejects.toThrow('不支持的文件格式: xyz');
  });
});
