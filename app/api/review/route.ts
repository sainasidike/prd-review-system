import { NextRequest, NextResponse } from 'next/server';
import { PRDDocument, Reviewer } from '@/lib/types';
import { REVIEWERS } from '@/lib/constants';

// Gemini API 配置
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent';

/**
 * 生成评审 Prompt
 */
function generateReviewPrompt(reviewer: Reviewer, prd: PRDDocument): string {
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
- **type**: 评论类型（"question" | "suggestion" | "concern" | "praise"）
- **content**: 评论内容（50-150字，具体、可执行）
- **severity**: 重要程度（"high" | "medium" | "low"）

## 评审原则
1. **精准定位**：quotedText 必须是段落中的原文（逐字匹配）
2. **具体可执行**：给出明确的改进方向，而非空泛的建议
3. **聚焦专业**：从你的角色视角出发，不要越界
4. **控制数量**：每个段落最多 2-3 条评论，总数 10-20 条
5. **优先级清晰**：高优先级问题必须是影响产品成败的关键点

现在开始评审，直接返回 JSON，不要其他解释。`;
}

/**
 * 调用 Gemini API
 */
async function callGeminiAPI(prompt: string): Promise<any> {
  if (!GEMINI_API_KEY) {
    throw new Error('服务器未配置 GEMINI_API_KEY 环境变量');
  }

  const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      contents: [{
        parts: [{
          text: prompt
        }]
      }],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 2000,
      }
    })
  });

  if (!response.ok) {
    const error = await response.text();
    console.error('Gemini API 调用失败:', {
      status: response.status,
      statusText: response.statusText,
      error: error
    });
    throw new Error(`Gemini API 错误 (${response.status}): ${error}`);
  }

  const result = await response.json();
  console.log('Gemini API 响应成功:', {
    hasCandidates: !!result.candidates,
    candidatesCount: result.candidates?.length || 0
  });
  return result;
}

/**
 * 解析 Gemini 返回的 JSON
 */
function parseGeminiResponse(data: any): any {
  try {
    // 提取文本内容
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) {
      throw new Error('Gemini 响应格式错误：缺少文本内容');
    }

    // 尝试多种 JSON 提取方式
    const jsonMatch = text.match(/```json\n([\s\S]*?)\n```/) ||
                      text.match(/```\n([\s\S]*?)\n```/) ||
                      [null, text];

    const jsonText = jsonMatch[1] || text;
    const parsed = JSON.parse(jsonText);

    // 验证格式
    if (!parsed.comments || !Array.isArray(parsed.comments)) {
      throw new Error('返回格式错误：缺少 comments 数组');
    }

    return parsed;
  } catch (error) {
    console.error('JSON 解析失败:', error);
    throw new Error('AI 返回格式无效，请重试');
  }
}

/**
 * POST /api/review - 评审单个评委
 */
export async function POST(request: NextRequest) {
  try {
    // 检查环境变量
    console.log('环境变量检查:', {
      hasGeminiKey: !!GEMINI_API_KEY,
      keyPrefix: GEMINI_API_KEY?.substring(0, 10) + '...'
    });

    const { reviewerIndex, prdDocument } = await request.json();

    // 验证参数
    if (typeof reviewerIndex !== 'number' || !prdDocument) {
      return NextResponse.json(
        { error: '参数错误：缺少 reviewerIndex 或 prdDocument' },
        { status: 400 }
      );
    }

    if (reviewerIndex < 0 || reviewerIndex >= REVIEWERS.length) {
      return NextResponse.json(
        { error: `评委索引无效：${reviewerIndex}` },
        { status: 400 }
      );
    }

    const reviewer = REVIEWERS[reviewerIndex];

    // 生成 prompt
    const prompt = generateReviewPrompt(reviewer, prdDocument);

    // 调用 Gemini API
    const geminiResponse = await callGeminiAPI(prompt);

    // 解析返回结果
    const parsedComments = parseGeminiResponse(geminiResponse);

    // 返回评审结果
    return NextResponse.json({
      success: true,
      reviewer: {
        id: reviewer.id,
        name: reviewer.name,
        icon: reviewer.icon,
        color: reviewer.color
      },
      comments: parsedComments.comments
    });

  } catch (error) {
    console.error('评审 API 错误:', error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : '评审失败，请重试',
        success: false
      },
      { status: 500 }
    );
  }
}
