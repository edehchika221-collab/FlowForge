import { Router, Request, Response } from 'express'
import { AIService } from '../services/ai/AIService.js'
import { z } from 'zod'

const router = Router()

const generateSchema = z.object({
  prompt: z.string().min(1).max(10000),
  model: z.enum(['claude-3-5-sonnet-20241022', 'claude-3-opus-20240229', 'gpt-4o', 'gpt-4-turbo']).optional(),
  maxTokens: z.number().min(1).max(4096).optional(),
  temperature: z.number().min(0).max(1).optional(),
})

const extractSchema = z.object({
  text: z.string().min(1),
  schema: z.record(z.string()),
})

const analyzeSchema = z.object({
  text: z.string().min(1),
  type: z.enum(['sentiment', 'classification', 'summary']).optional(),
})

const workflowFromTextSchema = z.object({
  description: z.string().min(10).max(2000),
})

// Generate content
router.post('/generate', async (req: Request, res: Response) => {
  try {
    const { prompt, model, maxTokens, temperature } = generateSchema.parse(req.body)

    const aiService = new AIService()
    const result = await aiService.generateContent({
      prompt,
      model,
      maxTokens,
      temperature,
    })

    res.json(result)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Invalid input', details: error.errors })
    }
    const message = error instanceof Error ? error.message : 'Unknown error'
    res.status(500).json({ error: 'AI generation failed', details: message })
  }
})

// Extract structured data
router.post('/extract', async (req: Request, res: Response) => {
  try {
    const { text, schema } = extractSchema.parse(req.body)

    const aiService = new AIService()
    const result = await aiService.extractData(text, schema)

    res.json(result)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Invalid input', details: error.errors })
    }
    throw error
  }
})

// Analyze text
router.post('/analyze', async (req: Request, res: Response) => {
  try {
    const { text, type } = analyzeSchema.parse(req.body)

    const aiService = new AIService()
    const result = await aiService.analyzeText(text, type || 'sentiment')

    res.json(result)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Invalid input', details: error.errors })
    }
    throw error
  }
})

// Generate workflow from natural language
router.post('/workflow-from-text', async (req: Request, res: Response) => {
  try {
    const { description } = workflowFromTextSchema.parse(req.body)

    const aiService = new AIService()
    const workflow = await aiService.generateWorkflowFromText(description)

    res.json(workflow)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Invalid input', details: error.errors })
    }
    throw error
  }
})

export const aiRoutes = router
