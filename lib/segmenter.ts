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
