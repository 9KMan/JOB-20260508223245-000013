# Voice Agent Software Integration — Collections Platform

Full-stack voice integration platform combining VAPI (AI-powered inbound) and Vicidial (outbound dialer) for a debt collections workflow.

## Architecture

```
React SPA (Agent Dashboard)
       ↕ WebSocket (Socket.io)
    Node.js API (Express)
       ↕              ↕
   VAPI            Vicidial
(Inbound AI)    (Outbound Dialer)
       ↕              ↕
    MongoDB ←──────────────┘
```

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React (SPA), Socket.io client |
| Backend | Node.js, Express, Socket.io |
| Database | MongoDB |
| Voice — Inbound | VAPI (AI agent, WebRTC) |
| Voice — Outbound | Vicidial (predictive dialer) |
| Real-time | Socket.io for call state, agent status |

## Quick Start

### Server

```bash
cd server
npm install
# Configure .env (copy .env.example)
node src/app.js
```

### Client

```bash
cd client
npm install
npm start
```

## API Endpoints

### VAPI
- `POST /api/vapi/create-call` — initiate outbound call
- `POST /api/vapi/webhook` — VAPI event webhook
- `POST /api/vapi/end-call` — terminate call
- `GET /api/vapi/get-call-status` — call state

### Vicidial
- `POST /api/vicidial/webhook` — Vicidial event webhook
- `GET /api/vicidial/leads` — fetch lead list
- `GET /api/vicidial/agent-status` — agent state
- `PUT /api/vicidial/disposition` — log call outcome
- `GET /api/vicidial/call-recording` — stream recording

### Core
- `GET /api/leads` — list leads (paginated)
- `POST /api/leads` — create lead
- `GET /api/leads/:id` — lead details
- `PUT /api/leads/:id/disposition` — log disposition
- `GET /api/agents/:id/status` — agent session
- `PUT /api/agents/:id/status` — update status
- `GET /api/calls/active` — active calls
- `GET /api/queue/stats` — queue metrics

## Environment Variables

```env
# Server
PORT=3000
MONGODB_URI=mongodb://localhost:27017/collections
VAPI_API_KEY=your_vapi_key
VAPI_WEBHOOK_SECRET=your_secret
VICIDIAL_API_URL=https://your-vicidial.example.com
VICIDIAL_API_KEY=your_vicidial_key

# Client
REACT_APP_API_URL=http://localhost:3000
REACT_APP_WS_URL=ws://localhost:3000
```

## Project Structure

```
├── server/
│   ├── src/
│   │   ├── app.js              # Express + Socket.io
│   │   ├── models/             # MongoDB schemas
│   │   │   ├── Lead.js
│   │   │   ├── CallLog.js
│   │   │   ├── AgentSession.js
│   │   │   └── Queue.js
│   │   ├── routes/
│   │   │   ├── vapi.js         # VAPI integration
│   │   │   ├── vicidial.js     # Vicidial integration
│   │   │   ├── leads.js        # Lead CRUD
│   │   │   ├── calls.js        # Call management
│   │   │   ├── agents.js       # Agent sessions
│   │   │   └── queue.js        # Queue stats
│   │   └── services/
│   │       ├── vapiService.js  # VAPI SDK wrapper
│   │       └── vicidialService.js
│   └── config/
│       └── index.js
├── client/
│   ├── src/
│   │   ├── App.js              # Main component
│   │   ├── context/
│   │   │   └── CallContext.js  # Socket.io + call state
│   │   └── components/
│   │       ├── CallControlPanel.js
│   │       ├── ContactInfoPanel.js
│   │       ├── DispositionButtons.js
│   │       ├── LiveCallStats.js
│   │       └── ScriptPanel.js
│   └── public/
│       └── index.html
└── SPEC.md                     # Full specification
```

## VAPI Integration

VAPI handles inbound AI voice agent with LLM reasoning:

- Natural language IVR (no僵硬 phone tree)
- Function calling for account lookups
- Real-time transcription + sentiment
- Webhook events: call started, transcript, sentiment

Configure assistant:
```javascript
{
  name: "Collections AI Agent",
  model: "gpt-4",
  voice: "sage",
  actions: [
    { type: "function", name: "lookup_account", parameters: { phone: "string" } },
    { type: "function", name: "log_disposition", parameters: { disposition: "string" } }
  ]
}
```

## Vicidial Integration

Vicidial handles outbound predictive dialing:

- Predictive/power/automatic dialer modes
- Lead list management
- Agent phone interface
- Call recording + disposition logging

Sync via Vicidial admin API (lead upload, disposition write-back, agent status polling).

## License

Proprietary — internal use only.