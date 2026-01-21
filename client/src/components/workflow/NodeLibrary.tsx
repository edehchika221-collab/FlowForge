import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  X,
  Search,
  Zap,
  Clock,
  MousePointer,
  Webhook,
  Mail,
  Globe,
  MessageSquare,
  Database,
  Sparkles,
  FileSearch,
  Brain,
  GitBranch,
  Repeat,
  Timer,
  Filter,
} from 'lucide-react'
import { useState } from 'react'
import { cn } from '@/lib/utils'

interface NodeLibraryProps {
  onAddNode: (categoryType: string, nodeType: string, label: string) => void
  onClose: () => void
}

const categories = [
  {
    name: 'Triggers',
    type: 'trigger',
    color: 'text-green-400',
    bgColor: 'bg-green-500/10',
    nodes: [
      { type: 'webhook', label: 'Webhook', icon: Webhook, description: 'Receive HTTP requests' },
      { type: 'schedule', label: 'Schedule', icon: Clock, description: 'Run on a schedule' },
      { type: 'manual', label: 'Manual', icon: MousePointer, description: 'Trigger manually' },
      { type: 'event', label: 'App Event', icon: Zap, description: 'React to app events' },
    ],
  },
  {
    name: 'Actions',
    type: 'action',
    color: 'text-blue-400',
    bgColor: 'bg-blue-500/10',
    nodes: [
      { type: 'http', label: 'HTTP Request', icon: Globe, description: 'Make API calls' },
      { type: 'email', label: 'Send Email', icon: Mail, description: 'Send emails via SMTP' },
      { type: 'slack', label: 'Slack Message', icon: MessageSquare, description: 'Post to Slack' },
      { type: 'database', label: 'Database', icon: Database, description: 'Query databases' },
    ],
  },
  {
    name: 'AI',
    type: 'ai',
    color: 'text-primary',
    bgColor: 'bg-primary/10',
    nodes: [
      { type: 'generate', label: 'Generate Content', icon: Sparkles, description: 'Create text with AI' },
      { type: 'extract', label: 'Extract Data', icon: FileSearch, description: 'Parse unstructured data' },
      { type: 'analyze', label: 'Analyze', icon: Brain, description: 'Sentiment & classification' },
    ],
  },
  {
    name: 'Logic',
    type: 'logic',
    color: 'text-amber-400',
    bgColor: 'bg-amber-500/10',
    nodes: [
      { type: 'condition', label: 'Condition', icon: GitBranch, description: 'If/then branching' },
      { type: 'loop', label: 'Loop', icon: Repeat, description: 'Iterate over items' },
      { type: 'delay', label: 'Delay', icon: Timer, description: 'Wait before continuing' },
      { type: 'filter', label: 'Filter', icon: Filter, description: 'Filter data' },
    ],
  },
]

export default function NodeLibrary({ onAddNode, onClose }: NodeLibraryProps) {
  const [search, setSearch] = useState('')

  const filteredCategories = categories.map((category) => ({
    ...category,
    nodes: category.nodes.filter(
      (node) =>
        node.label.toLowerCase().includes(search.toLowerCase()) ||
        node.description.toLowerCase().includes(search.toLowerCase())
    ),
  })).filter((category) => category.nodes.length > 0)

  return (
    <div className="w-72 border-r border-border bg-card flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold">Node Library</h3>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search nodes..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      {/* Categories */}
      <div className="flex-1 overflow-auto p-4 space-y-6">
        {filteredCategories.map((category) => (
          <div key={category.name}>
            <h4 className={cn('text-xs font-semibold uppercase tracking-wide mb-3', category.color)}>
              {category.name}
            </h4>
            <div className="space-y-2">
              {category.nodes.map((node) => (
                <button
                  key={node.type}
                  onClick={() => onAddNode(category.type, node.type, node.label)}
                  className={cn(
                    'w-full flex items-center gap-3 p-3 rounded-lg transition-all duration-200',
                    'hover:bg-muted/50 hover:scale-[1.02] active:scale-[0.98]',
                    'text-left group'
                  )}
                >
                  <div className={cn('h-9 w-9 rounded-lg flex items-center justify-center shrink-0', category.bgColor)}>
                    <node.icon className={cn('h-4 w-4', category.color)} />
                  </div>
                  <div className="min-w-0">
                    <p className="font-medium text-sm group-hover:text-foreground transition-colors">
                      {node.label}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">{node.description}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Tip */}
      <div className="p-4 border-t border-border">
        <p className="text-xs text-muted-foreground text-center">
          💡 Drag nodes to the canvas or click to add
        </p>
      </div>
    </div>
  )
}
