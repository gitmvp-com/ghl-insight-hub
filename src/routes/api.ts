import express from 'express';
import { GHLClient } from '../api/client.js';

const router = express.Router();

// Initialize GHL client
const getClient = () => {
  return new GHLClient({
    accessToken: process.env.GHL_API_KEY || '',
    locationId: process.env.GHL_LOCATION_ID || '',
    baseUrl: process.env.GHL_BASE_URL,
  });
};

// Rate limit info endpoint
router.get('/rate-limits', (req, res) => {
  try {
    const client = getClient();
    res.json(client.getRateLimitInfo());
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Contacts endpoints
router.get('/contacts', async (req, res) => {
  try {
    const client = getClient();
    const { limit = '20', skip = '0', query = '' } = req.query;
    
    const params = new URLSearchParams({
      locationId: client.locationId,
      limit: limit as string,
      skip: skip as string,
      ...(query && { query: query as string }),
    });
    
    const data = await client.get(`/contacts/?${params}`);
    res.json(data);
  } catch (error: any) {
    res.status(error.status || 500).json({ error: error.message });
  }
});

router.get('/contacts/:id', async (req, res) => {
  try {
    const client = getClient();
    const data = await client.get(`/contacts/${req.params.id}`);
    res.json(data);
  } catch (error: any) {
    res.status(error.status || 500).json({ error: error.message });
  }
});

router.post('/contacts', async (req, res) => {
  try {
    const client = getClient();
    const data = await client.post('/contacts/', {
      ...req.body,
      locationId: client.locationId,
    });
    res.json(data);
  } catch (error: any) {
    res.status(error.status || 500).json({ error: error.message });
  }
});

// Conversations endpoints
router.get('/conversations', async (req, res) => {
  try {
    const client = getClient();
    const { limit = '20' } = req.query;
    
    const params = new URLSearchParams({
      locationId: client.locationId,
      limit: limit as string,
    });
    
    const data = await client.get(`/conversations/search?${params}`);
    res.json(data);
  } catch (error: any) {
    res.status(error.status || 500).json({ error: error.message });
  }
});

router.get('/conversations/:id', async (req, res) => {
  try {
    const client = getClient();
    const data = await client.get(`/conversations/${req.params.id}`);
    res.json(data);
  } catch (error: any) {
    res.status(error.status || 500).json({ error: error.message });
  }
});

router.post('/conversations/:id/messages', async (req, res) => {
  try {
    const client = getClient();
    const data = await client.post(`/conversations/${req.params.id}/messages`, req.body);
    res.json(data);
  } catch (error: any) {
    res.status(error.status || 500).json({ error: error.message });
  }
});

// Opportunities endpoints
router.get('/opportunities', async (req, res) => {
  try {
    const client = getClient();
    const { limit = '20', pipelineId } = req.query;
    
    const params = new URLSearchParams({
      location_id: client.locationId,
      limit: limit as string,
      ...(pipelineId && { pipelineId: pipelineId as string }),
    });
    
    const data = await client.get(`/opportunities/search?${params}`);
    res.json(data);
  } catch (error: any) {
    res.status(error.status || 500).json({ error: error.message });
  }
});

router.get('/opportunities/pipelines', async (req, res) => {
  try {
    const client = getClient();
    const params = new URLSearchParams({
      locationId: client.locationId,
    });
    
    const data = await client.get(`/opportunities/pipelines?${params}`);
    res.json(data);
  } catch (error: any) {
    res.status(error.status || 500).json({ error: error.message });
  }
});

// Calendars endpoints
router.get('/calendars', async (req, res) => {
  try {
    const client = getClient();
    const params = new URLSearchParams({
      locationId: client.locationId,
    });
    
    const data = await client.get(`/calendars/?${params}`);
    res.json(data);
  } catch (error: any) {
    res.status(error.status || 500).json({ error: error.message });
  }
});

// Test endpoint
router.post('/test', async (req, res) => {
  try {
    const client = getClient();
    const { method, endpoint, body } = req.body;
    
    let data;
    switch (method.toUpperCase()) {
      case 'GET':
        data = await client.get(endpoint);
        break;
      case 'POST':
        data = await client.post(endpoint, body);
        break;
      case 'PUT':
        data = await client.put(endpoint, body);
        break;
      case 'DELETE':
        data = await client.delete(endpoint);
        break;
      default:
        throw new Error(`Unsupported method: ${method}`);
    }
    
    res.json({
      success: true,
      data,
      rateLimit: client.getRateLimitInfo(),
    });
  } catch (error: any) {
    res.status(error.status || 500).json({ 
      success: false,
      error: error.message,
      ...(error.response?.data && { details: error.response.data }),
    });
  }
});

export default router;
