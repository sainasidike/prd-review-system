import { PRDDocument, ReviewResult, Review } from './types';
import { REVIEWERS } from './constants';
import { generateUUID } from './utils';

/**
 * 调用后端 API 进行评审（使用 Gemini）
 */
export async function reviewPRDWithGemini(
  prd: PRDDocument,
  onProgress: (current: number, total: number) => void
): Promise<ReviewResult> {
  const reviews: Review[] = [];
  const errors: string[] = [];

  for (let i = 0; i < REVIEWERS.length; i++) {
    const reviewer = REVIEWERS[i];

    try {
      // 调用后端 API
      const response = await fetch('/api/review', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          reviewerIndex: i,
          prdDocument: prd
        })
      });

      if (!response.ok) {
        const error = await response.json();
        const errorMsg = error.error || `API 错误: ${response.status}`;
        console.error(`评委 ${reviewer.name} API 错误:`, errorMsg);
        errors.push(`${reviewer.name}: ${errorMsg}`);
        throw new Error(errorMsg);
      }

      const data = await response.json();

      if (!data.success) {
        const errorMsg = data.error || '评审失败';
        console.error(`评委 ${reviewer.name} 评审失败:`, errorMsg);
        errors.push(`${reviewer.name}: ${errorMsg}`);
        throw new Error(errorMsg);
      }

      // 验证并转换评论
      const validComments = (data.comments || [])
        .filter((c: any) => {
          // 基本验证
          return (
            typeof c.paragraphId === 'number' &&
            typeof c.quotedText === 'string' &&
            typeof c.type === 'string' &&
            typeof c.content === 'string' &&
            typeof c.severity === 'string'
          );
        })
        .map((c: any) => ({
          id: generateUUID(),
          paragraphId: c.paragraphId,
          quotedText: c.quotedText,
          type: c.type as 'question' | 'suggestion' | 'concern' | 'praise',
          content: c.content,
          severity: c.severity as 'high' | 'medium' | 'low'
        }));

      // 如果有有效评论，添加到结果
      if (validComments.length > 0) {
        reviews.push({
          reviewerId: reviewer.id,
          reviewerName: reviewer.name,
          icon: reviewer.icon,
          color: reviewer.color,
          comments: validComments,
          timestamp: new Date()
        });
      }

      // 更新进度
      onProgress(i + 1, REVIEWERS.length);

    } catch (error) {
      console.error(`评委 ${reviewer.name} 评审失败:`, error);
      // 继续其他评委的评审
    }
  }

  // 如果所有评委都失败，抛出详细错误
  if (reviews.length === 0 && errors.length > 0) {
    const detailedError = errors.length === 1
      ? errors[0]
      : `所有评委评审失败：\n${errors.join('\n')}`;
    throw new Error(detailedError);
  }

  return {
    documentId: prd.id,
    reviews,
    createdAt: new Date()
  };
}
