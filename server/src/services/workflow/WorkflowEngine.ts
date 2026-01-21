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
  nodes: WorkflowNode[]
  edges: WorkflowEdge[]
}

interface ExecutionContext {
  input: Record<string, any>
  nodeOutputs: Map<string, any>
  logs: string[]
}

interface ExecutionResult {
  success: boolean
  output: any
  logs: string[]
  startedAt: Date
  completedAt: Date
  duration: number
  nodeResults: Record<string, any>
}

export class WorkflowEngine {
  private context: ExecutionContext

  constructor() {
    this.context = {
      input: {},
      nodeOutputs: new Map(),
      logs: [],
    }
  }

  async execute(workflow: Workflow, input: Record<string, any> = {}): Promise<ExecutionResult> {
    const startedAt = new Date()
    this.context.input = input
    this.context.logs = []
    this.context.nodeOutputs = new Map()

    try {
      this.log(`Starting workflow: ${workflow.name}`)

      // Build execution graph
      const executionOrder = this.topologicalSort(workflow.nodes, workflow.edges)
      this.log(`Execution order: ${executionOrder.map(n => n.id).join(' -> ')}`)

      // Execute each node in order
      for (const node of executionOrder) {
        await this.executeNode(node, workflow.edges)
      }

      const completedAt = new Date()
      const duration = completedAt.getTime() - startedAt.getTime()

      this.log(`Workflow completed successfully in ${duration}ms`)

      return {
        success: true,
        output: Object.fromEntries(this.context.nodeOutputs),
        logs: this.context.logs,
        startedAt,
        completedAt,
        duration,
        nodeResults: Object.fromEntries(this.context.nodeOutputs),
      }
    } catch (error) {
      const completedAt = new Date()
      const duration = completedAt.getTime() - startedAt.getTime()

      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      this.log(`Workflow failed: ${errorMessage}`)

      return {
        success: false,
        output: { error: errorMessage },
        logs: this.context.logs,
        startedAt,
        completedAt,
        duration,
        nodeResults: Object.fromEntries(this.context.nodeOutputs),
      }
    }
  }

  private topologicalSort(nodes: WorkflowNode[], edges: WorkflowEdge[]): WorkflowNode[] {
    const nodeMap = new Map(nodes.map(n => [n.id, n]))
    const inDegree = new Map<string, number>()
    const adjacency = new Map<string, string[]>()

    // Initialize
    for (const node of nodes) {
      inDegree.set(node.id, 0)
      adjacency.set(node.id, [])
    }

    // Build graph
    for (const edge of edges) {
      adjacency.get(edge.source)?.push(edge.target)
      inDegree.set(edge.target, (inDegree.get(edge.target) || 0) + 1)
    }

    // Find nodes with no incoming edges (triggers)
    const queue: string[] = []
    for (const [nodeId, degree] of inDegree) {
      if (degree === 0) {
        queue.push(nodeId)
      }
    }

    // Process queue
    const result: WorkflowNode[] = []
    while (queue.length > 0) {
      const nodeId = queue.shift()!
      const node = nodeMap.get(nodeId)
      if (node) {
        result.push(node)
      }

      for (const neighbor of adjacency.get(nodeId) || []) {
        inDegree.set(neighbor, (inDegree.get(neighbor) || 0) - 1)
        if (inDegree.get(neighbor) === 0) {
          queue.push(neighbor)
        }
      }
    }

    return result
  }

  private async executeNode(node: WorkflowNode, edges: WorkflowEdge[]): Promise<void> {
    this.log(`Executing node: ${node.data.label || node.id} (${node.type})`)

    // Get input from connected nodes
    const inputEdges = edges.filter(e => e.target === node.id)
    const nodeInput: Record<string, any> = { ...this.context.input }
    
    for (const edge of inputEdges) {
      const sourceOutput = this.context.nodeOutputs.get(edge.source)
      if (sourceOutput) {
        nodeInput[`node_${edge.source}`] = sourceOutput
      }
    }

    let output: any

    switch (node.type) {
      case 'trigger':
        output = await this.executeTrigger(node, nodeInput)
        break
      case 'action':
        output = await this.executeAction(node, nodeInput)
        break
      case 'ai':
        output = await this.executeAI(node, nodeInput)
        break
      case 'logic':
        output = await this.executeLogic(node, nodeInput)
        break
      default:
        throw new Error(`Unknown node type: ${node.type}`)
    }

    this.context.nodeOutputs.set(node.id, output)
    this.log(`Node ${node.id} output: ${JSON.stringify(output).substring(0, 200)}...`)
  }

  private async executeTrigger(node: WorkflowNode, input: Record<string, any>): Promise<any> {
    const triggerType = node.data.type || 'webhook'

    switch (triggerType) {
      case 'webhook':
        return input
      case 'schedule':
        return { triggeredAt: new Date().toISOString(), scheduled: true }
      case 'manual':
        return { triggeredAt: new Date().toISOString(), manual: true }
      default:
        return input
    }
  }

  private async executeAction(node: WorkflowNode, input: Record<string, any>): Promise<any> {
    const actionType = node.data.type || 'http'

    switch (actionType) {
      case 'http':
        // Simulate HTTP request
        await this.delay(100)
        return { 
          status: 200, 
          body: { success: true, message: 'HTTP request simulated' },
        }
      
      case 'email':
        // Simulate email sending
        await this.delay(100)
        return { 
          sent: true, 
          to: node.data.to || 'user@example.com',
          subject: node.data.subject || 'Automated Email',
        }
      
      case 'slack':
        // Simulate Slack message
        await this.delay(50)
        return { 
          sent: true, 
          channel: node.data.channel || '#general',
          timestamp: new Date().toISOString(),
        }
      
      case 'database':
        // Simulate database operation
        await this.delay(50)
        return { 
          affected: 1, 
          operation: node.data.operation || 'insert',
        }
      
      default:
        return { executed: true }
    }
  }

  private async executeAI(node: WorkflowNode, input: Record<string, any>): Promise<any> {
    const aiType = node.data.type || 'generate'

    // Simulate AI processing
    await this.delay(200)

    switch (aiType) {
      case 'generate':
        return {
          generated: true,
          content: 'This is AI-generated content based on your prompt. In production, this would use Claude API.',
          tokens: 150,
        }
      
      case 'extract':
        return {
          extracted: true,
          data: { name: 'John Doe', email: 'john@example.com' },
        }
      
      case 'analyze':
        return {
          analyzed: true,
          sentiment: 'positive',
          confidence: 0.85,
        }
      
      default:
        return { processed: true }
    }
  }

  private async executeLogic(node: WorkflowNode, input: Record<string, any>): Promise<any> {
    const logicType = node.data.type || 'condition'

    switch (logicType) {
      case 'condition':
        // Simple condition evaluation
        const condition = node.data.condition || 'true'
        const result = this.evaluateCondition(condition, input)
        return { result, branch: result ? 'true' : 'false' }
      
      case 'loop':
        // Simulate loop processing
        const items = input.items || [1, 2, 3]
        return { items, count: items.length }
      
      case 'delay':
        const duration = node.data.duration || 1000
        await this.delay(Math.min(duration, 5000)) // Cap at 5s for safety
        return { delayed: true, duration }
      
      case 'filter':
        const data = input.data || []
        return { filtered: data, count: data.length }
      
      default:
        return { processed: true }
    }
  }

  private evaluateCondition(condition: string, context: Record<string, any>): boolean {
    try {
      // Simple evaluation - in production use a proper expression parser
      if (condition === 'true') return true
      if (condition === 'false') return false
      
      // Check for simple comparisons
      if (condition.includes('>')) {
        const [left, right] = condition.split('>').map(s => s.trim())
        const leftVal = this.getValue(left, context)
        const rightVal = parseFloat(right) || this.getValue(right, context)
        return leftVal > rightVal
      }
      
      return true
    } catch {
      return true
    }
  }

  private getValue(path: string, context: Record<string, any>): any {
    const parts = path.replace(/[{}]/g, '').split('.')
    let value: any = context
    for (const part of parts) {
      value = value?.[part]
    }
    return value
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  private log(message: string): void {
    const timestamp = new Date().toISOString()
    this.context.logs.push(`[${timestamp}] ${message}`)
    console.log(`[WorkflowEngine] ${message}`)
  }
}
