import React, { useState, useEffect } from 'react';
import { Brain, Sparkles, TrendingUp, AlertTriangle, MessageSquare, Target } from 'lucide-react';

function AIInsights() {
  const [aiHealth, setAiHealth] = useState<any>(null);
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);
  const [insights, setInsights] = useState<any[]>([]);
  const [selectedContact, setSelectedContact] = useState('');
  const [contactScore, setContactScore] = useState<any>(null);

  useEffect(() => {
    checkAIHealth();
  }, []);

  const checkAIHealth = async () => {
    try {
      const res = await fetch('/api/ai/health');
      const data = await res.json();
      setAiHealth(data);
    } catch (error) {
      console.error('Failed to check AI health:', error);
    }
  };

  const handleAsk = async () => {
    if (!question.trim()) return;
    
    setLoading(true);
    setAnswer('');
    
    try {
      const res = await fetch('/api/ai/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          question,
          context: { /* Add relevant context */ }
        }),
      });
      
      const data = await res.json();
      setAnswer(data.answer);
    } catch (error: any) {
      setAnswer(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const scoreContact = async () => {
    if (!selectedContact) return;
    
    setLoading(true);
    try {
      const res = await fetch('/api/ai/score-contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contactId: selectedContact }),
      });
      
      const data = await res.json();
      setContactScore(data);
    } catch (error: any) {
      console.error('Failed to score contact:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* AI Status */}
      <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg shadow-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Brain className="w-8 h-8" />
            <div>
              <h2 className="text-2xl font-bold">AI-Powered Insights</h2>
              <p className="text-purple-100">Using your custom NanoChat LLM (1.28B params)</p>
            </div>
          </div>
          <div className="text-right">
            <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${
              aiHealth?.healthy ? 'bg-green-500' : 'bg-red-500'
            }`}>
              <div className="w-2 h-2 rounded-full bg-white mr-2"></div>
              {aiHealth?.healthy ? 'AI Online' : 'AI Offline'}
            </div>
            <p className="text-xs mt-1 text-purple-100">
              {aiHealth?.endpoint || 'localhost:8000'}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Natural Language Q&A */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold flex items-center">
              <MessageSquare className="w-5 h-5 mr-2 text-purple-500" />
              Ask Your AI Assistant
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              Ask questions about your GoHighLevel data in natural language
            </p>
          </div>
          
          <div className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your Question
              </label>
              <textarea
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                rows={3}
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="e.g., What are the most valuable contacts from last week?"
              />
            </div>
            
            <button
              onClick={handleAsk}
              disabled={loading || !aiHealth?.healthy}
              className="w-full bg-purple-500 hover:bg-purple-600 text-white font-semibold py-3 px-4 rounded-lg flex items-center justify-center space-x-2 transition-colors disabled:opacity-50"
            >
              <Sparkles className="w-5 h-5" />
              <span>{loading ? 'Thinking...' : 'Ask AI'}</span>
            </button>
            
            {answer && (
              <div className="mt-4 p-4 bg-purple-50 border border-purple-200 rounded-lg">
                <h4 className="font-semibold text-purple-900 mb-2">AI Response:</h4>
                <p className="text-gray-700 whitespace-pre-wrap">{answer}</p>
              </div>
            )}
          </div>
        </div>

        {/* Lead Scoring */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold flex items-center">
              <Target className="w-5 h-5 mr-2 text-green-500" />
              AI Lead Scoring
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              Intelligent lead quality analysis powered by your trained model
            </p>
          </div>
          
          <div className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contact ID
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                value={selectedContact}
                onChange={(e) => setSelectedContact(e.target.value)}
                placeholder="Enter contact ID"
              />
            </div>
            
            <button
              onClick={scoreContact}
              disabled={loading || !selectedContact || !aiHealth?.healthy}
              className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-4 rounded-lg flex items-center justify-center space-x-2 transition-colors disabled:opacity-50"
            >
              <TrendingUp className="w-5 h-5" />
              <span>{loading ? 'Analyzing...' : 'Score Contact'}</span>
            </button>
            
            {contactScore && (
              <div className="mt-4 space-y-3">
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-green-900">Lead Score</span>
                    <span className="text-2xl font-bold text-green-600">
                      {contactScore.score}/100
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-500 h-2 rounded-full transition-all"
                      style={{ width: `${contactScore.score}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-600 mt-2">
                    Confidence: {contactScore.confidence}%
                  </p>
                </div>
                
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">Key Factors:</h4>
                  <ul className="space-y-1">
                    {contactScore.factors.map((factor: string, i: number) => (
                      <li key={i} className="text-sm text-gray-700 flex items-start">
                        <span className="text-green-500 mr-2">•</span>
                        {factor}
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <h4 className="font-semibold text-blue-900 mb-1">Recommendation:</h4>
                  <p className="text-sm text-gray-700">{contactScore.recommendation}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* AI Insights Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="bg-purple-100 p-3 rounded-lg">
              <Brain className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Predictive Analytics</h3>
              <p className="text-xs text-gray-500">Forecast conversions</p>
            </div>
          </div>
          <p className="text-sm text-gray-600">
            AI-powered predictions for opportunity win rates, customer churn, and pipeline values.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="bg-yellow-100 p-3 rounded-lg">
              <AlertTriangle className="w-6 h-6 text-yellow-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Anomaly Detection</h3>
              <p className="text-xs text-gray-500">Spot issues early</p>
            </div>
          </div>
          <p className="text-sm text-gray-600">
            Automatically detect unusual patterns in API usage, data quality, and workflow performance.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="bg-blue-100 p-3 rounded-lg">
              <Sparkles className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Smart Automation</h3>
              <p className="text-xs text-gray-500">Optimize workflows</p>
            </div>
          </div>
          <p className="text-sm text-gray-600">
            Get AI-powered suggestions to improve workflows, timing, and personalization.
          </p>
        </div>
      </div>

      {/* Setup Instructions */}
      {!aiHealth?.healthy && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <div className="flex items-start space-x-3">
            <AlertTriangle className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-semibold text-yellow-900 mb-2">AI Service Not Connected</h3>
              <p className="text-sm text-yellow-800 mb-3">
                Your NanoChat LLM is not running. Start it with:
              </p>
              <pre className="bg-yellow-100 p-3 rounded text-xs font-mono">
cd ~/nanochat
source .venv/bin/activate
python -m scripts.chat_web
              </pre>
              <p className="text-xs text-yellow-700 mt-2">
                Then set <code className="bg-yellow-100 px-1 rounded">ENABLE_AI=true</code> in your .env file
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AIInsights;
