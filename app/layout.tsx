import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'PRD 智能评审系统',
  description: 'AI 驱动的产品需求文档多角度评审工具',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <body className="noise-bg">{children}</body>
    </html>
  );
}
