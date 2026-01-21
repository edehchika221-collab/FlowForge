import { Router, Request, Response } from 'express'
import { v4 as uuidv4 } from 'uuid'

const router = Router()

// Store for webhook endpoints
const webhookEndpoints = new Map<string, { workflowId: string; secret: string }>()

// Receive webhook
router.all('/:endpointId', async (req: Request, res: Response) => {
  const { endpointId } = req.params
  const endpoint = webhookEndpoints.get(endpointId)
  
  try {
    if (!endpoint) {
      // For demo purposes, accept any webhook
      console.log(`[Webhook] Received at ${endpointId}:`, {
        method: req.method,
        headers: req.headers,
        body: req.body,
        query: req.query,
      })

      return res.json({
        success: true,
        message: 'Webhook received',
        data: {
          id: uuidv4(),
          method: req.method,
          receivedAt: new Date().toISOString(),
        },
      })
    }

    // Validate secret if provided
    const providedSecret = req.headers['x-webhook-secret']
    if (endpoint.secret && providedSecret !== endpoint.secret) {
      return res.status(401).json({ error: 'Invalid webhook secret' })
    }

    // In production, this would trigger the workflow
    console.log(`[Webhook] Triggering workflow ${endpoint.workflowId} with payload:`, req.body)

    res.json({
      success: true,
      message: 'Workflow triggered',
      executionId: uuidv4(),
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    res.status(500).json({ error: 'Webhook processing failed', details: message })
  }
})

// Create webhook endpoint for a workflow
router.post('/create', (req: Request, res: Response) => {
  const { workflowId } = req.body

  if (!workflowId) {
    return res.status(400).json({ error: 'workflowId is required' })
  }

  const endpointId = uuidv4().substring(0, 8)
  const secret = uuidv4()

  webhookEndpoints.set(endpointId, { workflowId, secret })

  const webhookUrl = `${req.protocol}://${req.get('host')}/webhook/${endpointId}`

  res.status(201).json({
    endpointId,
    url: webhookUrl,
    secret,
  })
})

export const webhookRoutes = router
