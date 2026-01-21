import { memo } from 'react'
import { Handle, Position } from '@xyflow/react'
import type { NodeProps } from '@xyflow/react'
import { cn } from '@/lib/utils'
import { Zap, Clock, MousePointer, Webhook } from 'lucide-react'

const triggerTypes = {
  webhook: { icon: Webhook, color: 'bg-green-500', label: 'Webhook' },
  schedule: { icon: Clock, color: 'bg-blue-500', label: 'Schedule' },
  manual: { icon: MousePointer, color: 'bg-purple-500', label: 'Manual' },
  event: { icon: Zap, color: 'bg-orange-500', label: 'Event' },
}

type TriggerNodeData = {
  label?: string
  type?: string
  description?: string
}

function TriggerNode({ data, selected }: NodeProps<TriggerNodeData>) {
  const triggerType = triggerTypes[data.type as keyof typeof triggerTypes] || triggerTypes.webhook
  const TriggerIcon = triggerType.icon

  return (
    <div
      className={cn(
        'glass rounded-xl p-4 min-w-[200px] transition-all duration-200',
        selected ? 'node-shadow-hover ring-2 ring-green-500' : 'node-shadow'
      )}
    >
      <div className="flex items-center gap-3 mb-3">
        <div className={cn('h-10 w-10 rounded-lg flex items-center justify-center', triggerType.color)}>
          <TriggerIcon className="h-5 w-5 text-white" />
        </div>
        <div>
          <span className="text-xs text-green-400 font-medium uppercase tracking-wide">Trigger</span>
          <h4 className="font-semibold text-sm">{data.label || 'Trigger'}</h4>
        </div>
      </div>
      {data.description && (
        <p className="text-xs text-muted-foreground">{data.description}</p>
      )}
      
      <Handle
        type="source"
        position={Position.Right}
        className="!w-4 !h-4 !bg-green-500 !border-2 !border-background"
      />
    </div>
  )
}

export default memo(TriggerNode)
