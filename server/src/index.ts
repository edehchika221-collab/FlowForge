import express from 'express'
import cors from 'cors'
import rateLimit from 'express-rate-limit'
import dotenv from 'dotenv'
import { workflowRoutes } from './routes/workflows.js'
import { aiRoutes } from './routes/ai.js'
import { authRoutes } from './routes/auth.js'
import { integrationRoutes } from './routes/integrations.js'
import { webhookRoutes } from './routes/webhooks.js'
import { errorHandler } from './middleware/errorHandler.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

// Middleware
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true }))

// CORS
const corsOrigins = process.env.CORS_ORIGINS?.split(',') || ['http://localhost:3000']
app.use(cors({
  origin: corsOrigins,
  credentials: true,
}))

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: { error: 'Too many requests, please try again later.' },
})
app.use('/api', limiter)

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// API Routes
app.use('/api/auth', authRoutes)
app.use('/api/workflows', workflowRoutes)
app.use('/api/ai', aiRoutes)
app.use('/api/integrations', integrationRoutes)
app.use('/webhook', webhookRoutes)

// Error handling
app.use(errorHandler)

// Start server
app.listen(PORT, () => {
  console.log(`
  ╔═══════════════════════════════════════════════╗
  ║                                               ║
  ║   🚀 FlowForge API Server                    ║
  ║                                               ║
  ║   Running on: http://localhost:${PORT}          ║
  ║   Environment: ${process.env.NODE_ENV || 'development'}              ║
  ║                                               ║
  ╚═══════════════════════════════════════════════╝
  `)
})

export default app
