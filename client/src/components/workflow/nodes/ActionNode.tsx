import { memo } from 'react'
import { Handle, Position } from '@xyflow/react'
import type { NodeProps } from '@xyflow/react'
import { cn } from '@/lib/utils'
import { Mail, Globe, Database, MessageSquare, Send, FileText } from 'lucide-react'

const actionTypes = {
  email: { icon: Mail, color: 'bg-blue-500', label: 'Send Email' },
  http: { icon: Globe, color: 'bg-cyan-500', label: 'HTTP Request' },
  database: { icon: Database, color: 'bg-amber-500', label: 'Database' },
  slack: { icon: MessageSquare, color: 'bg-pink-500', label: 'Slack' },
  webhook: { icon: Send, color: 'bg-green-500', label: 'Webhook' },
  transform: { icon: FileText, color: 'bg-violet-500', label: 'Transform' },
}

type ActionNodeData = {
  label?: string
  type?: string
  description?: string
}

function ActionNode({ data, selected }: NodeProps<ActionNodeData>) {
  const actionType = actionTypes[data.type as keyof typeof actionTypes] || actionTypes.http
  const ActionIcon = actionType.icon

  return (
    <div
      className={cn(
        'glass rounded-xl p-4 min-w-[200px] transition-all duration-200',
        selected ? 'node-shadow-hover ring-2 ring-blue-500' : 'node-shadow'
      )}
    >
      <Handle
        type="target"
        position={Position.Left}
        className="!w-4 !h-4 !bg-blue-500 !border-2 !border-background"
      />
      
      <div className="flex items-center gap-3 mb-3">
        <div className={cn('h-10 w-10 rounded-lg flex items-center justify-center', actionType.color)}>
          <ActionIcon className="h-5 w-5 text-white" />
        </div>
        <div>
          <span className="text-xs text-blue-400 font-medium uppercase tracking-wide">Action</span>
          <h4 className="font-semibold text-sm">{data.label || 'Action'}</h4>
        </div>
      </div>
      {data.description && (
        <p className="text-xs text-muted-foreground">{data.description}</p>
      )}
      
      <Handle
        type="source"
        position={Position.Right}
        className="!w-4 !h-4 !bg-blue-500 !border-2 !border-background"
      />
    </div>
  )
}

export default memo(ActionNode)
