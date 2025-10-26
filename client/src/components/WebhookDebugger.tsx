import React, { useState, useEffect } from 'react';
import { RefreshCw, Trash2, Eye } from 'lucide-react';

function WebhookDebugger() {
  const [webhooks, setWebhooks] = useState<any[]>([]);
  const [selectedWebhook, setSelectedWebhook] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const webhookUrl = `${window.location.origin}/webhooks/ghl`;

  useEffect(() => {
    fetchWebhooks();
    const interval = setInterval(fetchWebhooks, 3000);
    return () => clearInterval(interval);
  }, []);

  const fetchWebhooks = async () => {
    try {
      const res = await fetch('/webhooks');
      const data = await res.json();
      setWebhooks(data.webhooks || []);
    } catch (error) {
      console.error('Failed to fetch webhooks:', error);
    }
  };

  const clearWebhooks = async () => {
    if (!confirm('Clear all webhooks?')) return;
    
    setLoading(true);
    try {
      await fetch('/webhooks', { method: 'DELETE' });
      setWebhooks([]);
      setSelectedWebhook(null);
    } catch (error) {
      console.error('Failed to clear webhooks:', error);
    } finally {
      setLoading(false);
    }
  };

  const copyUrl = () => {
    navigator.clipboard.writeText(webhookUrl);
    alert('Webhook URL copied to clipboard!');
  };

  return (
    <div className="space-y-6">
      {/* Webhook URL */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Your Webhook URL</h3>
        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={webhookUrl}
            readOnly
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 font-mono text-sm"
          />
          <button
            onClick={copyUrl}
            className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
          >
            Copy URL
          </button>
        </div>
        <p className="mt-2 text-sm text-gray-600">
          Configure this URL in your GoHighLevel webhooks settings
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Webhooks List */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200 flex items-center justify-between">
            <h3 className="text-lg font-semibold">Received Webhooks ({webhooks.length})</h3>
            <div className="flex space-x-2">
              <button
                onClick={fetchWebhooks}
                className="p-2 text-gray-600 hover:text-gray-900 transition-colors"
                title="Refresh"
              >
                <RefreshCw className="w-5 h-5" />
              </button>
              <button
                onClick={clearWebhooks}
                disabled={loading || webhooks.length === 0}
                className="p-2 text-red-600 hover:text-red-700 transition-colors disabled:opacity-50"
                title="Clear all"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          </div>
          
          <div className="divide-y divide-gray-200 max-h-[600px] overflow-y-auto">
            {webhooks.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <p>No webhooks received yet</p>
                <p className="text-sm mt-2">Webhooks will appear here when received</p>
              </div>
            ) : (
              webhooks.map(webhook => (
                <div
                  key={webhook.id}
                  onClick={() => setSelectedWebhook(webhook)}
                  className={`p-4 cursor-pointer transition-colors ${
                    selectedWebhook?.id === webhook.id ? 'bg-primary-50' : 'hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-sm font-medium text-gray-900">
                        {webhook.type}
                      </span>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(webhook.timestamp).toLocaleString()}
                      </p>
                    </div>
                    <Eye className="w-4 h-4 text-gray-400" />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Webhook Details */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold">Webhook Details</h3>
          </div>
          
          <div className="p-6">
            {!selectedWebhook ? (
              <div className="text-center text-gray-500 py-12">
                <p>Select a webhook to view details</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Headers</h4>
                  <pre className="bg-gray-50 p-3 rounded-lg overflow-auto text-xs font-mono">
                    {JSON.stringify(selectedWebhook.headers, null, 2)}
                  </pre>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Body</h4>
                  <pre className="bg-gray-50 p-3 rounded-lg overflow-auto max-h-[400px] text-xs font-mono">
                    {JSON.stringify(selectedWebhook.body, null, 2)}
                  </pre>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default WebhookDebugger;
