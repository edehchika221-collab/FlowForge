import { memo } from 'react'
import { Handle, Position } from '@xyflow/react'
import type { NodeProps } from '@xyflow/react'
import { cn } from '@/lib/utils'
import { Bot, Sparkles, FileSearch, Brain, MessageCircle } from 'lucide-react'

const aiTypes = {
  generate: { icon: Sparkles, color: 'bg-primary', label: 'Generate' },
  extract: { icon: FileSearch, color: 'bg-purple-500', label: 'Extract' },
  analyze: { icon: Brain, color: 'bg-pink-500', label: 'Analyze' },
  chat: { icon: MessageCircle, color: 'bg-green-500', label: 'Chat' },
  custom: { icon: Bot, color: 'bg-secondary', label: 'Custom AI' },
}

type AINodeData = {
  label?: string
  type?: string
  description?: string
}

function AINode({ data, selected }: NodeProps<AINodeData>) {
  const aiType = aiTypes[data.type as keyof typeof aiTypes] || aiTypes.generate
  const AIIcon = aiType.icon

  return (
    <div
      className={cn(
        'glass rounded-xl p-4 min-w-[200px] transition-all duration-200 relative overflow-hidden',
        selected ? 'node-shadow-hover ring-2 ring-primary' : 'node-shadow'
      )}
    >
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20 opacity-50" />
      
      <Handle
        type="target"
        position={Position.Left}
        className="!w-4 !h-4 !bg-primary !border-2 !border-background"
      />
      
      <div className="relative">
        <div className="flex items-center gap-3 mb-3">
          <div className={cn('h-10 w-10 rounded-lg flex items-center justify-center relative', aiType.color)}>
            <AIIcon className="h-5 w-5 text-white relative z-10" />
            <div className="absolute inset-0 rounded-lg bg-white/20 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-1">
              <span className="text-xs text-primary font-medium uppercase tracking-wide">AI</span>
              <Sparkles className="h-3 w-3 text-primary" />
            </div>
            <h4 className="font-semibold text-sm">{data.label || 'AI Node'}</h4>
          </div>
        </div>
        {data.description && (
          <p className="text-xs text-muted-foreground">{data.description}</p>
        )}
      </div>
      
      <Handle
        type="source"
        position={Position.Right}
        className="!w-4 !h-4 !bg-primary !border-2 !border-background"
      />
    </div>
  )
}

export default memo(AINode)
