import { generateReviewPrompt, reviewPRD } from '@/lib/reviewer';
import { REVIEWERS } from '@/lib/constants';
import { PRDDocument } from '@/lib/types';

// Mock fetch globally
global.fetch = jest.fn();

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

describe('reviewPRD', () => {
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

  beforeEach(() => {
    (global.fetch as jest.Mock).mockClear();
  });

  it('应拒绝空的 API key', async () => {
    const mockProgress = jest.fn();

    await expect(reviewPRD(mockPRD, '', mockProgress)).rejects.toThrow('API key is required');
    await expect(reviewPRD(mockPRD, '   ', mockProgress)).rejects.toThrow('API key is required');
  });

  it('应成功处理多个评委的评审', async () => {
    const mockProgress = jest.fn();
    const mockApiResponse = {
      content: [{
        text: JSON.stringify({
          comments: [
            {
              paragraphId: 1,
              quotedText: '产品背景',
              type: 'suggestion',
              content: '建议补充更详细的背景信息',
              severity: 'medium'
            }
          ]
        })
      }]
    };

    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => mockApiResponse
    });

    const result = await reviewPRD(mockPRD, 'test-api-key', mockProgress);

    // 验证调用了所有评委
    expect(global.fetch).toHaveBeenCalledTimes(REVIEWERS.length);

    // 验证进度回调
    expect(mockProgress).toHaveBeenCalledTimes(REVIEWERS.length);
    expect(mockProgress).toHaveBeenCalledWith(1, REVIEWERS.length);
    expect(mockProgress).toHaveBeenCalledWith(REVIEWERS.length, REVIEWERS.length);

    // 验证返回结果
    expect(result.documentId).toBe(mockPRD.id);
    expect(result.reviews).toHaveLength(REVIEWERS.length);
    expect(result.reviews[0].comments).toHaveLength(1);
    expect(result.reviews[0].comments[0].paragraphId).toBe(1);
  });

  it('应处理 API 错误响应', async () => {
    const mockProgress = jest.fn();

    (global.fetch as jest.Mock).mockResolvedValue({
      ok: false,
      status: 401
    });

    const result = await reviewPRD(mockPRD, 'invalid-key', mockProgress);

    // 所有评委都应该失败,返回空的评审列表
    expect(result.reviews).toHaveLength(0);
  });

  it('应处理格式错误的 JSON 响应', async () => {
    const mockProgress = jest.fn();

    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({
        content: [{ text: 'invalid json {{{' }]
      })
    });

    const result = await reviewPRD(mockPRD, 'test-api-key', mockProgress);

    // JSON 解析失败,应跳过该评委
    expect(result.reviews).toHaveLength(0);
  });

  it('应处理缺少 content 字段的响应', async () => {
    const mockProgress = jest.fn();

    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({ content: [] })
    });

    const result = await reviewPRD(mockPRD, 'test-api-key', mockProgress);

    expect(result.reviews).toHaveLength(0);
  });

  it('应处理缺少 comments 数组的响应', async () => {
    const mockProgress = jest.fn();

    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({
        content: [{ text: JSON.stringify({ data: 'wrong structure' }) }]
      })
    });

    const result = await reviewPRD(mockPRD, 'test-api-key', mockProgress);

    expect(result.reviews).toHaveLength(0);
  });

  it('应验证并过滤格式错误的评论', async () => {
    const mockProgress = jest.fn();
    const mockApiResponse = {
      content: [{
        text: JSON.stringify({
          comments: [
            // 有效评论
            {
              paragraphId: 1,
              quotedText: '产品背景',
              type: 'suggestion',
              content: '有效评论',
              severity: 'high'
            },
            // 无效评论: paragraphId 是字符串
            {
              paragraphId: '2',
              quotedText: '目标用户',
              type: 'question',
              content: '这个评论应该被过滤',
              severity: 'medium'
            },
            // 无效评论: type 不在允许列表中
            {
              paragraphId: 1,
              quotedText: '背景',
              type: 'invalid-type',
              content: '无效类型',
              severity: 'low'
            },
            // 无效评论: severity 不在允许列表中
            {
              paragraphId: 2,
              quotedText: '用户',
              type: 'concern',
              content: '无效严重程度',
              severity: 'critical'
            },
            // 无效评论: quotedText 为空
            {
              paragraphId: 1,
              quotedText: '',
              type: 'suggestion',
              content: '空引用文本',
              severity: 'medium'
            },
            // 无效评论: content 为空
            {
              paragraphId: 2,
              quotedText: '用户',
              type: 'question',
              content: '   ',
              severity: 'high'
            }
          ]
        })
      }]
    };

    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => mockApiResponse
    });

    const result = await reviewPRD(mockPRD, 'test-api-key', mockProgress);

    // 只有第一个评论是有效的
    expect(result.reviews).toHaveLength(REVIEWERS.length);
    expect(result.reviews[0].comments).toHaveLength(1);
    expect(result.reviews[0].comments[0].content).toBe('有效评论');
  });

  it('应跳过没有有效评论的评委', async () => {
    const mockProgress = jest.fn();
    const mockApiResponse = {
      content: [{
        text: JSON.stringify({
          comments: [
            // 所有评论都无效
            { paragraphId: '1', quotedText: 'test', type: 'invalid', content: 'test', severity: 'high' }
          ]
        })
      }]
    };

    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => mockApiResponse
    });

    const result = await reviewPRD(mockPRD, 'test-api-key', mockProgress);

    // 所有评委都没有有效评论
    expect(result.reviews).toHaveLength(0);
  });
});
