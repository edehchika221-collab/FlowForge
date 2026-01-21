import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { X, Trash2, Copy, Play } from 'lucide-react'
import { cn } from '@/lib/utils'

interface NodeConfigPanelProps {
  node: any
  onClose: () => void
  onUpdate: (data: any) => void
}

export default function NodeConfigPanel({ node, onClose, onUpdate }: NodeConfigPanelProps) {
  const nodeTypeColors = {
    trigger: 'text-green-400 bg-green-500/10 border-green-500/30',
    action: 'text-blue-400 bg-blue-500/10 border-blue-500/30',
    ai: 'text-primary bg-primary/10 border-primary/30',
    logic: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
  }

  const colorClass = nodeTypeColors[node.type as keyof typeof nodeTypeColors] || nodeTypeColors.action

  return (
    <div className="w-80 border-l border-border bg-card flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className={cn('px-2 py-0.5 rounded text-xs font-medium capitalize border', colorClass)}>
              {node.type}
            </span>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
        <Input
          value={node.data.label || ''}
          onChange={(e) => onUpdate({ label: e.target.value })}
          className="font-semibold"
          placeholder="Node name"
        />
      </div>

      {/* Configuration */}
      <div className="flex-1 overflow-auto p-4 space-y-4">
        <div>
          <label className="text-sm font-medium mb-2 block">Description</label>
          <Input
            value={node.data.description || ''}
            onChange={(e) => onUpdate({ description: e.target.value })}
            placeholder="Add a description..."
          />
        </div>

        {/* Dynamic fields based on node type */}
        {node.type === 'trigger' && node.data.type === 'webhook' && (
          <div>
            <label className="text-sm font-medium mb-2 block">Webhook URL</label>
            <Input
              value="https://api.flowforge.ai/webhook/abc123"
              readOnly
              className="font-mono text-xs bg-muted"
            />
            <p className="text-xs text-muted-foreground mt-1">Send POST requests to this URL</p>
          </div>
        )}

        {node.type === 'trigger' && node.data.type === 'schedule' && (
          <div>
            <label className="text-sm font-medium mb-2 block">Cron Expression</label>
            <Input placeholder="0 9 * * *" defaultValue="0 9 * * *" className="font-mono" />
            <p className="text-xs text-muted-foreground mt-1">Every day at 9:00 AM</p>
          </div>
        )}

        {node.type === 'action' && node.data.type === 'http' && (
          <>
            <div>
              <label className="text-sm font-medium mb-2 block">Method</label>
              <select className="w-full h-10 rounded-lg border border-input bg-background px-3 text-sm">
                <option>GET</option>
                <option>POST</option>
                <option>PUT</option>
                <option>DELETE</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">URL</label>
              <Input placeholder="https://api.example.com/endpoint" />
            </div>
          </>
        )}

        {node.type === 'action' && node.data.type === 'email' && (
          <>
            <div>
              <label className="text-sm font-medium mb-2 block">To</label>
              <Input placeholder="recipient@example.com" />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Subject</label>
              <Input placeholder="Email subject" />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Body</label>
              <textarea
                className="w-full min-h-[100px] rounded-lg border border-input bg-background px-3 py-2 text-sm"
                placeholder="Email body..."
              />
            </div>
          </>
        )}

        {node.type === 'ai' && (
          <>
            <div>
              <label className="text-sm font-medium mb-2 block">AI Model</label>
              <select className="w-full h-10 rounded-lg border border-input bg-background px-3 text-sm">
                <option>Claude 3.5 Sonnet</option>
                <option>Claude 3 Opus</option>
                <option>GPT-4o</option>
                <option>GPT-4 Turbo</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Prompt</label>
              <textarea
                className="w-full min-h-[120px] rounded-lg border border-input bg-background px-3 py-2 text-sm"
                placeholder="Enter your AI prompt...&#10;&#10;You can use {{variables}} from previous nodes."
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Temperature</label>
              <div className="flex items-center gap-2">
                <input type="range" min="0" max="100" defaultValue="70" className="flex-1" />
                <span className="text-sm text-muted-foreground w-8">0.7</span>
              </div>
            </div>
          </>
        )}

        {node.type === 'logic' && node.data.type === 'condition' && (
          <>
            <div>
              <label className="text-sm font-medium mb-2 block">Condition</label>
              <Input placeholder="{{data.value}} > 100" className="font-mono" />
            </div>
            <p className="text-xs text-muted-foreground">
              Use JavaScript expressions. Available variables will appear as you type.
            </p>
          </>
        )}

        {node.type === 'logic' && node.data.type === 'delay' && (
          <div>
            <label className="text-sm font-medium mb-2 block">Delay Duration</label>
            <div className="flex gap-2">
              <Input type="number" defaultValue="5" className="w-20" />
              <select className="flex-1 h-10 rounded-lg border border-input bg-background px-3 text-sm">
                <option>seconds</option>
                <option>minutes</option>
                <option>hours</option>
                <option>days</option>
              </select>
            </div>
          </div>
        )}

        {/* Output Variables */}
        <div className="pt-4 border-t border-border">
          <label className="text-sm font-medium mb-2 block">Output Variables</label>
          <div className="bg-muted/30 rounded-lg p-3">
            <code className="text-xs text-muted-foreground">
              {`{{nodes.${node.id}.output}}`}
            </code>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Reference this node's output in subsequent nodes
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="p-4 border-t border-border">
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="flex-1 gap-2">
            <Play className="h-4 w-4" />
            Test
          </Button>
          <Button variant="ghost" size="icon">
            <Copy className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="text-red-400 hover:text-red-300">
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
