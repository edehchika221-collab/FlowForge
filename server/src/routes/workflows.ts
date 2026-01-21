import { Router, Request, Response } from 'express'
import { v4 as uuidv4 } from 'uuid'
import { z } from 'zod'
import { WorkflowEngine } from '../services/workflow/WorkflowEngine.js'

const router = Router()

// Types
interface WorkflowNode {
  id: string
  type: 'trigger' | 'action' | 'ai' | 'logic'
  position: { x: number; y: number }
  data: Record<string, any>
}

interface WorkflowEdge {
  id: string
  source: string
  target: string
  sourceHandle?: string
  targetHandle?: string
}

interface Workflow {
  id: string
  name: string
  description: string
  nodes: WorkflowNode[]
  edges: WorkflowEdge[]
  status: 'active' | 'paused' | 'draft'
  userId: string
  createdAt: Date
  updatedAt: Date
  executions: number
  lastRun?: Date
}

// In-memory workflow store
const workflows = new Map<string, Workflow>()
const executions = new Map<string, any[]>()

// Seed some example workflows
const seedWorkflows = () => {
  const sampleWorkflow: Workflow = {
    id: '1',
    name: 'Lead Nurturing Automation',
    description: 'Automatically send personalized follow-ups based on lead behavior',
    nodes: [
      { id: '1', type: 'trigger', position: { x: 100, y: 200 }, data: { label: 'Webhook Trigger', type: 'webhook' } },
      { id: '2', type: 'ai', position: { x: 400, y: 150 }, data: { label: 'AI Content Generator', type: 'generate' } },
      { id: '3', type: 'action', position: { x: 700, y: 200 }, data: { label: 'Send Email', type: 'email' } },
    ],
    edges: [
      { id: 'e1-2', source: '1', target: '2' },
      { id: 'e2-3', source: '2', target: '3' },
    ],
    status: 'active',
    userId: 'demo',
    createdAt: new Date(),
    updatedAt: new Date(),
    executions: 1284,
    lastRun: new Date(Date.now() - 120000),
  }
  workflows.set(sampleWorkflow.id, sampleWorkflow)
}
seedWorkflows()

// Validation schemas
const workflowSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().max(500).optional(),
  nodes: z.array(z.object({
    id: z.string(),
    type: z.enum(['trigger', 'action', 'ai', 'logic']),
    position: z.object({ x: z.number(), y: z.number() }),
    data: z.record(z.any()),
  })),
  edges: z.array(z.object({
    id: z.string(),
    source: z.string(),
    target: z.string(),
    sourceHandle: z.string().optional(),
    targetHandle: z.string().optional(),
  })),
  status: z.enum(['active', 'paused', 'draft']).optional(),
})

// List workflows
router.get('/', (req: Request, res: Response) => {
  const workflowList = Array.from(workflows.values())
    .map(w => ({
      id: w.id,
      name: w.name,
      description: w.description,
      status: w.status,
      executions: w.executions,
      lastRun: w.lastRun,
      createdAt: w.createdAt,
      updatedAt: w.updatedAt,
    }))
    .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())

  res.json(workflowList)
})

// List all executions (History)
router.get('/executions', (req: Request, res: Response) => {
  const allExecutions = Array.from(executions.values())
    .flat()
    .sort((a, b) => new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime())
  
  // Enrich with workflow names
  const enrichedExecutions = allExecutions.map(exec => {
    const workflow = workflows.get(exec.workflowId)
    return {
      ...exec,
      workflowName: workflow?.name || 'Unknown Workflow',
      workflowStatus: workflow?.status || 'draft'
    }
  })

  res.json(enrichedExecutions)
})

// Get single workflow
router.get('/:id', (req: Request, res: Response) => {
  const workflow = workflows.get(req.params.id)
  if (!workflow) {
    return res.status(404).json({ error: 'Workflow not found' })
  }
  res.json(workflow)
})

// Create workflow
router.post('/', (req: Request, res: Response) => {
  try {
    const data = workflowSchema.parse(req.body)
    
    const workflow: Workflow = {
      id: uuidv4(),
      ...data,
      description: data.description || '',
      status: data.status || 'draft',
      userId: 'demo', // Would come from auth in production
      createdAt: new Date(),
      updatedAt: new Date(),
      executions: 0,
    }

    workflows.set(workflow.id, workflow)
    res.status(201).json(workflow)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Invalid workflow data', details: error.errors })
    }
    throw error
  }
})

// Update workflow
router.put('/:id', (req: Request, res: Response) => {
  const existing = workflows.get(req.params.id)
  if (!existing) {
    return res.status(404).json({ error: 'Workflow not found' })
  }

  try {
    const data = workflowSchema.partial().parse(req.body)
    
    const updated: Workflow = {
      ...existing,
      ...data,
      updatedAt: new Date(),
    }

    workflows.set(req.params.id, updated)
    res.json(updated)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Invalid workflow data', details: error.errors })
    }
    throw error
  }
})

// Delete workflow
router.delete('/:id', (req: Request, res: Response) => {
  if (!workflows.has(req.params.id)) {
    return res.status(404).json({ error: 'Workflow not found' })
  }

  workflows.delete(req.params.id)
  executions.delete(req.params.id)
  res.status(204).send()
})

// Execute workflow
router.post('/:id/execute', async (req: Request, res: Response) => {
  const workflow = workflows.get(req.params.id)
  if (!workflow) {
    return res.status(404).json({ error: 'Workflow not found' })
  }

  if (workflow.status !== 'active') {
    return res.status(400).json({ error: 'Workflow is not active' })
  }

  try {
    const engine = new WorkflowEngine()
    const result = await engine.execute(workflow, req.body.input || {})

    // Update workflow stats
    workflow.executions++
    workflow.lastRun = new Date()
    workflows.set(workflow.id, workflow)

    // Store execution
    const workflowExecutions = executions.get(workflow.id) || []
    workflowExecutions.unshift({
      id: uuidv4(),
      workflowId: workflow.id,
      status: result.success ? 'success' : 'failed',
      input: req.body.input,
      output: result.output,
      logs: result.logs,
      startedAt: result.startedAt,
      completedAt: result.completedAt,
      duration: result.duration,
    })
    executions.set(workflow.id, workflowExecutions.slice(0, 100)) // Keep last 100

    res.json(result)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    res.status(500).json({ error: 'Execution failed', details: message })
  }
})

// Get workflow executions
router.get('/:id/executions', (req: Request, res: Response) => {
  const workflow = workflows.get(req.params.id)
  if (!workflow) {
    return res.status(404).json({ error: 'Workflow not found' })
  }

  const workflowExecutions = executions.get(workflow.id) || []
  res.json(workflowExecutions)
})

export const workflowRoutes = router
