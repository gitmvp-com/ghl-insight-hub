import express from 'express';
import { WebhookStore } from '../services/webhook-store.js';

const router = express.Router();
const webhookStore = new WebhookStore();

// Catch-all webhook endpoint
router.post('/:type?', (req, res) => {
  const webhookType = req.params.type || 'default';
  
  const webhook = {
    id: `wh_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    type: webhookType,
    headers: req.headers,
    body: req.body,
    query: req.query,
    timestamp: new Date(),
  };
  
  webhookStore.add(webhook);
  
  console.log(`📥 Webhook received: ${webhookType}`);
  console.log(JSON.stringify(webhook, null, 2));
  
  res.status(200).json({ 
    success: true,
    message: 'Webhook received',
    id: webhook.id,
  });
});

// Get all webhooks
router.get('/', (req, res) => {
  const { limit = '50', type } = req.query;
  const webhooks = webhookStore.getAll(
    parseInt(limit as string),
    type as string
  );
  
  res.json({
    webhooks,
    total: webhookStore.getCount(),
  });
});

// Get webhook by ID
router.get('/:id', (req, res) => {
  const webhook = webhookStore.getById(req.params.id);
  
  if (!webhook) {
    return res.status(404).json({ error: 'Webhook not found' });
  }
  
  res.json(webhook);
});

// Clear all webhooks
router.delete('/', (req, res) => {
  const count = webhookStore.clear();
  res.json({ 
    success: true,
    cleared: count,
  });
});

export default router;
