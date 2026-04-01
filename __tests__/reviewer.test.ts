import { generateReviewPrompt } from '@/lib/reviewer';
import { REVIEWERS } from '@/lib/constants';
import { PRDDocument } from '@/lib/types';

describe('generateReviewPrompt', () => {
  it('应生成包含评委角色和PRD内容的prompt', () => {
    const mockPRD: PRDDocument = {
      id: 'test-id',
      title: '测试PRD',
      fileName: 'test.md',
      content: '# 产品背景\n\n目标用户为25-35岁',
      paragraphs: [
        {
          id: 1,
          type: 'heading',
          level: 1,
          content: '产品背景',
          startIndex: 0,
          endIndex: 10
        },
        {
          id: 2,
          type: 'text',
          content: '目标用户为25-35岁',
          startIndex: 12,
          endIndex: 30
        }
      ],
      createdAt: new Date('2024-01-01')
    };

    const reviewer = REVIEWERS[0]; // 运营 Leader
    const prompt = generateReviewPrompt(reviewer, mockPRD);

    // 验证 prompt 包含关键信息
    expect(prompt).toContain(reviewer.name);
    expect(prompt).toContain(reviewer.description);
    expect(prompt).toContain('用户增长'); // focusAreas
    expect(prompt).toContain('[段落1] 产品背景');
    expect(prompt).toContain('[段落2] 目标用户为25-35岁');
    expect(prompt).toContain('paragraphId');
    expect(prompt).toContain('quotedText');
    expect(prompt).toContain('必须');
  });
});
