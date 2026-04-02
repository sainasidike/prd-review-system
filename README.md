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

- 🎉 **完全免费** - 使用 Google Gemini AI，无需注册、无需付费
- ✨ **即开即用** - 点击"体验 Demo"查看预生成的评审示例
- 📄 支持 PDF、Word、Markdown、纯文本格式
- 🤖 6 位 AI 评委多角度评审（运营/品牌/技术/产品/交互/BI）
- 💬 精准定位到段落的评论和建议
- 📊 双栏互动展示（PRD 内容 + 评委评论）
- ⚡ 静态部署，Vercel 一键部署

## 🚀 快速开始

### 方式一：在线使用（推荐）

访问部署的网站，上传 PRD，立即获得免费评审！

### 方式二：本地部署

1. **克隆项目**
   ```bash
   git clone https://github.com/sainasidike/prd-review-system.git
   cd prd-review-system
   ```

2. **安装依赖**
   ```bash
   npm install
   ```

3. **配置环境变量**
   
   创建 `.env.local` 文件：
   ```bash
   cp .env.local.example .env.local
   ```
   
   在 [Google AI Studio](https://makersuite.google.com/app/apikey) 免费获取 Gemini API Key，填入：
   ```
   GEMINI_API_KEY=your_api_key_here
   ```

4. **启动开发服务器**
   ```bash
   npm run dev
   ```
   
   访问 [http://localhost:3000](http://localhost:3000)

### 体验 Demo

无需配置，直接点击 **"🚀 体验 Demo"** 查看预生成的评审示例！

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

### Vercel 部署（推荐）

1. **推送代码到 GitHub**

2. **导入到 Vercel**
   - 访问 [vercel.com/new](https://vercel.com/new)
   - 选择你的 GitHub 仓库
   - 点击 "Import"

3. **配置环境变量**
   
   在 Vercel 项目设置中添加：
   ```
   GEMINI_API_KEY = 你的Gemini API Key
   ```
   
   获取地址：[Google AI Studio](https://makersuite.google.com/app/apikey)（完全免费）

4. **点击 Deploy**
   
   Vercel 会自动检测 Next.js 并部署

### 其他平台部署

项目支持任何支持 Next.js 的平台：
- Netlify
- Railway
- Render

**重要：** 记得在平台设置中配置 `GEMINI_API_KEY` 环境变量

## 💡 使用说明

### 体验 Demo
1. 点击 **"🚀 体验 Demo"** 按钮
2. 立即查看预生成的评审结果

### 评审自己的 PRD
1. **上传文档**: 拖拽或选择 PRD 文档（PDF/Word/Markdown/TXT）
2. **开始评审**: 点击 **"开始免费评审"**，等待 1-2 分钟
3. **查看结果**: 双栏界面查看 PRD 和评论，支持筛选和高亮
4. **交互体验**: 
   - 鼠标悬停评论，左侧对应段落自动高亮
   - 点击评委图标筛选特定评委的评论
   - 按严重程度查看问题

## 🔒 隐私与安全

- ✅ **PRD 文档安全**: 文档仅在浏览器解析，通过加密 HTTPS 发送到后端 API
- ✅ **无需注册**: 不收集任何用户信息
- ✅ **完全免费**: 使用 Google Gemini 免费 API，无任何隐藏费用
- ✅ **开源透明**: 代码完全开源，可自行审查和部署

## 📄 开源协议

MIT License

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！
