# GHL Insight Hub 🚀

> **Identify and fix blindspots in GoHighLevel** - A comprehensive dashboard with visual API testing, real-time analytics, webhook debugging, and multi-location management.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18.3-blue.svg)](https://react.dev/)

## 🎯 What This Solves

GoHighLevel is powerful, but has several **blindspots**:

1. ❌ **No visual API testing interface** - Hard to test endpoints
2. ❌ **Limited rate limit visibility** - You hit limits without warning
3. ❌ **Poor webhook debugging** - Webhook failures are invisible
4. ❌ **No multi-location dashboard** - Managing multiple sub-accounts is painful
5. ❌ **Missing analytics** - No insights into API usage patterns
6. ❌ **Complex error tracking** - API errors are hard to diagnose

**GHL Insight Hub fixes all of these!** ✅

## ✨ Key Features

### 📊 Real-Time Analytics Dashboard
- Monitor API call volume and patterns
- Track rate limit usage (daily & burst)
- View success/error rates by endpoint
- Identify bottlenecks and slowdowns

### 🧪 Visual API Testing Interface
- Test all GoHighLevel API endpoints visually
- Pre-configured request templates
- Real-time response visualization
- Save and reuse test configurations

### 🔍 Webhook Debugger
- Capture and inspect all incoming webhooks
- Replay webhook payloads for testing
- View webhook delivery history
- Debug failed webhook deliveries

### 🏢 Multi-Location Management
- Switch between multiple sub-accounts
- Compare performance across locations
- Bulk operations across locations
- Centralized configuration management

### 📈 Performance Monitoring
- API response time tracking
- Error rate monitoring
- Endpoint usage statistics
- Historical trend analysis

### 🔔 Smart Alerts
- Rate limit warnings
- Error spike detection
- Webhook failure notifications
- Performance degradation alerts

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ installed
- GoHighLevel account with API access
- Private Integrations API key (not regular API key!)

### Installation

```bash
# Clone the repository
git clone https://github.com/gitmvp-com/ghl-insight-hub.git
cd ghl-insight-hub

# Install dependencies
npm install

# Configure environment variables
cp .env.example .env
# Edit .env with your GHL credentials

# Start development server
npm run dev
```

### Getting Your API Key

1. Login to GoHighLevel
2. Go to **Settings** → **Integrations** → **Private Integrations**
3. Create new integration with required scopes:
   - contacts.readonly, contacts.write
   - conversations.readonly, conversations.write
   - opportunities.readonly, opportunities.write
   - calendars.readonly, calendars.write
   - locations.readonly
4. Copy the Private API Key to `.env`

### Usage

```bash
# Development mode with hot reload
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run tests
npm test
```

Open http://localhost:3000 in your browser.

## 📖 Documentation

### Dashboard Overview

The main dashboard provides:
- **API Health Status** - Real-time API connectivity
- **Rate Limit Monitor** - Daily and burst limit tracking
- **Recent Activity** - Latest API calls and webhooks
- **Error Log** - Failed requests with details

### API Testing Interface

1. Select endpoint category (Contacts, Conversations, etc.)
2. Choose specific endpoint
3. Fill in required parameters
4. Click "Test API Call"
5. View formatted response

### Webhook Debugging

1. Navigate to Webhooks tab
2. Copy your webhook URL
3. Configure in GoHighLevel
4. View incoming webhooks in real-time
5. Replay or inspect payloads

### Multi-Location Setup

1. Add location IDs in Settings
2. Switch between locations using dropdown
3. View aggregated analytics
4. Compare performance metrics

## 🏗️ Architecture

```
ghl-insight-hub/
├── client/               # React frontend
│   ├── src/
│   │   ├── components/  # UI components
│   │   ├── hooks/       # Custom React hooks
│   │   ├── services/    # API service layer
│   │   └── App.tsx      # Main app component
│   └── index.html
├── src/                 # Node.js backend
│   ├── api/            # API client
│   ├── routes/         # Express routes
│   ├── services/       # Business logic
│   ├── utils/          # Utilities
│   └── server.ts       # Express server
├── package.json
└── README.md
```

## 🔧 API Client

Built on top of the proven `ghl-sdk` pattern with:
- Automatic retry logic
- Rate limit handling
- Error recovery
- Request/response logging

```typescript
import { GHLClient } from './api/client';

const client = new GHLClient({
  accessToken: process.env.GHL_API_KEY,
  locationId: process.env.GHL_LOCATION_ID
});

// All endpoints available
const contacts = await client.contacts.find();
```

## 🎨 Tech Stack

**Frontend:**
- React 18.3 with TypeScript
- TailwindCSS for styling
- Recharts for analytics visualization
- Lucide React for icons

**Backend:**
- Node.js with Express 5
- TypeScript for type safety
- Axios with retry logic
- WebSocket for real-time updates

**Dependencies:**
- Same versions as `ghl-sdk` (proven & tested)
- `axios: ^1.7.9`
- `axios-retry: ^4.5.0`
- Rate limiting based on GHL API specs

## 🧪 Testing

```bash
# Run unit tests
npm test

# Run with coverage
npm test -- --coverage

# Watch mode
npm test -- --watch
```

## 🚀 Deployment

### Vercel (Recommended)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/gitmvp-com/ghl-insight-hub)

### Railway

[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/template/ghl-insight-hub)

### Docker

```bash
# Build image
docker build -t ghl-insight-hub .

# Run container
docker run -p 3000:3000 \
  -e GHL_API_KEY=your_key \
  -e GHL_LOCATION_ID=your_location \
  ghl-insight-hub
```

## 🤝 Contributing

Contributions are welcome!

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing`)
5. Open a Pull Request

## 📄 License

MIT License - see [LICENSE](LICENSE) for details.

## 🙏 Credits

Built upon insights from:
- [mastanley13/GoHighLevel-MCP](https://github.com/mastanley13/GoHighLevel-MCP)
- [adkonghq/ghl-sdk](https://github.com/adkonghq/ghl-sdk)
- [basicmachines-co/open-ghl-mcp](https://github.com/basicmachines-co/open-ghl-mcp)
- [SarabpreetBedi/-Lovable-GoHighLevel-n8n-automation.](https://github.com/SarabpreetBedi/-Lovable-GoHighLevel-n8n-automation.)

## 🆘 Support

- 📖 [Documentation](https://github.com/gitmvp-com/ghl-insight-hub/wiki)
- 🐛 [Report Bug](https://github.com/gitmvp-com/ghl-insight-hub/issues)
- 💡 [Request Feature](https://github.com/gitmvp-com/ghl-insight-hub/issues)
- 💬 [Discussions](https://github.com/gitmvp-com/ghl-insight-hub/discussions)

---

**Made with ❤️ for the GoHighLevel community**
