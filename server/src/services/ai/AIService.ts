import Anthropic from '@anthropic-ai/sdk'

interface GenerateOptions {
  prompt: string
  model?: string
  maxTokens?: number
  temperature?: number
}

interface GenerateResult {
  content: string
  model: string
  usage: {
    inputTokens: number
    outputTokens: number
  }
}

interface ExtractResult {
  data: Record<string, any>
  confidence: number
}

interface AnalyzeResult {
  type: string
  result: Record<string, any>
  confidence: number
}

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
}

interface GeneratedWorkflow {
  name: string
  description: string
  nodes: WorkflowNode[]
  edges: WorkflowEdge[]
}

export class AIService {
  private anthropic: Anthropic | null = null

  constructor() {
    if (process.env.ANTHROPIC_API_KEY) {
      this.anthropic = new Anthropic({
        apiKey: process.env.ANTHROPIC_API_KEY,
      })
    }
  }

  async generateContent(options: GenerateOptions): Promise<GenerateResult> {
    const { prompt, model = 'claude-3-5-sonnet-20241022', maxTokens = 1024, temperature = 0.7 } = options

    // If no API key, return mock response
    if (!this.anthropic) {
      console.log('[AIService] No API key configured, returning mock response')
      return {
        content: `This is a simulated AI response for: "${prompt.substring(0, 100)}..."\n\nTo enable real AI responses, add your ANTHROPIC_API_KEY to the .env file.`,
        model: model,
        usage: { inputTokens: 50, outputTokens: 100 },
      }
    }

    try {
      const response = await this.anthropic.messages.create({
        model,
        max_tokens: maxTokens,
        messages: [{ role: 'user', content: prompt }],
      })

      const content = response.content[0].type === 'text' ? response.content[0].text : ''

      return {
        content,
        model: response.model,
        usage: {
          inputTokens: response.usage.input_tokens,
          outputTokens: response.usage.output_tokens,
        },
      }
    } catch (error: any) {
      console.error('[AIService] Generation error:', error.message)
      throw new Error(`AI generation failed: ${error.message}`)
    }
  }

  async extractData(text: string, schema: Record<string, string>): Promise<ExtractResult> {
    const schemaDescription = Object.entries(schema)
      .map(([key, type]) => `- ${key}: ${type}`)
      .join('\n')

    const prompt = `Extract the following information from the text below. Return ONLY valid JSON.

Schema:
${schemaDescription}

Text:
${text}

Return the extracted data as JSON:`

    if (!this.anthropic) {
      // Return mock extraction
      const mockData: Record<string, any> = {}
      for (const key of Object.keys(schema)) {
        mockData[key] = `extracted_${key}`
      }
      return { data: mockData, confidence: 0.85 }
    }

    try {
      const result = await this.generateContent({ prompt, maxTokens: 500, temperature: 0.1 })
      const jsonMatch = result.content.match(/\{[\s\S]*\}/)
      const data = jsonMatch ? JSON.parse(jsonMatch[0]) : {}
      
      return { data, confidence: 0.9 }
    } catch (error) {
      return { data: {}, confidence: 0 }
    }
  }

  async analyzeText(text: string, type: 'sentiment' | 'classification' | 'summary'): Promise<AnalyzeResult> {
    const prompts: Record<string, string> = {
      sentiment: `Analyze the sentiment of this text. Return JSON with: sentiment (positive/negative/neutral), confidence (0-1), and key_phrases (array of strings).

Text: ${text}`,
      classification: `Classify this text into categories. Return JSON with: category (string), subcategories (array), and confidence (0-1).

Text: ${text}`,
      summary: `Summarize this text. Return JSON with: summary (string, max 100 words), key_points (array of strings), and word_count (number).

Text: ${text}`,
    }

    if (!this.anthropic) {
      const mockResults: Record<string, Record<string, any>> = {
        sentiment: { sentiment: 'positive', confidence: 0.85, key_phrases: ['mock analysis'] },
        classification: { category: 'general', subcategories: ['misc'], confidence: 0.8 },
        summary: { summary: 'This is a mock summary.', key_points: ['point 1'], word_count: 5 },
      }
      return { type, result: mockResults[type], confidence: 0.85 }
    }

    try {
      const result = await this.generateContent({ prompt: prompts[type], maxTokens: 500, temperature: 0.2 })
      const jsonMatch = result.content.match(/\{[\s\S]*\}/)
      const parsed = jsonMatch ? JSON.parse(jsonMatch[0]) : {}
      
      return { type, result: parsed, confidence: parsed.confidence || 0.85 }
    } catch (error) {
      return { type, result: {}, confidence: 0 }
    }
  }

  async generateWorkflowFromText(description: string): Promise<GeneratedWorkflow> {
    const prompt = `You are a workflow automation expert. Based on the user's description, generate a workflow configuration.

User's description: "${description}"

Return a JSON object with:
- name: A short name for the workflow
- description: A brief description
- nodes: Array of nodes, each with:
  - id: unique string (e.g., "1", "2", "3")
  - type: "trigger", "action", "ai", or "logic"
  - position: { x: number, y: number } (space nodes 250px apart horizontally)
  - data: { label: string, type: string (webhook/schedule/http/email/generate/condition), description: string }
- edges: Array of connections, each with:
  - id: unique string (e.g., "e1-2")
  - source: node id
  - target: node id

Start with a trigger node, add processing nodes, and end with action nodes. Return ONLY valid JSON.`

    if (!this.anthropic) {
      // Return a simple example workflow
      return {
        name: 'Generated Workflow',
        description: description,
        nodes: [
          { id: '1', type: 'trigger', position: { x: 100, y: 200 }, data: { label: 'Webhook Trigger', type: 'webhook', description: 'Start the workflow' } },
          { id: '2', type: 'ai', position: { x: 350, y: 200 }, data: { label: 'AI Processing', type: 'generate', description: 'Process with AI' } },
          { id: '3', type: 'action', position: { x: 600, y: 200 }, data: { label: 'Send Result', type: 'http', description: 'Send the result' } },
        ],
        edges: [
          { id: 'e1-2', source: '1', target: '2' },
          { id: 'e2-3', source: '2', target: '3' },
        ],
      }
    }

    try {
      const result = await this.generateContent({ prompt, maxTokens: 2000, temperature: 0.5 })
      const jsonMatch = result.content.match(/\{[\s\S]*\}/)
      
      if (jsonMatch) {
        const workflow = JSON.parse(jsonMatch[0])
        return {
          name: workflow.name || 'Generated Workflow',
          description: workflow.description || description,
          nodes: workflow.nodes || [],
          edges: workflow.edges || [],
        }
      }
    } catch (error) {
      console.error('[AIService] Workflow generation error:', error)
    }

    // Fallback
    return {
      name: 'Generated Workflow',
      description,
      nodes: [
        { id: '1', type: 'trigger', position: { x: 100, y: 200 }, data: { label: 'Start', type: 'webhook', description: '' } },
      ],
      edges: [],
    }
  }
}
