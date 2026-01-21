import { memo } from 'react'
import { Handle, Position } from '@xyflow/react'
import type { NodeProps } from '@xyflow/react'
import { cn } from '@/lib/utils'
import { GitBranch, Repeat, Timer, Filter } from 'lucide-react'

const logicTypes = {
  condition: { icon: GitBranch, color: 'bg-amber-500', label: 'Condition' },
  loop: { icon: Repeat, color: 'bg-teal-500', label: 'Loop' },
  delay: { icon: Timer, color: 'bg-rose-500', label: 'Delay' },
  filter: { icon: Filter, color: 'bg-cyan-500', label: 'Filter' },
}

type LogicNodeData = {
  label?: string
  type?: string
  description?: string
}

function LogicNode({ data, selected }: NodeProps<LogicNodeData>) {
  const logicType = logicTypes[data.type as keyof typeof logicTypes] || logicTypes.condition
  const LogicIcon = logicType.icon
  const isCondition = data.type === 'condition'

  return (
    <div
      className={cn(
        'glass rounded-xl p-4 min-w-[200px] transition-all duration-200',
        selected ? 'node-shadow-hover ring-2 ring-amber-500' : 'node-shadow'
      )}
    >
      <Handle
        type="target"
        position={Position.Left}
        className="!w-4 !h-4 !bg-amber-500 !border-2 !border-background"
      />
      
      <div className="flex items-center gap-3 mb-3">
        <div className={cn('h-10 w-10 rounded-lg flex items-center justify-center', logicType.color)}>
          <LogicIcon className="h-5 w-5 text-white" />
        </div>
        <div>
          <span className="text-xs text-amber-400 font-medium uppercase tracking-wide">Logic</span>
          <h4 className="font-semibold text-sm">{data.label || 'Logic'}</h4>
        </div>
      </div>
      {data.description && (
        <p className="text-xs text-muted-foreground">{data.description}</p>
      )}
      
      {/* Multiple outputs for condition nodes */}
      {isCondition ? (
        <>
          <Handle
            type="source"
            position={Position.Right}
            id="true"
            className="!w-4 !h-4 !bg-green-500 !border-2 !border-background !top-1/3"
          />
          <Handle
            type="source"
            position={Position.Right}
            id="false"
            className="!w-4 !h-4 !bg-red-500 !border-2 !border-background !top-2/3"
          />
          <div className="absolute right-0 top-1/3 -translate-y-1/2 translate-x-full ml-2 px-2">
            <span className="text-xs text-green-400">Yes</span>
          </div>
          <div className="absolute right-0 top-2/3 -translate-y-1/2 translate-x-full ml-2 px-2">
            <span className="text-xs text-red-400">No</span>
          </div>
        </>
      ) : (
        <Handle
          type="source"
          position={Position.Right}
          className="!w-4 !h-4 !bg-amber-500 !border-2 !border-background"
        />
      )}
    </div>
  )
}

export default memo(LogicNode)
