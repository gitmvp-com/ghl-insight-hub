import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { WebSocketServer } from 'ws';
import { createServer } from 'http';
import apiRoutes from './routes/api.js';
import aiRoutes from './routes/ai.js';
import webhookRoutes from './routes/webhooks.js';
import { GHLApiMonitor } from './services/monitor.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Create HTTP server
const server = createServer(app);

// Initialize WebSocket server for real-time updates
const wss = new WebSocketServer({ server, path: '/ws' });

// Initialize API monitor
const monitor = new GHLApiMonitor(wss);

// Middleware
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? process.env.ALLOWED_ORIGINS?.split(',') 
    : '*',
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`${req.method} ${req.path} - ${res.statusCode} (${duration}ms)`);
    
    // Track in monitor
    monitor.trackRequest({
      method: req.method,
      path: req.path,
      statusCode: res.statusCode,
      duration,
      timestamp: new Date(),
    });
  });
  next();
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    ai: process.env.ENABLE_AI === 'true',
  });
});

// API routes
app.use('/api', apiRoutes);

// AI routes
app.use('/api/ai', aiRoutes);

// Webhook routes
app.use('/webhooks', webhookRoutes);

// Analytics endpoint
app.get('/api/analytics', (req, res) => {
  res.json(monitor.getAnalytics());
});

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  const publicPath = path.join(__dirname, 'public');
  app.use(express.static(publicPath));
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(publicPath, 'index.html'));
  });
}

// WebSocket connection handler
wss.on('connection', (ws) => {
  console.log('New WebSocket connection established');
  
  ws.on('message', (message) => {
    console.log('Received:', message.toString());
  });
  
  ws.on('close', () => {
    console.log('WebSocket connection closed');
  });
  
  // Send initial analytics
  ws.send(JSON.stringify({
    type: 'analytics',
    data: monitor.getAnalytics(),
  }));
});

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', err);
  
  monitor.trackError({
    path: req.path,
    error: err.message,
    timestamp: new Date(),
  });
  
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
});

// Start server
server.listen(PORT, () => {
  console.log('🚀 GHL Insight Hub Server with AI');
  console.log('=' .repeat(60));
  console.log(`🌐 Server running on: http://localhost:${PORT}`);
  console.log(`📊 Dashboard: http://localhost:${PORT}`);
  console.log(`🔌 WebSocket: ws://localhost:${PORT}/ws`);
  console.log(`📡 API: http://localhost:${PORT}/api`);
  console.log(`🪝 Webhooks: http://localhost:${PORT}/webhooks`);
  console.log('=' .repeat(60));
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`GHL API: ${process.env.GHL_BASE_URL}`);
  
  if (process.env.ENABLE_AI === 'true') {
    console.log('🤖 AI Features: ENABLED');
    console.log(`🧠 LLM Endpoint: ${process.env.LLM_ENDPOINT || 'http://localhost:8000/api/chat'}`);
    console.log(`💡 Model: NanoChat d20 (1.28B params)`);
    console.log(`⚡ Hardware: M2 Max (MPS)`);
  } else {
    console.log('🤖 AI Features: DISABLED');
    console.log('   Set ENABLE_AI=true in .env to enable');
  }
  
  console.log('=' .repeat(60));
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, closing server...');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('\nSIGINT received, closing server...');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});
