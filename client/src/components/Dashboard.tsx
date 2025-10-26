import React, { useState, useEffect } from 'react';
import { Activity, TrendingUp, AlertCircle, Zap, Clock } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface RateLimit {
  daily: number;
  burst: number;
  dailyRemaining: number;
  burstRemaining: number;
}

function Dashboard() {
  const [rateLimit, setRateLimit] = useState<RateLimit | null>(null);
  const [analytics, setAnalytics] = useState<any>(null);

  useEffect(() => {
    fetchRateLimit();
    fetchAnalytics();
    
    const interval = setInterval(() => {
      fetchRateLimit();
      fetchAnalytics();
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);

  const fetchRateLimit = async () => {
    try {
      const res = await fetch('/api/rate-limits');
      const data = await res.json();
      setRateLimit(data);
    } catch (error) {
      console.error('Failed to fetch rate limits:', error);
    }
  };

  const fetchAnalytics = async () => {
    try {
      const res = await fetch('/api/analytics');
      const data = await res.json();
      setAnalytics(data);
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
    }
  };

  const dailyUsagePercent = rateLimit 
    ? ((rateLimit.daily - rateLimit.dailyRemaining) / rateLimit.daily) * 100
    : 0;

  const burstUsagePercent = rateLimit
    ? ((rateLimit.burst - rateLimit.burstRemaining) / rateLimit.burst) * 100
    : 0;

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Requests"
          value={analytics?.requests?.total || 0}
          icon={Activity}
          color="blue"
        />
        <StatsCard
          title="Success Rate"
          value={analytics?.requests?.total ? 
            `${Math.round((analytics.requests.success / analytics.requests.total) * 100)}%` : '0%'}
          icon={TrendingUp}
          color="green"
        />
        <StatsCard
          title="Errors"
          value={analytics?.requests?.errors || 0}
          icon={AlertCircle}
          color="red"
        />
        <StatsCard
          title="Avg Response"
          value={`${analytics?.requests?.avgDuration || 0}ms`}
          icon={Clock}
          color="purple"
        />
      </div>

      {/* Rate Limits */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <Zap className="w-5 h-5 mr-2 text-primary-500" />
            Daily Rate Limit
          </h3>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Used</span>
              <span className="font-medium">
                {rateLimit ? (rateLimit.daily - rateLimit.dailyRemaining).toLocaleString() : 0}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div 
                className="bg-primary-500 h-2.5 rounded-full transition-all"
                style={{ width: `${dailyUsagePercent}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Remaining</span>
              <span className="font-medium text-primary-600">
                {rateLimit?.dailyRemaining.toLocaleString() || 0}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <Zap className="w-5 h-5 mr-2 text-warning-500" />
            Burst Rate Limit
          </h3>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Used</span>
              <span className="font-medium">
                {rateLimit ? (rateLimit.burst - rateLimit.burstRemaining) : 0}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div 
                className={`h-2.5 rounded-full transition-all ${
                  burstUsagePercent > 80 ? 'bg-danger-500' : 'bg-warning-500'
                }`}
                style={{ width: `${burstUsagePercent}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Remaining</span>
              <span className="font-medium text-warning-600">
                {rateLimit?.burstRemaining || 0}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold">Recent API Calls</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Method</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Path</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Duration</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {analytics?.recentRequests?.map((req: any, i: number) => (
                <tr key={i} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-medium text-gray-900">{req.method}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {req.path}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      req.statusCode < 300 ? 'bg-green-100 text-green-800' :
                      req.statusCode < 400 ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {req.statusCode}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {req.duration}ms
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {new Date(req.timestamp).toLocaleTimeString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function StatsCard({ title, value, icon: Icon, color }: any) {
  const colors = {
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    red: 'bg-red-500',
    purple: 'bg-purple-500',
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600 mb-1">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
        <div className={`${colors[color as keyof typeof colors]} p-3 rounded-lg`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
