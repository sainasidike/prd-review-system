import { segmentPRD } from '../lib/segmenter';

describe('segmentPRD', () => {
  it('should segment markdown with headings', () => {
    const content = `# 产品背景
本产品旨在解决用户痛点。

## 目标用户
目标用户为 25-35 岁的职场人士。`;

    const paragraphs = segmentPRD(content);

    expect(paragraphs).toHaveLength(4);
    expect(paragraphs[0].type).toBe('heading');
    expect(paragraphs[0].level).toBe(1);
    expect(paragraphs[0].content).toBe('产品背景');
    expect(paragraphs[2].type).toBe('heading');
    expect(paragraphs[2].level).toBe(2);
    expect(paragraphs[2].content).toBe('目标用户');
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
