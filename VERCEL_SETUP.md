# Vercel 部署配置指南

## 🚀 快速部署步骤

### 1. 获取 Gemini API Key（完全免费）

1. 访问 [Google AI Studio](https://makersuite.google.com/app/apikey)
2. 使用你的 Google 账号登录
3. 点击 **"Create API Key"**
4. 选择一个 Google Cloud 项目（或创建新项目）
5. 复制生成的 API Key（格式类似：`AIzaSy...`）

**免费额度：**
- ✅ 每分钟 15 次请求
- ✅ 每天 1500 次请求
- ✅ 完全免费，无需信用卡

### 2. 在 Vercel 配置环境变量

#### 方式一：通过 Vercel Dashboard

1. 访问 [vercel.com/dashboard](https://vercel.com/dashboard)
2. 找到你的项目 `prd-review-system`
3. 点击项目，进入 **"Settings"** 标签
4. 在左侧菜单选择 **"Environment Variables"**
5. 添加新变量：
   - **Name:** `GEMINI_API_KEY`
   - **Value:** 粘贴你的 Gemini API Key
   - **Environment:** 选择 **All** (Production, Preview, Development)
6. 点击 **"Save"**

#### 方式二：通过 Vercel CLI

```bash
# 安装 Vercel CLI（如果还没安装）
npm i -g vercel

# 登录
vercel login

# 添加环境变量
vercel env add GEMINI_API_KEY
# 粘贴你的 API Key
# 选择环境：Production, Preview, Development (全选)
```

### 3. 重新部署

配置环境变量后，需要重新部署才能生效：

#### 方式一：自动部署
- 推送任何代码到 GitHub
- Vercel 会自动检测并重新部署

#### 方式二：手动部署
1. 在 Vercel Dashboard 中
2. 点击 **"Deployments"** 标签
3. 点击右上角的 **"Redeploy"**
4. 选择 **"Redeploy with existing Build Cache"**

### 4. 验证部署

部署完成后：

1. 访问你的网站 URL（例如：`https://prd-review-system.vercel.app`）
2. 上传一个测试文档（或使用 `public/sample-prd.md`）
3. 点击 **"开始免费评审"**
4. 如果出现评审进度，说明配置成功！

## ❌ 常见问题

### Q: 如何知道 API Key 是否配置正确？

**A:** 检查方法：
1. 在 Vercel Dashboard → Settings → Environment Variables
2. 应该能看到 `GEMINI_API_KEY` 变量（值会被隐藏）
3. 部署日志中不应该有 "GEMINI_API_KEY is not defined" 错误

### Q: 配置后还是不工作？

**A:** 检查清单：
- ✅ API Key 是否正确复制（没有多余空格）
- ✅ 环境变量名称是否正确：`GEMINI_API_KEY`（区分大小写）
- ✅ 是否重新部署了（配置后必须重新部署）
- ✅ 查看 Vercel 部署日志是否有错误信息

### Q: Gemini API 限流了怎么办？

**A:** 免费限额：
- 每分钟 15 次请求（6 个评委 < 15，完全够用）
- 如果高并发使用，可以升级到付费版本（非常便宜）

### Q: 可以使用其他 AI 吗？

**A:** 可以！代码支持：
- Google Gemini（当前）
- OpenAI GPT（需修改 API 调用）
- Anthropic Claude（需修改 API 调用）

修改 `app/api/review/route.ts` 即可切换。

## 🔧 本地开发测试

如果想在本地测试：

1. 创建 `.env.local` 文件：
   ```bash
   cp .env.local.example .env.local
   ```

2. 编辑 `.env.local`，添加你的 API Key：
   ```
   GEMINI_API_KEY=AIzaSy...你的API Key
   ```

3. 启动开发服务器：
   ```bash
   npm run dev
   ```

4. 访问 http://localhost:3000 测试

## 📊 监控使用量

查看 Gemini API 使用情况：

1. 访问 [Google Cloud Console](https://console.cloud.google.com)
2. 选择你的项目
3. 进入 **"APIs & Services" → "Dashboard"**
4. 查看 **"Generative Language API"** 的使用统计

## 🎉 完成！

配置完成后，你的 PRD 评审系统就完全可用了！

用户可以：
- ✅ 无需注册
- ✅ 无需付费
- ✅ 无需任何配置
- ✅ 直接上传 PRD 并获得免费评审

---

需要帮助？提交 Issue：https://github.com/sainasidike/prd-review-system/issues
