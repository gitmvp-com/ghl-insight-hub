# AI/ML Setup Guide for GHL Insight Hub

## 🤖 Your Custom NanoChat LLM Integration

This guide explains how to integrate your locally-trained 1.28B parameter LLM with GHL Insight Hub.

## Model Details

- **Model**: Custom NanoChat LLM (d20 checkpoint)
- **Size**: 1.9GB (20 layers, 1.28B parameters)
- **Location**: `~/.cache/nanochat/chatsft_checkpoints/d20/model_000681.pt`
- **Hardware**: M2 Max MacBook using MPS (Metal Performance Shaders)
- **Training**: Step 681 checkpoint

### Benchmarks
- ARC-Easy: 39.14%
- ARC-Challenge: 29.44%
- MMLU: 31.63%
- GSM8K: 6.82%
- HumanEval: 4.88%

## Quick Start

### 1. Start Your NanoChat LLM

```bash
cd ~/nanochat
source .venv/bin/activate
python -m scripts.chat_web
```

Your model will be available at: **http://localhost:8000**

### 2. Configure GHL Insight Hub

Edit your `.env` file:

```bash
# Enable AI features
ENABLE_AI=true

# Your NanoChat LLM endpoint
LLM_ENDPOINT=http://localhost:8000/api/chat

# Your GHL credentials
GHL_API_KEY=your_api_key_here
GHL_LOCATION_ID=your_location_id_here
```

### 3. Start GHL Insight Hub

```bash
npm run dev
```

Visit: **http://localhost:3000**

## AI Features Available

### 1. 🎯 AI Lead Scoring

Analyze contact data and get:
- Lead quality score (0-100)
- Confidence rating
- Key factors affecting the score
- Recommended next actions

**How it works:**
Your NanoChat model analyzes:
- Contact engagement history
- Conversation patterns
- Opportunity data
- Tags and source information

**Example:**
```typescript
POST /api/ai/score-contact
{
  "contactId": "abc123"
}

Response:
{
  "score": 85,
  "confidence": 78,
  "factors": [
    "High engagement rate",
    "Multiple conversations",
    "Valuable opportunity pipeline"
  ],
  "recommendation": "Schedule follow-up call within 24 hours"
}
```

### 2. 💬 Natural Language Q&A

Ask questions about your GHL data in plain English:

**Example questions:**
- "What are my top 10 most valuable leads?"
- "Show me contacts who haven't been contacted in 30 days"
- "Which opportunities are most likely to close this week?"
- "Analyze my conversion rates by source"

**How it works:**
Your model receives the question + relevant GHL data context and generates natural language answers.

### 3. 🔍 Anomaly Detection

Automatically detect:
- Unusual API usage patterns
- Sudden spikes in errors
- Performance degradation
- Data quality issues

**Example:**
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
      "confidence": 85
    }
  ]
}
```

### 4. 📊 Predictive Analytics

Predict:
- Opportunity win probability
- Customer churn risk
- Best time to contact
- Pipeline value forecasts

**Example:**
```typescript
POST /api/ai/predict-win
{
  "opportunityId": "opp_123"
}

Response:
{
  "winProbability": 75,
  "confidence": 82,
  "factors": ["Strong engagement", "High value", "Active decision-maker"]
}
```

### 5. ✨ Smart Automation Suggestions

Get AI-powered workflow optimization suggestions:
- Improve conversion rates
- Reduce friction points
- Optimize message timing
- Enhance personalization

## API Endpoints

### Health Check
```bash
GET /api/ai/health
```

Returns AI service status and endpoint configuration.

### Score Contact
```bash
POST /api/ai/score-contact
Body: { "contactId": "string" }
```

### Batch Score Contacts
```bash
POST /api/ai/score-contacts
Body: { "contactIds": ["id1", "id2", ...] }
```

### Ask Question
```bash
POST /api/ai/ask
Body: { 
  "question": "string",
  "context": { /* optional */ }
}
```

### Detect Anomalies
```bash
POST /api/ai/detect-anomalies
Body: { "analytics": { /* analytics data */ } }
```

### Predict Win
```bash
POST /api/ai/predict-win
Body: { "opportunityId": "string" }
```

### Generate Insights
```bash
POST /api/ai/insights
Body: { 
  "data": { /* data to analyze */ },
  "dataType": "string"
}
```

## Architecture

```
GHL Insight Hub (Port 3000)
       ↓
    AI Engine Service
       ↓
NanoChat LLM (Port 8000)
       ↓
   M2 Max (MPS)
       ↓
model_000681.pt (1.28B params)
```

## Performance Tips

### Optimize Response Time

1. **Keep model warm**: Your NanoChat server should stay running
2. **Batch requests**: Use batch endpoints when scoring multiple contacts
3. **Cache results**: Lead scores don't change frequently
4. **Limit context**: Only send relevant data to the model

### Memory Management

Your M2 Max has sufficient memory for the 1.9GB model. Monitor with:

```bash
# Check memory usage
top -pid $(pgrep -f chat_web)
```

## Troubleshooting

### AI Service Not Available

**Check if NanoChat is running:**
```bash
curl http://localhost:8000/health
```

**Start NanoChat:**
```bash
cd ~/nanochat
source .venv/bin/activate
python -m scripts.chat_web
```

### Slow Responses

- Reduce max_tokens in prompts
- Simplify context data
- Check M2 Max temperature (thermal throttling)

### Model Not Loading

**Verify model file exists:**
```bash
ls -lh ~/.cache/nanochat/chatsft_checkpoints/d20/model_000681.pt
```

**Expected size:** ~1.9GB

## Advanced Usage

### Custom Prompts

Edit `src/services/ai-engine.ts` to customize prompts for your use case.

### Fine-tune for GHL

You can further fine-tune your model on GHL-specific data:

1. Export your GHL data
2. Format as training examples
3. Fine-tune using your existing NanoChat setup
4. Update checkpoint path in config

### Multi-Model Support

Run different models for different tasks:
- Lead scoring: Your current d20 model
- Text generation: Different checkpoint
- Classification: Specialized model

## Security Notes

- ⚠️ LLM runs locally on your M2 Max (no data sent to cloud)
- ⚠️ GHL API keys stored in .env (never commit)
- ⚠️ Implement rate limiting for production
- ⚠️ Validate all AI outputs before taking action

## Next Steps

1. ✅ Start NanoChat LLM
2. ✅ Configure .env file
3. ✅ Test AI features in dashboard
4. 🔄 Monitor performance
5. 🎯 Fine-tune prompts for your use case

## Support

If you encounter issues:

1. Check NanoChat logs: `~/nanochat/*.log`
2. Check GHL Insight Hub logs: Server console output
3. Verify API connectivity: `/api/ai/health`
4. Test model directly: Visit http://localhost:8000

---

**Your Custom AI Stack:**
- 🧠 NanoChat LLM (1.28B params)
- 💻 M2 Max (MPS acceleration)  
- 🚀 GHL Insight Hub (This app)
- 📊 GoHighLevel API

**Result:** Intelligent, local-first AI for your GoHighLevel data! 🎉
