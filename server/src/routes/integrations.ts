import { Router, Request, Response } from 'express'

const router = Router()

// Mock integrations data
const integrations = [
  { id: 'slack', name: 'Slack', category: 'Communication', connected: true, config: { webhook: 'https://hooks.slack.com/...' } },
  { id: 'gmail', name: 'Gmail', category: 'Communication', connected: true, config: {} },
  { id: 'webhook', name: 'Webhooks', category: 'Developer', connected: true, config: {} },
  { id: 'stripe', name: 'Stripe', category: 'Finance', connected: true, config: {} },
  { id: 'notion', name: 'Notion', category: 'Productivity', connected: false, config: {} },
  { id: 'shopify', name: 'Shopify', category: 'E-commerce', connected: false, config: {} },
  { id: 'salesforce', name: 'Salesforce', category: 'CRM', connected: false, config: {} },
]

// List integrations
router.get('/', (req: Request, res: Response) => {
  res.json(integrations)
})

// Get integration details
router.get('/:id', (req: Request, res: Response) => {
  const integration = integrations.find(i => i.id === req.params.id)
  if (!integration) {
    return res.status(404).json({ error: 'Integration not found' })
  }
  res.json(integration)
})

// Connect integration (start OAuth flow)
router.post('/:id/connect', (req: Request, res: Response) => {
  const integration = integrations.find(i => i.id === req.params.id)
  if (!integration) {
    return res.status(404).json({ error: 'Integration not found' })
  }

  // In production, this would redirect to OAuth flow
  // For now, just simulate connection
  integration.connected = true
  integration.config = req.body.config || {}

  res.json({ 
    success: true, 
    message: `Connected to ${integration.name}`,
    integration 
  })
})

// Disconnect integration
router.post('/:id/disconnect', (req: Request, res: Response) => {
  const integration = integrations.find(i => i.id === req.params.id)
  if (!integration) {
    return res.status(404).json({ error: 'Integration not found' })
  }

  integration.connected = false
  integration.config = {}

  res.json({ 
    success: true, 
    message: `Disconnected from ${integration.name}` 
  })
})

// Test integration connection
router.post('/:id/test', async (req: Request, res: Response) => {
  const integration = integrations.find(i => i.id === req.params.id)
  if (!integration) {
    return res.status(404).json({ error: 'Integration not found' })
  }

  if (!integration.connected) {
    return res.status(400).json({ error: 'Integration not connected' })
  }

  // Simulate connection test
  await new Promise(resolve => setTimeout(resolve, 500))

  res.json({ 
    success: true, 
    message: `Connection to ${integration.name} is working` 
  })
})

export const integrationRoutes = router
