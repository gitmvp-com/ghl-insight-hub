# 🤖 GHL Insight Hub with AI/ML

> **AI-Powered GoHighLevel Intelligence** - Combining your custom NanoChat LLM with comprehensive GHL analytics, testing, and debugging.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18.3-blue.svg)](https://react.dev/)
[![AI](https://img.shields.io/badge/AI-NanoChat%201.28B-purple.svg)](https://github.com/yourusername/nanochat)

## 🎯 What This Does

GHL Insight Hub now includes **AI/ML capabilities** powered by your custom-trained NanoChat LLM (1.28B parameters) running locally on your M2 Max MacBook!

### 🆕 New AI Features

1. **🎯 AI Lead Scoring** - Intelligent contact quality analysis
2. **💬 Natural Language Q&A** - Ask questions about your GHL data in plain English
3. **🔍 Anomaly Detection** - Automatically detect unusual patterns and issues
4. **📈 Predictive Analytics** - Forecast opportunity win rates, churn, pipeline values
5. **✨ Smart Automation** - Get AI-powered workflow optimization suggestions

### 🧠 Your AI Stack

- **Model**: NanoChat d20 (checkpoint 681)
- **Parameters**: 1.28B (20 layers)
- **Size**: 1.9GB
- **Hardware**: M2 Max with MPS (Metal Performance Shaders)
- **Location**: `~/.cache/nanochat/chatsft_checkpoints/d20/model_000681.pt`

## 🚀 Quick Start with AI

### Step 1: Start Your NanoChat LLM

```bash
cd ~/nanochat
source .venv/bin/activate
python -m scripts.chat_web
```

Your model will be available at **http://localhost:8000**

### Step 2: Configure Environment

```bash
cp .env.ai .env
```

Edit `.env`:

```bash
# Enable AI features
ENABLE_AI=true

# Your NanoChat endpoint
LLM_ENDPOINT=http://localhost:8000/api/chat

# Your GHL credentials
GHL_API_KEY=your_api_key_here
GHL_LOCATION_ID=your_location_id_here
```

### Step 3: Start GHL Insight Hub

```bash
npm install
npm run dev
```

Visit **http://localhost:3000** and click on the **AI Insights** tab!

## 🎨 AI Features in Detail

### 1. AI Lead Scoring

**Analyze contact quality with your trained model:**

```typescript
POST /api/ai/score-contact
{
  "contactId": "abc123"
}

Response:
{
  "contactId": "abc123",
  "score": 85,
  "confidence": 78,
  "factors": [
    "High engagement rate",
    "Multiple active conversations",
    "Strong opportunity pipeline"
  ],
  "recommendation": "Schedule follow-up call within 24 hours"
}
```

**Use Cases:**
- Prioritize high-value leads
- Identify contacts needing attention
- Optimize sales team workflows
- Predict conversion probability

### 2. Natural Language Q&A

**Ask questions in plain English:**

```typescript
POST /api/ai/ask
{
  "question": "What are my top 10 most valuable leads from last week?",
  "context": { /* your GHL data */ }
}

Response:
{
  "answer": "Based on the data, here are your top 10 leads:\n\n1. John Smith - $50k opportunity, 85 lead score\n2. Jane Doe - $45k opportunity, 82 lead score\n..."
}
```

**Example Questions:**
- "Show me contacts who haven't been contacted in 30 days"
- "Which opportunities are most likely to close this week?"
- "Analyze my conversion rates by source"
- "What's the average deal size in my pipeline?"

### 3. Anomaly Detection

**Automatically detect issues:**

```typescript
POST /api/ai/detect-anomalies
{
  "analytics": {
    "requests": { "total": 1000, "errors": 150 },
    "endpoints": { ... }
  }
}

Response:
{
  "insights": [
    {
      "type": "anomaly",
      "title": "High Error Rate Detected",
      "description": "15% error rate is 3x higher than baseline",
      "confidence": 85,
      "timestamp": "2025-01-26T..."
    }
  ]
}
```

**What it Detects:**
- Unusual API usage spikes
- Error rate increases
- Performance degradation
- Data quality issues
- Workflow bottlenecks

### 4. Predictive Analytics

**Predict opportunity outcomes:**

```typescript
POST /api/ai/predict-win
{
  "opportunityId": "opp_123"
}

Response:
{
  "opportunityId": "opp_123",
  "winProbability": 75,
  "confidence": 82,
  "factors": [
    "Strong engagement from decision-maker",
    "High opportunity value",
    "Active in pipeline for optimal duration"
  ]
}
```

**Predictions Available:**
- Opportunity win probability
- Customer churn risk
- Best time to contact
- Pipeline value forecasts
- Conversion rate trends

### 5. Smart Automation

**Get workflow optimization suggestions:**

```typescript
POST /api/ai/insights
{
  "data": { /* workflow data */ },
  "dataType": "workflow"
}

Response:
{
  "insights": "Based on analysis of your workflow:\n\n1. Add 2-day delay between steps 3 and 4 to improve response rates\n2. Personalize email subject lines for 23% higher open rates\n3. Send messages at 10 AM for optimal engagement\n..."
}
```

## 📊 AI Dashboard

The new **AI Insights** tab includes:

1. **AI Status Widget** - Shows if your NanoChat LLM is connected
2. **Natural Language Q&A Interface** - Ask questions, get answers
3. **Lead Scoring Panel** - Score contacts with AI
4. **Insights Grid** - View AI-generated recommendations
5. **Setup Instructions** - Help getting started

## 🏗️ Architecture

```
┌─────────────────────────────────────┐
│   GHL Insight Hub Frontend          │
│   (React + TypeScript)              │
│   Port 3000                         │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│   Express Backend                   │
│   - API Routes                      │
│   - AI Routes (/api/ai/*)           │
│   - WebSocket Server                │
└──────────────┬──────────────────────┘
               │
               ├──────────────────────┐
               ▼                      ▼
┌──────────────────────┐  ┌──────────────────────┐
│  GHL API Client      │  │  AI Engine Service   │
│  (Axios + Retry)     │  │  (ai-engine.ts)      │
└──────────────────────┘  └──────────┬───────────┘
                                     ▼
                          ┌──────────────────────┐
                          │  NanoChat LLM        │
                          │  Port 8000           │
                          │  /api/chat           │
                          └──────────┬───────────┘
                                     ▼
                          ┌──────────────────────┐
                          │  M2 Max (MPS)        │
                          │  model_000681.pt     │
                          │  1.28B parameters    │
                          └──────────────────────┘
```

## 🔧 Configuration

### Environment Variables

```bash
# Required
GHL_API_KEY=your_ghl_private_integrations_api_key
GHL_LOCATION_ID=your_location_id

# AI Configuration
ENABLE_AI=true
LLM_ENDPOINT=http://localhost:8000/api/chat

# Optional
PORT=3000
NODE_ENV=development
```

### NanoChat Configuration

Your NanoChat web server should expose an API endpoint:

```python
# Expected endpoint: POST /api/chat
{
  "message": "Your prompt here",
  "context": "Optional JSON context",
  "temperature": 0.7,
  "max_tokens": 500
}

# Response:
{
  "response": "AI-generated response"
}
```

## 📈 Performance

### Model Performance
- **Response Time**: ~2-5 seconds per query
- **Memory Usage**: ~2GB (model loaded)
- **Concurrent Requests**: Limited by M2 Max GPU

### Optimization Tips

1. **Keep model warm**: Leave NanoChat server running
2. **Batch requests**: Score multiple contacts at once
3. **Cache results**: Lead scores don't change frequently
4. **Limit context**: Only send relevant data to the model

## 🛠️ Development

### File Structure

```
src/
├── services/
│   └── ai-engine.ts      # AI/ML integration logic
├── routes/
│   └── ai.ts             # AI API endpoints
client/src/
└── components/
    └── AIInsights.tsx    # AI dashboard component
```

### Adding Custom AI Features

Edit `src/services/ai-engine.ts`:

```typescript
public async customAIFeature(data: any): Promise<any> {
  const prompt = `Your custom prompt with ${data}`;
  const response = await this.queryLLM(prompt, data);
  return processResponse(response);
}
```

Add endpoint in `src/routes/ai.ts`:

```typescript
router.post('/custom', async (req, res) => {
  const result = await aiEngine.customAIFeature(req.body);
  res.json(result);
});
```

## 🔒 Security & Privacy

✅ **Your LLM runs 100% locally** - No data sent to external AI services  
✅ **GHL API keys stored in .env** - Never committed to git  
✅ **All processing on-device** - Full data privacy  
✅ **No external dependencies** - Your M2 Max handles everything  

## 🐛 Troubleshooting

### AI Service Not Available

```bash
# Check if NanoChat is running
curl http://localhost:8000/health

# Start NanoChat
cd ~/nanochat
source .venv/bin/activate
python -m scripts.chat_web
```

### Slow AI Responses

1. Reduce `max_tokens` in prompts
2. Simplify context data sent to model
3. Check M2 Max temperature (thermal throttling)
4. Close other intensive applications

### Model Not Loading

```bash
# Verify model exists
ls -lh ~/.cache/nanochat/chatsft_checkpoints/d20/model_000681.pt

# Expected size: ~1.9GB
```

## 📚 API Reference

See [SETUP_AI.md](./SETUP_AI.md) for complete API documentation.

### Quick Reference

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/ai/health` | GET | Check AI service status |
| `/api/ai/score-contact` | POST | Score single contact |
| `/api/ai/score-contacts` | POST | Batch score contacts |
| `/api/ai/ask` | POST | Natural language Q&A |
| `/api/ai/detect-anomalies` | POST | Detect anomalies |
| `/api/ai/predict-win` | POST | Predict opportunity win |
| `/api/ai/insights` | POST | Generate insights |

## 🎯 Next Steps

1. ✅ **Start NanoChat**: `cd ~/nanochat && source .venv/bin/activate && python -m scripts.chat_web`
2. ✅ **Configure .env**: Set `ENABLE_AI=true` and add GHL credentials
3. ✅ **Launch Dashboard**: `npm run dev`
4. 🧪 **Test AI Features**: Try lead scoring and natural language queries
5. 🎨 **Customize Prompts**: Edit `ai-engine.ts` for your use case
6. 📊 **Monitor Performance**: Track response times and accuracy

## 🤝 Contributing

Contributions welcome! Areas for improvement:
- Fine-tune prompts for better accuracy
- Add more AI-powered features
- Optimize model inference speed
- Implement caching strategies

## 📄 License

MIT License - see [LICENSE](LICENSE)

---

**🎉 You now have AI-powered GoHighLevel intelligence running 100% locally on your M2 Max!**

**Your AI Stack:**
- 🧠 NanoChat LLM (1.28B params)
- 💻 M2 Max (MPS acceleration)
- 🚀 GHL Insight Hub (This app)
- 📊 GoHighLevel API

**Result:** Intelligent, private, local-first CRM analytics! 🔥
