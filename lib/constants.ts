import { Reviewer } from './types';

export const REVIEWERS: Reviewer[] = [
  {
    id: 'operation',
    name: '运营团队 Leader',
    icon: '🏃',
    color: '#10B981',
    focusAreas: ['用户增长', '市场推广', '运营策略', 'KPI指标'],
    description: '关注产品的市场推广、用户增长路径、运营成本和数据指标'
  },
  {
    id: 'brand',
    name: '品牌团队 Leader',
    icon: '💼',
    color: '#8B5CF6',
    focusAreas: ['品牌定位', '用户体验', '视觉呈现', '品牌调性'],
    description: '关注品牌定位的清晰度、用户感知和品牌一致性'
  },
  {
    id: 'tech',
    name: '技术团队 Leader',
    icon: '💻',
    color: '#3B82F6',
    focusAreas: ['技术可行性', '架构设计', '性能优化', '技术风险'],
    description: '关注技术实现难度、架构合理性、性能指标和技术债务'
  },
  {
    id: 'product',
    name: '产品团队 Leader',
    icon: '📱',
    color: '#F59E0B',
    focusAreas: ['产品逻辑', '功能完整性', '用户价值', '竞品分析'],
    description: '关注功能逻辑、需求完整性、用户价值和市场竞争力'
  },
  {
    id: 'ux',
    name: '交互团队 Leader',
    icon: '🎨',
    color: '#EC4899',
    focusAreas: ['交互设计', '用户流程', '可用性', '体验细节'],
    description: '关注用户流程的流畅性、交互的合理性和体验细节'
  },
  {
    id: 'bi',
    name: 'BI 团队 Leader',
    icon: '📊',
    color: '#06B6D4',
    focusAreas: ['数据埋点', '指标设计', '分析维度', '数据驱动'],
    description: '关注数据埋点方案、关键指标定义和数据分析能力'
  }
];

export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
export const SUPPORTED_FORMATS = ['.pdf', '.doc', '.docx', '.md', '.txt'];
export const MAX_PARAGRAPHS = 200;
export const CLAUDE_MODEL = 'claude-3-5-sonnet-20241022';
