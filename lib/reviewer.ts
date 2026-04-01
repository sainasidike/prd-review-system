import { Reviewer, PRDDocument, ReviewResult, Review } from './types';
import { generateUUID } from './utils';
import { REVIEWERS, CLAUDE_MODEL } from './constants';

/**
 * LLM 返回的原始评论结构(用于验证)
 */
interface RawLLMComment {
  paragraphId: unknown;
  quotedText: unknown;
  type: unknown;
  content: unknown;
  severity: unknown;
}

/**
 * 验证 LLM 返回的评论字段
 */
function isValidComment(c: unknown): c is RawLLMComment {
  if (!c || typeof c !== 'object') return false;
  const comment = c as Record<string, unknown>;

  // 验证 paragraphId 是数字
  if (typeof comment.paragraphId !== 'number' || !Number.isInteger(comment.paragraphId)) {
    return false;
  }

  // 验证 type 是四个允许值之一
  const validTypes = ['question', 'suggestion', 'concern', 'praise'];
  if (typeof comment.type !== 'string' || !validTypes.includes(comment.type)) {
    return false;
  }

  // 验证 severity 是三个允许值之一
  const validSeverities = ['high', 'medium', 'low'];
  if (typeof comment.severity !== 'string' || !validSeverities.includes(comment.severity)) {
    return false;
  }

  // 验证 quotedText 和 content 是非空字符串
  if (typeof comment.quotedText !== 'string' || comment.quotedText.trim() === '') {
    return false;
  }
  if (typeof comment.content !== 'string' || comment.content.trim() === '') {
    return false;
  }

  return true;
}

/**
 * 为评委生成评审 prompt
 */
export function generateReviewPrompt(reviewer: Reviewer, prd: PRDDocument): string {
  return `你是一位资深的${reviewer.name},负责评审产品需求文档(PRD)。

## 你的角色
- 职位:${reviewer.name}
- 关注领域:${reviewer.focusAreas.join('、')}
- 职责:${reviewer.description}

## 评审任务
仔细阅读以下 PRD,从你的专业角度找出**问题、遗漏和改进建议**。

## PRD 内容(已分段标号)
${prd.paragraphs.map(p => `[段落${p.id}] ${p.content}`).join('\n\n')}

## 输出要求
**必须**返回有效的 JSON 格式,结构如下:

\`\`\`json
{
  "comments": [
    {
      "paragraphId": 2,
      "quotedText": "用户留存率低",
      "type": "question",
      "content": "缺少竞品对比数据,建议补充行业平均留存率作为参考基准",
      "severity": "high"
    }
  ]
}
\`\`\`

## 字段说明
- **paragraphId**: 段落编号(整数)
- **quotedText**: 引用的原文片段(5-15字,精确引用)
- **type**: 评论类型
  - "question": 提出疑问
  - "suggestion": 改进建议
  - "concern": 风险提醒
  - "praise": 优点肯定(少量)
- **content**: 评论内容(50-150字,具体、可执行)
- **severity**: 重要程度
  - "high": 必须解决
  - "medium": 建议解决
  - "low": 优化项

## 评审原则
1. **精准定位**: quotedText 必须是段落中的原文(逐字匹配)
2. **具体可执行**: 给出明确的改进方向,而非空泛的建议
3. **聚焦专业**: 从你的角色视角出发,不要越界
4. **控制数量**: 每个段落最多 2-3 条评论,总数 10-20 条
5. **优先级清晰**: 高优先级问题必须是影响产品成败的关键点

现在开始评审,直接返回 JSON,不要其他解释。`;
}

/**
 * 依次调用 Claude API 进行评审
 */
export async function reviewPRD(
  prd: PRDDocument,
  apiKey: string,
  onProgress: (current: number, total: number) => void
): Promise<ReviewResult> {
  // 验证 API key
  if (!apiKey?.trim()) {
    throw new Error('API key is required');
  }

  const reviews: Review[] = [];

  for (let i = 0; i < REVIEWERS.length; i++) {
    const reviewer = REVIEWERS[i];

    const prompt = generateReviewPrompt(reviewer, prd);

    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01',
          'content-type': 'application/json'
        },
        body: JSON.stringify({
          model: CLAUDE_MODEL,
          max_tokens: 2000,
          messages: [{ role: 'user', content: prompt }]
        })
      });

      if (!response.ok) {
        throw new Error(`Claude API 错误: ${response.status}`);
      }

      const data = await response.json();

      // 防御性检查 API 响应结构
      const text = data?.content?.[0]?.text;
      if (!text) {
        console.error(`评委 ${reviewer.name} API 响应格式错误: 缺少 content[0].text`);
        continue;
      }
      const content = text;

      // 解析 JSON(支持多种格式)
      const jsonMatch = content.match(/```json\n([\s\S]*?)\n```/) ||
                        content.match(/```\n([\s\S]*?)\n```/) ||
                        [null, content];

      let parsedComments;
      try {
        const jsonText = jsonMatch[1] || content;
        parsedComments = JSON.parse(jsonText);
      } catch (parseError) {
        console.error(`评委 ${reviewer.name} JSON 解析失败:`, parseError);
        continue;
      }

      // 验证并转换评论
      if (!parsedComments.comments || !Array.isArray(parsedComments.comments)) {
        console.error(`评委 ${reviewer.name} 返回格式错误: 缺少 comments 数组`);
        continue;
      }

      // 过滤并验证每个评论
      const validComments = parsedComments.comments
        .filter((c: unknown) => {
          if (!isValidComment(c)) {
            console.warn(`评委 ${reviewer.name} 的一条评论格式错误,已跳过:`, c);
            return false;
          }
          return true;
        })
        .map((c: RawLLMComment) => ({
          id: generateUUID(),
          paragraphId: c.paragraphId as number,
          quotedText: c.quotedText as string,
          type: c.type as 'question' | 'suggestion' | 'concern' | 'praise',
          content: c.content as string,
          severity: c.severity as 'high' | 'medium' | 'low'
        }));

      // 如果没有有效评论,跳过该评委
      if (validComments.length === 0) {
        console.error(`评委 ${reviewer.name} 没有返回有效评论`);
        continue;
      }

      reviews.push({
        reviewerId: reviewer.id,
        reviewerName: reviewer.name,
        icon: reviewer.icon,
        color: reviewer.color,
        comments: validComments,
        timestamp: new Date()
      });

      onProgress(i + 1, REVIEWERS.length);

    } catch (error) {
      console.error(`评委 ${reviewer.name} 评审失败:`, error);
      // 继续其他评委的评审
    }
  }

  return {
    documentId: prd.id,
    reviews,
    createdAt: new Date()
  };
}
