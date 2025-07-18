'use client';

import { useEffect, useState } from 'react';
import { ArrowLeft, CheckCircle, AlertCircle, Info } from 'lucide-react';
import Link from 'next/link';

export default function GADebugPage() {
  const [gaStatus, setGaStatus] = useState({
    loaded: false,
    configured: false,
    dataLayerLength: 0,
    lastEvent: null as any,
    events: [] as any[],
  });

  useEffect(() => {
    // 檢查 GA 狀態
    const checkGA = () => {
      const status = {
        loaded: typeof (window as any).gtag !== 'undefined',
        configured: typeof (window as any).dataLayer !== 'undefined',
        dataLayerLength: (window as any).dataLayer ? (window as any).dataLayer.length : 0,
        lastEvent: null,
        events: [],
      };

      // 監聽 dataLayer 變化
      if ((window as any).dataLayer) {
        const events = (window as any).dataLayer.filter((item: any) => 
          item[0] === 'event'
        );
        status.events = events.slice(-10); // 最後 10 個事件
        status.lastEvent = events[events.length - 1];
      }

      setGaStatus(status);
    };

    // 初始檢查
    checkGA();

    // 定期檢查
    const interval = setInterval(checkGA, 1000);

    return () => clearInterval(interval);
  }, []);

  const sendTestEvent = () => {
    if (typeof (window as any).gtag !== 'undefined') {
      (window as any).gtag('event', 'ga_debug_test', {
        event_category: 'testing',
        event_label: new Date().toISOString(),
        value: Math.random() * 100,
      });
      alert('測試事件已發送！請檢查下方的事件列表。');
    } else {
      alert('GA 尚未載入！');
    }
  };

  const checkRealTimeView = () => {
    window.open('https://analytics.google.com/analytics/web/', '_blank');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* 返回按鈕 */}
        <Link 
          href="/"
          className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          返回首頁
        </Link>

        <h1 className="text-3xl font-bold text-gray-800 mb-8">
          Google Analytics 除錯工具
        </h1>

        {/* GA 狀態卡片 */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">GA 狀態檢查</h2>
          
          <div className="space-y-3">
            <div className="flex items-center">
              {gaStatus.loaded ? (
                <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
              ) : (
                <AlertCircle className="w-5 h-5 text-red-500 mr-3" />
              )}
              <span className="text-gray-700">
                gtag 函數：{gaStatus.loaded ? '已載入' : '未載入'}
              </span>
            </div>

            <div className="flex items-center">
              {gaStatus.configured ? (
                <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
              ) : (
                <AlertCircle className="w-5 h-5 text-red-500 mr-3" />
              )}
              <span className="text-gray-700">
                dataLayer：{gaStatus.configured ? '已配置' : '未配置'}
              </span>
            </div>

            <div className="flex items-center">
              <Info className="w-5 h-5 text-blue-500 mr-3" />
              <span className="text-gray-700">
                dataLayer 長度：{gaStatus.dataLayerLength}
              </span>
            </div>
          </div>
        </div>

        {/* 測試功能 */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">測試功能</h2>
          
          <div className="flex gap-4">
            <button
              onClick={sendTestEvent}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            >
              發送測試事件
            </button>
            
            <button
              onClick={checkRealTimeView}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
            >
              開啟 GA 即時報告
            </button>
          </div>
        </div>

        {/* 最近事件 */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">最近事件（最多 10 個）</h2>
          
          {gaStatus.events.length > 0 ? (
            <div className="space-y-2">
              {gaStatus.events.map((event, index) => (
                <div key={index} className="p-3 bg-gray-50 rounded text-sm">
                  <div className="font-medium text-gray-700">
                    事件：{event[1]}
                  </div>
                  <pre className="text-xs text-gray-600 mt-1 overflow-x-auto">
                    {JSON.stringify(event[2], null, 2)}
                  </pre>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">尚無事件記錄</p>
          )}
        </div>

        {/* 檢查指南 */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4 text-blue-800">
            如何確認 GA 正在運作？
          </h2>
          
          <ol className="list-decimal list-inside space-y-3 text-gray-700">
            <li>
              <strong>檢查上方狀態：</strong>確保 gtag 和 dataLayer 都顯示「已載入/已配置」
            </li>
            <li>
              <strong>發送測試事件：</strong>點擊「發送測試事件」按鈕
            </li>
            <li>
              <strong>查看即時報告：</strong>
              <ul className="list-disc list-inside ml-5 mt-2 text-sm">
                <li>點擊「開啟 GA 即時報告」</li>
                <li>登入你的 Google Analytics 帳戶</li>
                <li>前往「即時」→「事件」</li>
                <li>應該能看到「ga_debug_test」事件</li>
              </ul>
            </li>
            <li>
              <strong>檢查瀏覽器控制台：</strong>
              <ul className="list-disc list-inside ml-5 mt-2 text-sm">
                <li>開啟開發者工具（F12）</li>
                <li>在控制台輸入：<code className="bg-gray-200 px-2 py-1 rounded">window.gaDebug.checkStatus()</code></li>
                <li>應該能看到 GA 狀態資訊</li>
              </ul>
            </li>
          </ol>
        </div>

        {/* GA 追蹤 ID 資訊 */}
        <div className="mt-6 text-center text-gray-600">
          <p>當前 GA4 追蹤 ID：<code className="bg-gray-200 px-2 py-1 rounded">G-CS0NRJ05FE</code></p>
        </div>
      </div>
    </div>
  );
} 