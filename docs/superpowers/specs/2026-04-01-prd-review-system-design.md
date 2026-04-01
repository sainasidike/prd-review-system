# PRD 智能评审系统 - 设计文档

**创建日期：** 2026-04-01  
**版本：** 1.0  
**状态：** 设计阶段

---

## 1. 项目概述

### 1.1 项目目标

构建一个 AI 驱动的 PRD（产品需求文档）智能评审系统，通过 6 位虚拟团队 Leader（运营、品牌、技术、产品、交互、BI）从不同专业角度对 PRD 进行多维度评审，帮助产品团队发现文档中的问题、遗漏和改进点。

### 1.2 核心价值

- **多角度评审**：6 位不同领域的专家视角，全面覆盖 PRD 评审维度
- **精准定位**：评论直接关联到 PRD 具体段落，可视化展示
- **即时反馈**：上传即评审，无需等待人工安排评审会议
- **零成本运营**：纯前端架构，用户自带 API Key，无服务器成本

### 1.3 核心特性

1. **文档格式支持**：PDF、Word、Markdown、纯文本
2. **AI 智能评审**：基于 Claude API，6 位评委串行评审
3. **精准段落定位**：AI 自动识别并标注评论对应的段落
4. **双栏互动展示**：左侧 PRD 内容，右侧评委评论，高亮联动
5. **用户自带 API Key**：无需注册登录，费用用户自担
6. **静态部署**：纯前端，Vercel 一键部署

---

## 2. 系统架构

### 2.1 整体架构

```
┌─────────────────────────────────────────────────────┐
│              用户浏览器（纯前端）                      │
├─────────────────────────────────────────────────────┤
│  ┌─────────────────────────────────────────────┐   │
│  │  1. 文档上传与解析                           │   │
│  │     PDF/Word/Markdown → 文本提取 → 分段    │   │
│  └─────────────────────────────────────────────┘   │
│                    ↓                                │
│  ┌─────────────────────────────────────────────┐   │
│  │  2. API Key 输入 (localStorage)             │   │
│  └─────────────────────────────────────────────┘   │
│                    ↓                                │
│  ┌─────────────────────────────────────────────┐   │
│  │  3. 智能评审引擎                             │   │
│  │     评委1 → 评委2 → ... → 评委6 (串行)      │   │
│  │     每位评委调用 Claude API 并返回结构化评论 │   │
│  └─────────────────────────────────────────────┘   │
│                    ↓                                │
│  ┌─────────────────────────────────────────────┐   │
│  │  4. 双栏展示与交互                           │   │
│  │     左：PRD 内容（高亮段落）                 │   │
│  │     右：评委评论（按段落/评委筛选）          │   │
│  └─────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────┘
                     ↓ HTTPS
┌─────────────────────────────────────────────────────┐
│         Claude API (api.anthropic.com)              │
└─────────────────────────────────────────────────────┘
```

### 2.2 技术选型

| 层级 | 技术 | 说明 |
|------|------|------|
| **前端框架** | Next.js 14 (App Router) | React 18 + TypeScript |
| **UI 框架** | Tailwind CSS | 响应式设计 |
| **文档解析** | pdfjs-dist, mammoth | PDF、Word 解析 |
| **AI 模型** | Claude 3.5 Sonnet | 通过 REST API 直接调用 |
| **状态管理** | React Context / Zustand | 轻量级状态管理 |
| **本地存储** | localStorage | API Key 存储 |
| **部署** | Vercel | 静态导出，全球 CDN |

### 2.3 部署架构

- **静态部署**：Next.js 静态导出（`output: 'export'`）
- **托管平台**：Vercel / Netlify / GitHub Pages
- **无后端**：所有逻辑在浏览器完成
- **API 调用**：浏览器直接请求 Claude API

---

## 3. 数据模型设计

### 3.1 PRD 文档结构

```typescript
interface PRDDocument {
  id: string;              // 文档唯一ID（uuid）
  title: string;           // PRD 标题
  fileName: string;        // 原始文件名
  content: string;         // 原始内容（全文）
  paragraphs: Paragraph[]; // 分段后的内容
  createdAt: Date;         // 创建时间
}

interface Paragraph {
  id: number;              // 段落ID (1, 2, 3...)
  type: 'heading' | 'text' | 'list';  // 段落类型
  content: string;         // 段落文本
  level?: number;          // 标题层级 (1-6，仅 heading 类型)
  startIndex: number;      // 在原文中的起始位置
  endIndex: number;        // 在原文中的结束位置
}
```

### 3.2 评审结果结构

```typescript
interface ReviewResult {
  documentId: string;      // 关联的文档ID
  reviews: Review[];       // 6 位评委的评审
  createdAt: Date;         // 评审时间
  apiCost?: number;        // API 调用成本（可选）
}

interface Review {
  reviewerId: string;      // 评委ID (operation/brand/tech/product/ux/bi)
  reviewerName: string;    // 评委名称
  icon: string;            // 评委图标 emoji
  comments: Comment[];     // 所有评论
  timestamp: Date;         // 评审时间
  tokenUsed?: number;      // 使用的 token 数（可选）
}

interface Comment {
  id: string;              // 评论ID（uuid）
  paragraphId: number;     // 关联的段落ID
  quotedText: string;      // 引用的原文片段（5-15字）
  type: 'question' | 'suggestion' | 'concern' | 'praise'; // 评论类型
  content: string;         // 评论内容（具体、可执行）
  severity: 'high' | 'medium' | 'low'; // 重要程度
}
```

### 3.3 评委角色定义

```typescript
const REVIEWERS = [
  {
    id: 'operation',
    name: '运营团队 Leader',
    icon: '🏃',
    color: '#10B981',  // 绿色
    focusAreas: ['用户增长', '市场推广', '运营策略', 'KPI指标'],
    description: '关注产品的市场推广、用户增长路径、运营成本和数据指标'
  },
  {
    id: 'brand',
    name: '品牌团队 Leader',
    icon: '💼',
    color: '#8B5CF6',  // 紫色
    focusAreas: ['品牌定位', '用户体验', '视觉呈现', '品牌调性'],
    description: '关注品牌定位的清晰度、用户感知和品牌一致性'
  },
  {
    id: 'tech',
    name: '技术团队 Leader',
    icon: '💻',
    color: '#3B82F6',  // 蓝色
    focusAreas: ['技术可行性', '架构设计', '性能优化', '技术风险'],
    description: '关注技术实现难度、架构合理性、性能指标和技术债务'
  },
  {
    id: 'product',
    name: '产品团队 Leader',
    icon: '📱',
    color: '#F59E0B',  // 橙色
    focusAreas: ['产品逻辑', '功能完整性', '用户价值', '竞品分析'],
    description: '关注功能逻辑、需求完整性、用户价值和市场竞争力'
  },
  {
    id: 'ux',
    name: '交互团队 Leader',
    icon: '🎨',
    color: '#EC4899',  // 粉色
    focusAreas: ['交互设计', '用户流程', '可用性', '体验细节'],
    description: '关注用户流程的流畅性、交互的合理性和体验细节'
  },
  {
    id: 'bi',
    name: 'BI 团队 Leader',
    icon: '📊',
    color: '#06B6D4',  // 青色
    focusAreas: ['数据埋点', '指标设计', '分析维度', '数据驱动'],
    description: '关注数据埋点方案、关键指标定义和数据分析能力'
  }
];
```

---

## 4. 核心功能设计

### 4.1 文档解析模块

**功能：** 将上传的文档（PDF/Word/Markdown/TXT）解析为纯文本并智能分段。

**实现：**

```typescript
// 主入口
async function parseDocument(file: File): Promise<PRDDocument> {
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
      throw new Error('不支持的文件格式');
  }
  
  // 智能分段
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

// 智能分段算法
function segmentPRD(content: string): Paragraph[] {
  const paragraphs: Paragraph[] = [];
  let id = 1;
  let currentIndex = 0;
  
  const lines = content.split('\n');
  
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    
    // 识别 Markdown 标题
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
    // 识别列表项
    else if (trimmed.match(/^[-*]\s+.+$/)) {
      paragraphs.push({
        id: id++,
        type: 'list',
        content: trimmed.replace(/^[-*]\s+/, ''),
        startIndex: currentIndex,
        endIndex: currentIndex + line.length
      });
    }
    // 普通段落
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

**特殊处理：**
- **PDF**：使用 `pdfjs-dist` 提取文本，处理跨页断行
- **Word**：使用 `mammoth` 提取纯文本，保留标题结构
- **Markdown**：原生解析，识别 `#` 标题语法
- **段落合并**：短段落（<20字）可选择与下一段合并

### 4.2 智能评审模块

**功能：** 依次调用 Claude API，让 6 位评委对 PRD 进行评审。

**Prompt 模板：**

```typescript
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
- **type**: 评论类型
  - "question": 提出疑问
  - "suggestion": 改进建议
  - "concern": 风险提醒
  - "praise": 优点肯定（少量）
- **content**: 评论内容（50-150字，具体、可执行）
- **severity**: 重要程度
  - "high": 必须解决
  - "medium": 建议解决
  - "low": 优化项

## 评审原则
1. **精准定位**：quotedText 必须是段落中的原文（逐字匹配）
2. **具体可执行**：给出明确的改进方向，而非空泛的建议
3. **聚焦专业**：从你的角色视角出发，不要越界
4. **控制数量**：每个段落最多 2-3 条评论，总数 10-20 条
5. **优先级清晰**：高优先级问题必须是影响产品成败的关键点

现在开始评审，直接返回 JSON，不要其他解释。`;
}
```

**API 调用逻辑：**

```typescript
async function reviewPRD(
  prd: PRDDocument, 
  apiKey: string,
  onProgress: (current: number, total: number) => void
): Promise<ReviewResult> {
  const reviews: Review[] = [];
  
  for (let i = 0; i < REVIEWERS.length; i++) {
    const reviewer = REVIEWERS[i];
    
    // 构建 prompt
    const prompt = generateReviewPrompt(reviewer, prd);
    
    try {
      // 调用 Claude API
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
        throw new Error(`Claude API 错误: ${response.status}`);
      }
      
      const data = await response.json();
      
      // 解析返回的 JSON
      const content = data.content[0].text;
      const jsonMatch = content.match(/```json\n([\s\S]*?)\n```/) || 
                        content.match(/```\n([\s\S]*?)\n```/) ||
                        [null, content];
      
      const comments = JSON.parse(jsonMatch[1] || content);
      
      // 保存评审结果
      reviews.push({
        reviewerId: reviewer.id,
        reviewerName: reviewer.name,
        icon: reviewer.icon,
        comments: comments.comments.map((c: any) => ({
          ...c,
          id: generateUUID()
        })),
        timestamp: new Date(),
        tokenUsed: data.usage?.input_tokens + data.usage?.output_tokens
      });
      
      // 更新进度
      onProgress(i + 1, REVIEWERS.length);
      
    } catch (error) {
      console.error(`评委 ${reviewer.name} 评审失败:`, error);
      // 记录错误但继续其他评委的评审
    }
  }
  
  return {
    documentId: prd.id,
    reviews,
    createdAt: new Date()
  };
}
```

**错误处理：**
- API Key 无效 → 提示用户检查
- 速率限制 → 自动重试（指数退避）
- JSON 解析失败 → 使用正则提取或跳过该评委
- 网络错误 → 显示错误信息，允许重新评审

### 4.3 双栏展示模块

**功能：** 左侧展示 PRD 内容，右侧展示评委评论，支持高亮联动和筛选。

**界面布局：**

```
┌────────────────────────────────────────────────────────┐
│  PRD: 用户增长计划 v2.0                                 │
│  [导出 PDF] [复制评论] [分享链接]                       │
├──────────────────────┬─────────────────────────────────┤
│  PRD 内容 (60%)       │  评委评论 (40%)                  │
├──────────────────────┼─────────────────────────────────┤
│                      │  🔍 筛选: [全部▾]                │
│                      │  🏃运营 💼品牌 💻技术             │
│                      │  📱产品 🎨交互 📊BI               │
│                      │                                 │
│                      │  排序: ○ 按段落 ● 按重要性       │
│                      │  ────────────────────────────── │
│ # 1. 产品背景         │                                 │
│                      │                                 │
│ 本产品旨在通过...     │  ▼ 段落 2 (2 条评论)            │
│                      │  ┌───────────────────────────┐ │
│ 目前市场上存在的      │  │ 💼 品牌团队 Leader   🔴HIGH│ │
│ [主要问题是用户]      │  │ 📌 "主要问题是用户留存率低" │ │
│ [留存率低]，导致      │  │ 💬 缺少竞品对比数据，建议  │ │
│ 获客成本居高不下。    │  │    补充行业平均留存率...   │ │
│                      │  │ ⏱️ 2 分钟前               │ │
│ # 2. 目标用户         │  └───────────────────────────┘ │
│                      │  ┌───────────────────────────┐ │
│ [目标用户为 25-35...] │  │ 📊 BI 团队 Leader    🟡MED│ │
│                      │  │ 📌 "用户留存率低"          │ │
│                      │  │ 💡 需要定义留存率的具体指标│ │
│                      │  │    (次日留存？7日留存？)   │ │
│                      │  │ ⏱️ 刚刚                   │ │
│                      │  └───────────────────────────┘ │
└──────────────────────┴─────────────────────────────────┘
```

**交互设计：**

1. **高亮联动**
   - 鼠标悬停评论 → 左侧对应段落黄色高亮
   - 鼠标悬停段落 → 右侧相关评论边框高亮
   - 点击评论 → 自动滚动到对应段落

2. **筛选功能**
   - 按评委筛选：点击评委图标切换显示/隐藏
   - 按重要性筛选：🔴高 🟡中 🟢低
   - 按类型筛选：❓问题 💡建议 ⚠️风险 👍优点

3. **排序功能**
   - 按段落顺序：从上到下展示（默认）
   - 按重要性：高优先级在前
   - 按评委：同一评委的评论聚合展示

4. **折叠/展开**
   - 每个段落的评论组可以折叠
   - 全部展开/全部折叠快捷按钮
   - 记住用户折叠状态（localStorage）

5. **响应式设计**
   - 桌面端：双栏并排（60/40）
   - 平板端：双栏并排（50/50）
   - 移动端：单栏切换（Tab 切换 PRD/评论）

---

## 5. 用户流程

### 5.1 完整流程图

```
[首页：上传 PRD]
       ↓
[上传文件] ← 支持拖拽
       ↓
[文件解析中...] (进度条)
       ↓
[输入 Claude API Key]
  - 首次输入
  - 或从 localStorage 读取
  - 可选"记住 API Key"
       ↓
[点击"开始评审"]
       ↓
[评审进度页面]
  - ✅ 运营 Leader - 已完成
  - ✅ 品牌 Leader - 已完成
  - ⏳ 技术 Leader - 评审中...
  - ⏺️ 产品 Leader - 等待中
  - ⏺️ 交互 Leader - 等待中
  - ⏺️ BI Leader - 等待中
       ↓
[评审结果页面]
  - 左栏：PRD 内容
  - 右栏：评委评论
  - 支持筛选、排序、导出
       ↓
[用户操作]
  - 查看评论
  - 导出 PDF 报告
  - 复制评论文本
  - 分享结果链接（可选）
```

### 5.2 边界情况处理

| 场景 | 处理方式 |
|------|---------|
| 文档解析失败 | 显示错误提示，允许重新上传 |
| API Key 无效 | 提示"API Key 无效，请检查"，不发起请求 |
| 某位评委评审失败 | 跳过该评委，继续其他评委评审，最后提示"部分评委评审失败" |
| 网络中断 | 显示"网络错误"，提供"重试"按钮 |
| PRD 过长（>10万字） | 提示"文档过长，建议拆分"，但仍允许评审 |
| 评论数过多（>100条） | 正常展示，右侧列表支持虚拟滚动优化性能 |
| 无评论（PRD 完美） | 显示"恭喜！PRD 非常完善，暂无问题"+ 各评委简短总结 |

---

## 6. 性能优化

### 6.1 文档解析优化

- **大文件处理**：使用 Web Worker 解析 PDF/Word，避免阻塞主线程
- **分段算法**：限制段落数（最多 200 段），避免过度分段
- **缓存解析结果**：文档哈希 + IndexedDB 缓存解析后的文本

### 6.2 API 调用优化

- **串行调用**：6 位评委串行调用，避免并发过高导致限流
- **错误重试**：指数退避重试（1s, 2s, 4s）
- **Token 估算**：调用前估算 Token 数，超出提示用户

### 6.3 UI 渲染优化

- **虚拟滚动**：评论列表使用 `react-window` 虚拟滚动
- **懒加载**：段落内容按需渲染，视口外的不渲染
- **防抖节流**：高亮联动使用 `debounce`，避免频繁更新

### 6.4 部署优化

- **代码分割**：按路由和组件拆分 Bundle
- **Tree Shaking**：仅打包使用的 pdfjs/mammoth 模块
- **资源压缩**：Gzip/Brotli 压缩
- **CDN 加速**：Vercel 全球 CDN

---

## 7. 安全与隐私

### 7.1 API Key 安全

- **本地存储**：API Key 仅存储在浏览器 localStorage，不上传服务器
- **加密传输**：所有 API 请求使用 HTTPS
- **明确提示**：界面提示"API Key 仅在本地使用，不会泄露"
- **可清除**：提供"清除 API Key"按钮

### 7.2 数据隐私

- **无后端存储**：PRD 内容和评审结果不存储在服务器
- **本地处理**：所有解析和处理在浏览器完成
- **可选分享**：分享功能通过 URL 参数传递（Base64 编码），可选功能

### 7.3 XSS 防护

- **输出转义**：所有用户输入和 API 返回内容进行 HTML 转义
- **CSP 策略**：配置 Content-Security-Policy 头
- **输入验证**：限制上传文件大小和类型

---

## 8. 未来扩展

### 8.1 短期扩展（v1.1 - v1.3）

- **评论回复**：用户可以对评委评论进行回复或标记"已解决"
- **PDF 导出**：将评审结果导出为带标注的 PDF 报告
- **历史记录**：在 localStorage 保存最近 5 次评审记录
- **评委自定义**：允许用户添加自定义评委角色

### 8.2 中期扩展（v2.0）

- **多 AI 支持**：支持 GPT-4、通义千问等其他 AI 模型
- **协作功能**：生成分享链接，多人查看同一份评审结果
- **评分系统**：为 PRD 打分（完整性、可行性、创新性）
- **模板库**：提供常见 PRD 模板和评审标准

### 8.3 长期愿景（v3.0）

- **企业版**：支持团队协作、权限管理、私有部署
- **学习功能**：根据历史评审学习，生成个性化评审标准
- **集成工具**：对接 Notion、飞书文档等在线文档平台
- **多语言**：支持英文、日文等多语言 PRD 评审

---

## 9. 技术实现清单

### 9.1 前端组件清单

| 组件 | 文件路径 | 功能 |
|------|---------|------|
| **DocumentUploader** | `components/DocumentUploader.tsx` | 文档上传（拖拽、选择） |
| **APIKeyInput** | `components/APIKeyInput.tsx` | API Key 输入和管理 |
| **ReviewProgress** | `components/ReviewProgress.tsx` | 评审进度展示 |
| **PRDViewer** | `components/PRDViewer.tsx` | PRD 内容展示（左栏） |
| **CommentPanel** | `components/CommentPanel.tsx` | 评论面板（右栏） |
| **CommentCard** | `components/CommentCard.tsx` | 单条评论卡片 |
| **ReviewerFilter** | `components/ReviewerFilter.tsx` | 评委筛选器 |
| **ExportButton** | `components/ExportButton.tsx` | 导出 PDF 按钮 |

### 9.2 核心工具函数

| 函数 | 文件路径 | 功能 |
|------|---------|------|
| **parseDocument** | `lib/parser.ts` | 文档解析主入口 |
| **parsePDF** | `lib/parser.ts` | PDF 解析 |
| **parseWord** | `lib/parser.ts` | Word 解析 |
| **segmentPRD** | `lib/segmenter.ts` | 智能分段 |
| **reviewPRD** | `lib/reviewer.ts` | 评审引擎 |
| **generateReviewPrompt** | `lib/reviewer.ts` | Prompt 生成 |
| **exportToPDF** | `lib/exporter.ts` | 导出 PDF 报告 |

### 9.3 依赖包清单

```json
{
  "dependencies": {
    "next": "^14.1.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "typescript": "^5.3.3",
    "tailwindcss": "^3.4.0",
    "pdfjs-dist": "^4.0.269",
    "mammoth": "^1.6.0",
    "uuid": "^9.0.1",
    "react-window": "^1.8.10",
    "zustand": "^4.5.0"
  },
  "devDependencies": {
    "@types/react": "^18.2.0",
    "@types/uuid": "^9.0.7",
    "eslint": "^8.56.0",
    "prettier": "^3.2.0"
  }
}
```

---

## 10. 开发计划

### 10.1 里程碑

| 阶段 | 时间 | 交付物 |
|------|------|--------|
| **Phase 1: 基础框架** | Week 1 | Next.js 项目搭建、基础 UI、路由 |
| **Phase 2: 文档解析** | Week 2 | PDF/Word/Markdown 解析、分段算法 |
| **Phase 3: AI 评审** | Week 3 | Claude API 集成、Prompt 优化 |
| **Phase 4: 双栏展示** | Week 4 | PRD Viewer、Comment Panel、高亮联动 |
| **Phase 5: 优化部署** | Week 5 | 性能优化、测试、Vercel 部署 |

### 10.2 任务分解

**Phase 1: 基础框架**
- [ ] 初始化 Next.js 项目（App Router）
- [ ] 配置 Tailwind CSS
- [ ] 创建首页布局
- [ ] 创建评审结果页布局
- [ ] 设置路由结构

**Phase 2: 文档解析**
- [ ] 实现 PDF 解析（pdfjs-dist）
- [ ] 实现 Word 解析（mammoth）
- [ ] 实现 Markdown/TXT 解析
- [ ] 实现智能分段算法
- [ ] 单元测试（各种文档格式）

**Phase 3: AI 评审**
- [ ] 定义评委角色和 Prompt
- [ ] 实现 Claude API 调用
- [ ] 实现串行评审逻辑
- [ ] 实现错误处理和重试
- [ ] 测试不同 PRD 的评审效果

**Phase 4: 双栏展示**
- [ ] 实现 PRD 内容展示组件
- [ ] 实现评论面板组件
- [ ] 实现高亮联动交互
- [ ] 实现筛选和排序功能
- [ ] 实现折叠/展开功能

**Phase 5: 优化部署**
- [ ] 性能优化（虚拟滚动、懒加载）
- [ ] 添加 Loading 和 Error 状态
- [ ] 响应式设计测试
- [ ] 浏览器兼容性测试
- [ ] Vercel 部署配置

---

## 11. 成本估算

### 11.1 开发成本

- **开发时间**：5 周（1 人全职）
- **设计时间**：3 天（UI/UX 设计）

### 11.2 运营成本

- **服务器**：$0（纯静态部署）
- **域名**：$12/年（可选）
- **CDN**：$0（Vercel 免费额度）
- **总计**：$0-12/年

### 11.3 用户成本

- **Claude API**：$0.01-0.05 每次评审（用户自担）
- **估算**：一次完整评审（6 位评委，5000 字 PRD）约 $0.03

---

## 12. 风险与应对

| 风险 | 概率 | 影响 | 应对措施 |
|------|------|------|---------|
| Claude API 返回格式不稳定 | 中 | 高 | 多次测试优化 Prompt，添加容错解析 |
| 大文件解析性能差 | 中 | 中 | 使用 Web Worker，限制文件大小 |
| 用户不愿提供 API Key | 中 | 高 | 清晰说明安全性，提供测试 API Key |
| AI 评审质量不稳定 | 中 | 高 | 多轮 Prompt 优化，收集用户反馈 |
| 浏览器兼容性问题 | 低 | 中 | 优先支持 Chrome/Safari，添加兼容性检测 |

---

## 13. 成功指标

### 13.1 产品指标

- **用户数**：3 个月内达到 500 用户
- **评审次数**：月均 1000 次评审
- **用户留存**：7 日留存率 >30%
- **评审质量**：用户满意度 >4.0/5.0

### 13.2 技术指标

- **首屏加载**：< 2 秒
- **评审速度**：6 位评委评审完成 < 2 分钟（5000 字 PRD）
- **错误率**：< 5%
- **可用性**：> 99%

---

## 附录

### A. PRD 示例结构

```markdown
# 产品需求文档：用户增长计划 v2.0

## 1. 产品背景
本产品旨在通过...

## 2. 目标用户
目标用户为 25-35 岁...

## 3. 核心功能
### 3.1 功能 A
### 3.2 功能 B

## 4. 技术实现
### 4.1 架构设计
### 4.2 技术栈

## 5. 运营策略
### 5.1 推广渠道
### 5.2 KPI 指标

## 6. 时间规划
```

### B. 评审示例输出

```json
{
  "comments": [
    {
      "paragraphId": 3,
      "quotedText": "用户留存率低",
      "type": "question",
      "content": "缺少竞品对比数据，建议补充行业平均留存率（如 SaaS 行业次日留存约 40%）作为参考基准，明确我们的目标值",
      "severity": "high"
    },
    {
      "paragraphId": 5,
      "quotedText": "目标用户为 25-35 岁",
      "type": "suggestion",
      "content": "年龄跨度过大，建议细分为 25-28 岁（职场新人）和 30-35 岁（职场骨干）两类，他们的需求和付费能力差异明显",
      "severity": "medium"
    }
  ]
}
```

### C. 参考资料

- Claude API 文档：https://docs.anthropic.com/claude/reference
- Next.js 文档：https://nextjs.org/docs
- pdfjs-dist 文档：https://mozilla.github.io/pdf.js/
- mammoth.js 文档：https://github.com/mwilliamson/mammoth.js

---

**文档结束**

**版本历史：**
- v1.0 (2026-04-01): 初始版本
