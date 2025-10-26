import { WebSocketServer } from 'ws';

interface RequestLog {
  method: string;
  path: string;
  statusCode: number;
  duration: number;
  timestamp: Date;
}

interface ErrorLog {
  path: string;
  error: string;
  timestamp: Date;
}

interface Analytics {
  requests: {
    total: number;
    success: number;
    errors: number;
    avgDuration: number;
  };
  recentRequests: RequestLog[];
  recentErrors: ErrorLog[];
  endpoints: Record<string, {
    count: number;
    avgDuration: number;
    errors: number;
  }>;
}

export class GHLApiMonitor {
  private requests: RequestLog[] = [];
  private errors: ErrorLog[] = [];
  private maxLogs = 1000;
  private wss: WebSocketServer;

  constructor(wss: WebSocketServer) {
    this.wss = wss;
  }

  trackRequest(log: RequestLog) {
    this.requests.push(log);
    
    // Keep only recent logs
    if (this.requests.length > this.maxLogs) {
      this.requests = this.requests.slice(-this.maxLogs);
    }
    
    // Broadcast update
    this.broadcast('request', log);
  }

  trackError(log: ErrorLog) {
    this.errors.push(log);
    
    if (this.errors.length > this.maxLogs) {
      this.errors = this.errors.slice(-this.maxLogs);
    }
    
    this.broadcast('error', log);
  }

  private broadcast(type: string, data: any) {
    const message = JSON.stringify({ type, data });
    
    this.wss.clients.forEach((client) => {
      if (client.readyState === 1) { // OPEN
        client.send(message);
      }
    });
  }

  getAnalytics(): Analytics {
    const total = this.requests.length;
    const success = this.requests.filter(r => r.statusCode < 400).length;
    const errors = total - success;
    
    const avgDuration = total > 0
      ? this.requests.reduce((sum, r) => sum + r.duration, 0) / total
      : 0;
    
    // Aggregate by endpoint
    const endpoints: Record<string, { count: number; avgDuration: number; errors: number }> = {};
    
    this.requests.forEach(req => {
      const endpoint = `${req.method} ${req.path}`;
      
      if (!endpoints[endpoint]) {
        endpoints[endpoint] = { count: 0, avgDuration: 0, errors: 0 };
      }
      
      endpoints[endpoint].count++;
      endpoints[endpoint].avgDuration += req.duration;
      
      if (req.statusCode >= 400) {
        endpoints[endpoint].errors++;
      }
    });
    
    // Calculate averages
    Object.keys(endpoints).forEach(key => {
      endpoints[key].avgDuration /= endpoints[key].count;
    });
    
    return {
      requests: {
        total,
        success,
        errors,
        avgDuration: Math.round(avgDuration),
      },
      recentRequests: this.requests.slice(-20).reverse(),
      recentErrors: this.errors.slice(-10).reverse(),
      endpoints,
    };
  }
}
