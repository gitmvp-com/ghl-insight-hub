import React, { useState, useEffect } from 'react';
import { Activity, Zap, TrendingUp, AlertCircle, TestTube, Webhook, BarChart3 } from 'lucide-react';
import Dashboard from './components/Dashboard';
import ApiTester from './components/ApiTester';
import WebhookDebugger from './components/WebhookDebugger';
import Analytics from './components/Analytics';

type Tab = 'dashboard' | 'api-tester' | 'webhooks' | 'analytics';

function App() {
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Check API connection
    fetch('/health')
      .then(res => res.json())
      .then(() => setIsConnected(true))
      .catch(() => setIsConnected(false));
  }, []);

  const tabs = [
    { id: 'dashboard' as Tab, label: 'Dashboard', icon: Activity },
    { id: 'api-tester' as Tab, label: 'API Tester', icon: TestTube },
    { id: 'webhooks' as Tab, label: 'Webhooks', icon: Webhook },
    { id: 'analytics' as Tab, label: 'Analytics', icon: BarChart3 },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div className="bg-primary-500 text-white p-2 rounded-lg">
                <Zap className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">GHL Insight Hub</h1>
                <p className="text-sm text-gray-500">GoHighLevel Dashboard & API Testing</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${
                  isConnected ? 'bg-green-500' : 'bg-red-500'
                }`}></div>
                <span className="text-sm text-gray-600">
                  {isConnected ? 'Connected' : 'Disconnected'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'dashboard' && <Dashboard />}
        {activeTab === 'api-tester' && <ApiTester />}
        {activeTab === 'webhooks' && <WebhookDebugger />}
        {activeTab === 'analytics' && <Analytics />}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-center text-sm text-gray-500">
            GHL Insight Hub - Identify and fix blindspots in GoHighLevel
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
