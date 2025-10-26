import express from 'express';
import { AIEngine } from '../services/ai-engine.js';
import { GHLClient } from '../api/client.js';

const router = express.Router();
const aiEngine = new AIEngine();

// Initialize GHL client
const getClient = () => {
  return new GHLClient({
    accessToken: process.env.GHL_API_KEY || '',
    locationId: process.env.GHL_LOCATION_ID || '',
    baseUrl: process.env.GHL_BASE_URL,
  });
};

// AI health check
router.get('/health', async (req, res) => {
  try {
    const isHealthy = await aiEngine.healthCheck();
    res.json({ 
      healthy: isHealthy,
      endpoint: process.env.LLM_ENDPOINT || 'http://localhost:8000/api/chat',
      enabled: process.env.ENABLE_AI === 'true',
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Score a contact
router.post('/score-contact', async (req, res) => {
  try {
    const { contactId } = req.body;
    
    if (!contactId) {
      return res.status(400).json({ error: 'contactId required' });
    }
    
    // Fetch contact from GHL
    const client = getClient();
    const contact = await client.get(`/contacts/${contactId}`);
    
    // Score with AI
    const score = await aiEngine.scoreContact(contact);
    
    res.json(score);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Batch score contacts
router.post('/score-contacts', async (req, res) => {
  try {
    const { contactIds } = req.body;
    
    if (!contactIds || !Array.isArray(contactIds)) {
      return res.status(400).json({ error: 'contactIds array required' });
    }
    
    const client = getClient();
    const scores = [];
    
    for (const contactId of contactIds.slice(0, 10)) { // Limit to 10
      try {
        const contact = await client.get(`/contacts/${contactId}`);
        const score = await aiEngine.scoreContact(contact);
        scores.push(score);
      } catch (error) {
        console.error(`Failed to score contact ${contactId}:`, error);
      }
    }
    
    res.json({ scores });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Detect anomalies in analytics
router.post('/detect-anomalies', async (req, res) => {
  try {
    const { analytics } = req.body;
    
    if (!analytics) {
      return res.status(400).json({ error: 'analytics data required' });
    }
    
    const insights = await aiEngine.detectAnomalies(analytics);
    
    res.json({ insights });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Predict opportunity win
router.post('/predict-win', async (req, res) => {
  try {
    const { opportunityId } = req.body;
    
    if (!opportunityId) {
      return res.status(400).json({ error: 'opportunityId required' });
    }
    
    const client = getClient();
    const opportunity = await client.get(`/opportunities/${opportunityId}`);
    
    const probability = await aiEngine.predictOpportunityWin(opportunity);
    
    res.json({ 
      opportunityId,
      winProbability: probability,
      confidence: 75,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Answer natural language question
router.post('/ask', async (req, res) => {
  try {
    const { question, context } = req.body;
    
    if (!question) {
      return res.status(400).json({ error: 'question required' });
    }
    
    const answer = await aiEngine.answerQuestion(question, context || {});
    
    res.json({ question, answer });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Generate insights
router.post('/insights', async (req, res) => {
  try {
    const { data, dataType } = req.body;
    
    if (!data || !dataType) {
      return res.status(400).json({ error: 'data and dataType required' });
    }
    
    const insights = await aiEngine.generateInsights(data, dataType);
    
    res.json({ insights });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
