import * as pdfjsLib from 'pdfjs-dist';
import mammoth from 'mammoth';
import { PRDDocument } from './types';
import { generateUUID, extractTitle } from './utils';
import { segmentPRD } from './segmenter';
import { MAX_FILE_SIZE } from './constants';

export async function parseDocument(file: File): Promise<PRDDocument> {
  // Validate file size
  if (file.size > MAX_FILE_SIZE) {
    throw new Error(`文件过大，最大支持 ${MAX_FILE_SIZE / 1024 / 1024}MB`);
  }

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
  pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.mjs`;

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
