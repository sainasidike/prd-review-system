'use client';

import { useState, useEffect } from 'react';
import { useReviewStore } from '@/stores/reviewStore';
import { loadAPIKey, saveAPIKey, clearAPIKey } from '@/lib/storage';

export default function APIKeyInput() {
  const [key, setKey] = useState('');
  const [remember, setRemember] = useState(false);
  const [showKey, setShowKey] = useState(false);
  const setApiKey = useReviewStore(state => state.setApiKey);

  useEffect(() => {
    const savedKey = loadAPIKey();
    if (savedKey) {
      setKey(savedKey);
      setRemember(true);
      setApiKey(savedKey);
    }
  }, [setApiKey]);

  const handleSave = () => {
    saveAPIKey(key, remember);
    setApiKey(key);
  };

  const handleClear = () => {
    clearAPIKey();
    setKey('');
    setRemember(false);
    setApiKey('');
  };

  return (
    <div className="max-w-2xl mx-auto mt-8 p-6 bg-white rounded-lg border border-gray-200">
      <h3 className="text-lg font-semibold mb-4">🔑 Claude API Key</h3>

      <div className="space-y-4">
        <div className="relative">
          <input
            type={showKey ? 'text' : 'password'}
            value={key}
            onChange={(e) => setKey(e.target.value)}
            placeholder="sk-ant-api03-..."
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-20"
          />
          <button
            onClick={() => setShowKey(!showKey)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
          >
            {showKey ? '👁️' : '👁️‍🗨️'}
          </button>
        </div>

        <label className="flex items-center space-x-2 text-sm text-gray-600">
          <input
            type="checkbox"
            checked={remember}
            onChange={(e) => setRemember(e.target.checked)}
            className="rounded"
          />
          <span>记住 API Key（仅保存在本地浏览器）</span>
        </label>

        <div className="flex gap-3">
          <button
            onClick={handleSave}
            disabled={!key}
            className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            保存
          </button>
          <button
            onClick={handleClear}
            className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            清除
          </button>
        </div>

        <div className="text-xs text-gray-500 bg-gray-50 p-3 rounded">
          <p>🔒 API Key 安全说明：</p>
          <ul className="list-disc list-inside mt-1 space-y-1">
            <li>仅存储在浏览器本地，不上传到任何服务器</li>
            <li>评审费用由您的 API Key 承担（约 $0.01-0.05/次）</li>
            <li>在 <a href="https://console.anthropic.com" target="_blank" className="text-blue-600 hover:underline">Anthropic Console</a> 获取 API Key</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
