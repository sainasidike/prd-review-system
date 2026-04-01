# PRD 智能评审系统

AI 驱动的产品需求文档（PRD）多角度评审工具

## 🎯 项目简介

上传 PRD 文档后，AI 自动扮演 6 位不同团队 Leader 进行专业评审：

- **评委 1：运营团队 Leader** 🏃 - 关注市场推广、用户增长、运营策略
- **评委 2：品牌团队 Leader** 💼 - 关注品牌定位、用户体验、视觉呈现
- **评委 3：技术团队 Leader** 💻 - 关注技术可行性、架构设计、性能优化
- **评委 4：产品团队 Leader** 📱 - 关注产品逻辑、功能完整性、用户价值
- **评委 5：交互团队 Leader** 🎨 - 关注交互设计、用户流程、可用性
- **评委 6：BI 团队 Leader** 📊 - 关注数据埋点、指标设计、分析维度

## ✨ 核心功能

- 📄 支持 PDF、Word、Markdown、纯文本格式
- 🤖 6 位 AI 评委多角度评审
- 💬 精准定位到段落的评论和建议
- 📊 双栏互动展示（PRD 内容 + 评委评论）
- 🔑 用户自带 API Key，零服务器成本
- ⚡ 静态部署，Vercel 一键部署

## 🚀 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 启动开发服务器

```bash
npm run dev
```

访问 [http://localhost:3000](http://localhost:3000)

### 3. 获取 Claude API Key

在 [Anthropic Console](https://console.anthropic.com) 创建 API Key

### 4. 上传测试

使用 `public/sample-prd.md` 进行测试

## 📦 技术栈

- **前端框架**: Next.js 14 (App Router) + React 18 + TypeScript
- **UI 框架**: Tailwind CSS 3.4
- **状态管理**: Zustand 4.5
- **文档解析**: pdfjs-dist 4.0、mammoth 1.6
- **AI 模型**: Claude 3.5 Sonnet (API)
- **部署**: Vercel (静态导出)

## 🏗️ 项目结构

```
├── app/                  # Next.js App Router 页面
│   ├── page.tsx         # 主页（上传界面）
│   ├── review/page.tsx  # 评审结果页
│   └── layout.tsx       # 根布局
├── components/          # React 组件
│   ├── DocumentUploader.tsx
│   ├── APIKeyInput.tsx
│   ├── ReviewProgress.tsx
│   ├── PRDViewer.tsx
│   ├── CommentPanel.tsx
│   └── CommentCard.tsx
├── lib/                 # 核心库
│   ├── types.ts        # TypeScript 类型定义
│   ├── constants.ts    # 常量（评委配置）
│   ├── utils.ts        # 工具函数
│   ├── segmenter.ts    # 文档分段算法
│   ├── parser.ts       # 文档解析器
│   ├── reviewer.ts     # AI 评审引擎
│   └── storage.ts      # localStorage 工具
└── stores/             # Zustand 状态管理
    └── reviewStore.ts
```

## 🧪 测试

```bash
npm test
```

当前测试覆盖:
- 文档分段算法
- 文档解析器（PDF/Word/Markdown/Text）
- AI 评审引擎

## 📝 部署

### Vercel 部署

1. 推送代码到 GitHub
2. 在 Vercel 导入项目
3. 自动检测 Next.js 并部署

或使用 Vercel CLI:

```bash
vercel
```

### 本地构建

```bash
npm run build
```

输出在 `out/` 目录，可部署到任何静态托管服务

## 💡 使用说明

1. **上传文档**: 拖拽或选择 PRD 文档（PDF/Word/Markdown/TXT）
2. **输入 API Key**: 输入你的 Claude API Key，可选择记住
3. **开始评审**: 点击"开始评审"，等待 6 位评委完成评审
4. **查看结果**: 双栏界面查看 PRD 和评论，支持筛选和高亮

## 🔒 隐私说明

- API Key 仅存储在浏览器本地，不上传到任何服务器
- PRD 文档仅在浏览器解析，不上传到我们的服务器
- 评审通过你的 API Key 直接调用 Claude API
- 评审费用约 $0.01-0.05 每次（取决于 PRD 长度）

## 📄 开源协议

MIT License

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！
