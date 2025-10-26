import React, { useState } from 'react';
import { Play, Copy, Check } from 'lucide-react';

const ENDPOINTS = [
  { category: 'Contacts', endpoints: [
    { label: 'List Contacts', method: 'GET', path: '/api/contacts' },
    { label: 'Create Contact', method: 'POST', path: '/api/contacts', 
      body: { firstName: 'John', lastName: 'Doe', email: 'john@example.com' } },
  ]},
  { category: 'Conversations', endpoints: [
    { label: 'List Conversations', method: 'GET', path: '/api/conversations' },
  ]},
  { category: 'Opportunities', endpoints: [
    { label: 'List Opportunities', method: 'GET', path: '/api/opportunities' },
    { label: 'Get Pipelines', method: 'GET', path: '/api/opportunities/pipelines' },
  ]},
];

function ApiTester() {
  const [selectedEndpoint, setSelectedEndpoint] = useState(ENDPOINTS[0].endpoints[0]);
  const [requestBody, setRequestBody] = useState('');
  const [response, setResponse] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleTest = async () => {
    setLoading(true);
    setResponse(null);
    
    try {
      let res;
      if (selectedEndpoint.method === 'GET') {
        res = await fetch(selectedEndpoint.path);
      } else {
        const body = requestBody || JSON.stringify(selectedEndpoint.body || {});
        res = await fetch(selectedEndpoint.path, {
          method: selectedEndpoint.method,
          headers: { 'Content-Type': 'application/json' },
          body,
        });
      }
      
      const data = await res.json();
      setResponse({ status: res.status, data });
    } catch (error: any) {
      setResponse({ 
        status: 'error', 
        data: { error: error.message } 
      });
    } finally {
      setLoading(false);
    }
  };

  const copyResponse = () => {
    navigator.clipboard.writeText(JSON.stringify(response.data, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Left Panel - Configuration */}
      <div className="space-y-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">API Endpoint</h3>
          
          <div className="space-y-4">
            {ENDPOINTS.map(category => (
              <div key={category.category}>
                <h4 className="text-sm font-medium text-gray-700 mb-2">{category.category}</h4>
                <div className="space-y-2">
                  {category.endpoints.map((endpoint, i) => (
                    <button
                      key={i}
                      onClick={() => setSelectedEndpoint(endpoint)}
                      className={`w-full text-left px-4 py-2 rounded-lg border transition-colors ${
                        selectedEndpoint === endpoint
                          ? 'border-primary-500 bg-primary-50 text-primary-700'
                          : 'border-gray-200 hover:border-gray-300 text-gray-700'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm">{endpoint.label}</span>
                        <span className={`text-xs px-2 py-1 rounded ${
                          endpoint.method === 'GET' ? 'bg-blue-100 text-blue-700' :
                          endpoint.method === 'POST' ? 'bg-green-100 text-green-700' :
                          'bg-yellow-100 text-yellow-700'
                        }`}>
                          {endpoint.method}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {selectedEndpoint.method !== 'GET' && (
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-4">Request Body</h3>
            <textarea
              className="w-full h-48 p-3 border border-gray-300 rounded-lg font-mono text-sm"
              value={requestBody || JSON.stringify(selectedEndpoint.body || {}, null, 2)}
              onChange={(e) => setRequestBody(e.target.value)}
              placeholder="Enter JSON request body"
            />
          </div>
        )}

        <button
          onClick={handleTest}
          disabled={loading}
          className="w-full bg-primary-500 hover:bg-primary-600 text-white font-semibold py-3 px-4 rounded-lg flex items-center justify-center space-x-2 transition-colors disabled:opacity-50"
        >
          <Play className="w-5 h-5" />
          <span>{loading ? 'Testing...' : 'Test API Call'}</span>
        </button>
      </div>

      {/* Right Panel - Response */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <h3 className="text-lg font-semibold">Response</h3>
          {response && (
            <button
              onClick={copyResponse}
              className="text-sm text-gray-600 hover:text-gray-900 flex items-center space-x-1"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Copied!' : 'Copy'}</span>
            </button>
          )}
        </div>
        
        <div className="p-6">
          {!response && (
            <div className="text-center text-gray-500 py-12">
              <p>Run a test to see the response</p>
            </div>
          )}
          
          {response && (
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-gray-600">Status:</span>
                <span className={`px-3 py-1 text-sm font-semibold rounded-full ${
                  response.status < 300 ? 'bg-green-100 text-green-800' :
                  response.status < 400 ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {response.status}
                </span>
              </div>
              
              <pre className="bg-gray-50 p-4 rounded-lg overflow-auto max-h-[600px] text-sm font-mono">
                {JSON.stringify(response.data, null, 2)}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ApiTester;
