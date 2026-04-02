import { PRDDocument, ReviewResult } from './types';

/**
 * Demo PRD 文档
 */
export const DEMO_DOCUMENT: PRDDocument = {
  id: 'demo-doc-001',
  title: '产品需求文档：用户增长计划 v2.0',
  fileName: 'demo-prd.md',
  content: `# 产品需求文档：用户增长计划 v2.0

## 1. 产品背景

本产品旨在通过创新的用户增长策略，解决目前市场上用户留存率低的问题。

当前竞品分析显示，用户在使用 3 天后流失率高达 60%，导致获客成本居高不下。

## 2. 目标用户

目标用户为 25-35 岁的职场人士，具有以下特征：

- 有一定的消费能力
- 对效率工具有需求
- 活跃在社交媒体平台

## 3. 核心功能

### 3.1 功能 A

实现用户快速注册和登录，支持第三方账号绑定。

### 3.2 功能 B

提供个性化推荐算法，根据用户行为推送相关内容。

## 4. 技术实现

采用 React + Node.js 架构，部署在云服务器。

## 5. 运营策略

通过社交媒体推广和 KOL 合作，预计 3 个月内获取 10 万用户。

## 6. 时间规划

- Week 1-2: 设计阶段
- Week 3-6: 开发阶段
- Week 7-8: 测试和上线`,
  paragraphs: [
    { id: 1, type: 'heading', level: 1, content: '产品需求文档：用户增长计划 v2.0', startIndex: 0, endIndex: 30 },
    { id: 2, type: 'heading', level: 2, content: '1. 产品背景', startIndex: 32, endIndex: 45 },
    { id: 3, type: 'text', content: '本产品旨在通过创新的用户增长策略，解决目前市场上用户留存率低的问题。', startIndex: 47, endIndex: 92 },
    { id: 4, type: 'text', content: '当前竞品分析显示，用户在使用 3 天后流失率高达 60%，导致获客成本居高不下。', startIndex: 94, endIndex: 143 },
    { id: 5, type: 'heading', level: 2, content: '2. 目标用户', startIndex: 145, endIndex: 157 },
    { id: 6, type: 'text', content: '目标用户为 25-35 岁的职场人士，具有以下特征：', startIndex: 159, endIndex: 193 },
    { id: 7, type: 'list', content: '有一定的消费能力', startIndex: 195, endIndex: 208 },
    { id: 8, type: 'list', content: '对效率工具有需求', startIndex: 209, endIndex: 221 },
    { id: 9, type: 'list', content: '活跃在社交媒体平台', startIndex: 222, endIndex: 236 },
    { id: 10, type: 'heading', level: 2, content: '3. 核心功能', startIndex: 238, endIndex: 250 },
    { id: 11, type: 'heading', level: 3, content: '3.1 功能 A', startIndex: 252, endIndex: 263 },
    { id: 12, type: 'text', content: '实现用户快速注册和登录，支持第三方账号绑定。', startIndex: 265, endIndex: 293 },
    { id: 13, type: 'heading', level: 3, content: '3.2 功能 B', startIndex: 295, endIndex: 306 },
    { id: 14, type: 'text', content: '提供个性化推荐算法，根据用户行为推送相关内容。', startIndex: 308, endIndex: 336 },
    { id: 15, type: 'heading', level: 2, content: '4. 技术实现', startIndex: 338, endIndex: 350 },
    { id: 16, type: 'text', content: '采用 React + Node.js 架构，部署在云服务器。', startIndex: 352, endIndex: 386 },
    { id: 17, type: 'heading', level: 2, content: '5. 运营策略', startIndex: 388, endIndex: 400 },
    { id: 18, type: 'text', content: '通过社交媒体推广和 KOL 合作，预计 3 个月内获取 10 万用户。', startIndex: 402, endIndex: 442 },
    { id: 19, type: 'heading', level: 2, content: '6. 时间规划', startIndex: 444, endIndex: 456 },
    { id: 20, type: 'list', content: 'Week 1-2: 设计阶段', startIndex: 458, endIndex: 476 },
    { id: 21, type: 'list', content: 'Week 3-6: 开发阶段', startIndex: 477, endIndex: 495 },
    { id: 22, type: 'list', content: 'Week 7-8: 测试和上线', startIndex: 496, endIndex: 516 }
  ],
  createdAt: new Date('2024-01-01')
};

/**
 * Demo 评审结果（预生成）
 */
export const DEMO_REVIEW_RESULT: ReviewResult = {
  documentId: 'demo-doc-001',
  reviews: [
    {
      reviewerId: 'operation',
      reviewerName: '运营团队 Leader',
      icon: '🏃',
      color: '#10B981',
      comments: [
        {
          id: 'demo-comment-001',
          paragraphId: 4,
          quotedText: '流失率高达 60%',
          type: 'question',
          content: '缺少行业对比数据。建议补充同类产品的平均流失率，以及我们的目标流失率应该是多少，这样才能评估改进空间。',
          severity: 'high'
        },
        {
          id: 'demo-comment-002',
          paragraphId: 18,
          quotedText: '预计 3 个月内获取 10 万用户',
          type: 'concern',
          content: '目标用户量设定过于激进。建议分阶段设定里程碑：第1个月1万、第2个月3万、第3个月6万，并制定每个阶段的具体策略。',
          severity: 'high'
        },
        {
          id: 'demo-comment-003',
          paragraphId: 18,
          quotedText: 'KOL 合作',
          type: 'suggestion',
          content: '需要明确 KOL 选择标准、预算分配、效果评估指标。建议补充 KOL 矩阵：头部1-2个（品牌曝光）+ 腰部5-8个（精准转化）+ 长尾20+个（口碑传播）。',
          severity: 'medium'
        }
      ],
      timestamp: new Date('2024-01-01T10:00:00Z')
    },
    {
      reviewerId: 'brand',
      reviewerName: '品牌团队 Leader',
      icon: '💼',
      color: '#8B5CF6',
      comments: [
        {
          id: 'demo-comment-004',
          paragraphId: 3,
          quotedText: '创新的用户增长策略',
          type: 'question',
          content: '"创新"体现在哪里？建议明确创新点，比如是模式创新、渠道创新还是内容创新，否则品牌传播时缺乏差异化卖点。',
          severity: 'medium'
        },
        {
          id: 'demo-comment-005',
          paragraphId: 6,
          quotedText: '25-35 岁的职场人士',
          type: 'concern',
          content: '年龄跨度过大，25岁和35岁的职场人士需求差异明显。建议细分为：25-28岁（职场新人，注重成长）和30-35岁（职场骨干，注重效率），分别设计品牌沟通策略。',
          severity: 'high'
        },
        {
          id: 'demo-comment-006',
          paragraphId: 18,
          quotedText: '社交媒体推广',
          type: 'suggestion',
          content: '缺少品牌调性定位。建议明确：是专业严肃型、轻松活泼型还是科技前沿型？这将直接影响视觉设计、文案风格和平台选择。',
          severity: 'medium'
        }
      ],
      timestamp: new Date('2024-01-01T10:05:00Z')
    },
    {
      reviewerId: 'tech',
      reviewerName: '技术团队 Leader',
      icon: '💻',
      color: '#3B82F6',
      comments: [
        {
          id: 'demo-comment-007',
          paragraphId: 16,
          quotedText: 'React + Node.js 架构',
          type: 'concern',
          content: '技术栈过于简略。需要明确：前端框架版本（React 18？）、状态管理方案、后端框架（Express/Koa/Nest.js）、数据库选型（MySQL/PostgreSQL/MongoDB）、缓存方案（Redis）等。',
          severity: 'high'
        },
        {
          id: 'demo-comment-008',
          paragraphId: 16,
          quotedText: '部署在云服务器',
          type: 'question',
          content: '云服务商是哪家（AWS/阿里云/腾讯云）？容器化部署吗（Docker/K8s）？需要明确部署架构，以便评估成本和可扩展性。',
          severity: 'medium'
        },
        {
          id: 'demo-comment-009',
          paragraphId: 14,
          quotedText: '个性化推荐算法',
          type: 'concern',
          content: '推荐算法是自研还是使用第三方服务？如果自研，需要考虑：数据收集（埋点）、模型训练、实时推理的技术方案。建议先用规则引擎 + 协同过滤，后期再上深度学习。',
          severity: 'high'
        }
      ],
      timestamp: new Date('2024-01-01T10:10:00Z')
    },
    {
      reviewerId: 'product',
      reviewerName: '产品团队 Leader',
      icon: '📱',
      color: '#F59E0B',
      comments: [
        {
          id: 'demo-comment-010',
          paragraphId: 12,
          quotedText: '第三方账号绑定',
          type: 'question',
          content: '支持哪些第三方账号（微信/QQ/微博/Apple ID）？不同平台的用户画像差异大，需要明确优先级和开发顺序。',
          severity: 'medium'
        },
        {
          id: 'demo-comment-011',
          paragraphId: 14,
          quotedText: '根据用户行为推送相关内容',
          type: 'concern',
          content: '缺少推荐逻辑说明。需要定义：(1) 收集哪些行为数据（浏览/点击/收藏/分享）？(2) 推荐频率是多少？(3) 如何避免信息茧房？(4) 冷启动用户如何处理？',
          severity: 'high'
        },
        {
          id: 'demo-comment-012',
          paragraphId: 4,
          quotedText: '3 天后流失率高达 60%',
          type: 'suggestion',
          content: '既然发现了痛点，需要设计对应的留存策略。建议补充：Day 1 引导流程、Day 2-3 激励机制（新手任务/奖励）、Day 7 回访召回策略。',
          severity: 'high'
        }
      ],
      timestamp: new Date('2024-01-01T10:15:00Z')
    },
    {
      reviewerId: 'ux',
      reviewerName: '交互团队 Leader',
      icon: '🎨',
      color: '#EC4899',
      comments: [
        {
          id: 'demo-comment-013',
          paragraphId: 12,
          quotedText: '用户快速注册和登录',
          type: 'suggestion',
          content: '建议提供多种注册方式：(1) 手机号 + 验证码（最快）、(2) 邮箱注册（完整）、(3) 第三方一键登录（便捷）。需要设计清晰的选择引导，避免用户困惑。',
          severity: 'medium'
        },
        {
          id: 'demo-comment-014',
          paragraphId: 14,
          quotedText: '推送相关内容',
          type: 'concern',
          content: '推送需要精细化的交互设计：(1) 推送时机（避免打扰）、(2) 推送位置（弹窗/通知栏/信息流）、(3) 推送样式（卡片/横幅）、(4) 用户关闭推送后的降级方案。',
          severity: 'medium'
        },
        {
          id: 'demo-comment-015',
          paragraphId: 6,
          quotedText: '职场人士',
          type: 'suggestion',
          content: '职场人士使用场景多样：通勤时（碎片化）、午休（短暂）、下班后（深度）。建议设计适配不同场景的交互模式，比如"快速模式"和"深度模式"的切换。',
          severity: 'low'
        }
      ],
      timestamp: new Date('2024-01-01T10:20:00Z')
    },
    {
      reviewerId: 'bi',
      reviewerName: 'BI 团队 Leader',
      icon: '📊',
      color: '#06B6D4',
      comments: [
        {
          id: 'demo-comment-016',
          paragraphId: 4,
          quotedText: '流失率高达 60%',
          type: 'concern',
          content: '缺少数据埋点方案。需要定义：(1) 流失如何界定（3天未登录？7天？）、(2) 流失漏斗分析（注册→激活→留存各环节的流失率）、(3) 流失原因分类（产品/内容/体验）。',
          severity: 'high'
        },
        {
          id: 'demo-comment-017',
          paragraphId: 18,
          quotedText: '10 万用户',
          type: 'question',
          content: '需要明确关键指标体系：(1) 北极星指标是什么（DAU/MAU/留存率）？(2) 如何拆解到各渠道？(3) 数据看板需要展示哪些维度（渠道/时间/地域/设备）？',
          severity: 'high'
        },
        {
          id: 'demo-comment-018',
          paragraphId: 14,
          quotedText: '个性化推荐',
          type: 'suggestion',
          content: '推荐系统需要完整的数据闭环：(1) 曝光埋点（推荐了什么）、(2) 点击埋点（用户选了什么）、(3) 转化埋点（最终行为）、(4) 实时反馈指标（点击率/转化率）用于算法优化。',
          severity: 'medium'
        }
      ],
      timestamp: new Date('2024-01-01T10:25:00Z')
    }
  ],
  createdAt: new Date('2024-01-01T10:30:00Z')
};
