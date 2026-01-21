# FlowForge AI

> An intelligent automation platform that empowers users to build powerful workflows with AI capabilities.

![FlowForge AI](https://via.placeholder.com/1200x600/1a1b26/6366f1?text=FlowForge+AI)

## ✨ Features

### 🔄 Visual Workflow Builder

- Intuitive drag-and-drop interface powered by ReactFlow
- Connect nodes to create automation sequences
- Real-time preview and testing

### 🤖 AI-Powered Actions

- Content generation with Claude AI
- Smart data extraction from unstructured text
- Sentiment analysis and classification
- Natural language workflow creation

### ⚡ Multiple Trigger Types

- **Webhooks**: Receive data from any source
- **Scheduled**: Cron-based automation
- **Manual**: User-triggered workflows
- **App Events**: React to third-party app events

### 🔌 Integrations

- Slack, Gmail, Notion, Shopify
- HTTP/REST API calls
- Database queries
- And many more...

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/yourusername/flowforge-ai.git
   cd flowforge-ai
   ```

2. **Install client dependencies**

   ```bash
   cd client
   npm install
   ```

3. **Install server dependencies**

   ```bash
   cd ../server
   npm install
   ```

4. **Configure environment**

   ```bash
   cp .env.example .env
   # Edit .env with your API keys
   ```

5. **Start the development servers**

   In one terminal (server):

   ```bash
   cd server
   npm run dev
   ```

   In another terminal (client):

   ```bash
   cd client
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🏗️ Project Structure

```
flowforge-ai/
├── client/                    # React frontend
│   ├── src/
│   │   ├── components/        # Reusable UI components
│   │   │   ├── ui/           # Base UI (shadcn-style)
│   │   │   ├── layout/       # Layout components
│   │   │   └── workflow/     # Workflow builder components
│   │   ├── pages/            # Route pages
│   │   ├── stores/           # Zustand state stores
│   │   └── styles/           # Global styles
│   └── public/
├── server/                    # Node.js backend
│   └── src/
│       ├── routes/           # API routes
│       ├── middleware/       # Express middleware
│       └── services/         # Business logic
│           ├── workflow/     # Workflow execution
│           └── ai/           # AI integrations
└── README.md
```

## 🎨 Tech Stack

### Frontend

- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **ReactFlow** for workflow visualization
- **Framer Motion** for animations
- **Recharts** for analytics
- **Zustand** for state management

### Backend

- **Node.js** with Express
- **TypeScript** for type safety
- **Anthropic SDK** for Claude AI
- **Zod** for validation
- **JWT** for authentication

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the `server` directory:

```env
# Server
PORT=5000
NODE_ENV=development

# Authentication
JWT_SECRET=your-secret-key

# AI APIs (optional)
ANTHROPIC_API_KEY=sk-ant-...
OPENAI_API_KEY=sk-...

# CORS
CORS_ORIGINS=http://localhost:3000
```

## 📡 API Endpoints

### Workflows

- `GET /api/workflows` - List all workflows
- `POST /api/workflows` - Create a workflow
- `GET /api/workflows/:id` - Get workflow details
- `PUT /api/workflows/:id` - Update a workflow
- `DELETE /api/workflows/:id` - Delete a workflow
- `POST /api/workflows/:id/execute` - Execute a workflow

### AI

- `POST /api/ai/generate` - Generate content
- `POST /api/ai/extract` - Extract structured data
- `POST /api/ai/analyze` - Analyze text
- `POST /api/ai/workflow-from-text` - Generate workflow from description

### Integrations

- `GET /api/integrations` - List integrations
- `POST /api/integrations/:id/connect` - Connect integration
- `POST /api/integrations/:id/disconnect` - Disconnect integration

### Webhooks

- `POST /webhook/:endpointId` - Receive webhook data

## 🎯 Roadmap

- [ ] Database persistence (PostgreSQL)
- [ ] Real-time execution monitoring
- [ ] Team workspaces and collaboration
- [ ] More integrations (50+)
- [ ] Mobile companion app
- [ ] Enterprise SSO

## 📄 License

MIT License - feel free to use this project for any purpose.

## 🤝 Contributing

Contributions are welcome! Please read our contributing guidelines before submitting a PR.

---

Built with 💜 by the FlowForge team
