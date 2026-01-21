import { Link } from 'react-router-dom'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Plus,
  Search,
  MoreVertical,
  Play,
  Pause,
  Copy,
  Trash2,
  Workflow as WorkflowIcon,
  Clock,
  CheckCircle2,
  XCircle,
  Zap,
  Bot,
  Mail,
  Filter,
} from 'lucide-react'
import { useState } from 'react'
import { cn } from '@/lib/utils'

interface Workflow {
  id: string
  name: string
  description: string
  status: 'active' | 'paused' | 'draft'
  lastRun: string
  executions: number
  successRate: number
  trigger: 'webhook' | 'schedule' | 'manual' | 'ai'
}

const mockWorkflows: Workflow[] = [
  {
    id: '1',
    name: 'Lead Nurturing Automation',
    description: 'Automatically send personalized follow-ups based on lead behavior',
    status: 'active',
    lastRun: '2 minutes ago',
    executions: 1284,
    successRate: 99.2,
    trigger: 'webhook',
  },
  {
    id: '2',
    name: 'Daily Slack Report',
    description: 'Generate and send daily performance reports to team channels',
    status: 'active',
    lastRun: '6 hours ago',
    executions: 180,
    successRate: 100,
    trigger: 'schedule',
  },
  {
    id: '3',
    name: 'AI Customer Support',
    description: 'Route and respond to support tickets using AI classification',
    status: 'active',
    lastRun: '15 minutes ago',
    executions: 892,
    successRate: 97.5,
    trigger: 'ai',
  },
  {
    id: '4',
    name: 'E-commerce Order Sync',
    description: 'Sync orders between Shopify and your CRM',
    status: 'paused',
    lastRun: '2 days ago',
    executions: 4521,
    successRate: 99.8,
    trigger: 'webhook',
  },
  {
    id: '5',
    name: 'Email Campaign Tracker',
    description: 'Track email opens and update lead scores automatically',
    status: 'draft',
    lastRun: 'Never',
    executions: 0,
    successRate: 0,
    trigger: 'manual',
  },
]

const triggerIcons = {
  webhook: Zap,
  schedule: Clock,
  manual: Play,
  ai: Bot,
}

const triggerColors = {
  webhook: 'text-green-400 bg-green-400/10',
  schedule: 'text-blue-400 bg-blue-400/10',
  manual: 'text-purple-400 bg-purple-400/10',
  ai: 'text-primary bg-primary/10',
}

const statusColors = {
  active: 'text-green-400 bg-green-400/10 border-green-400/30',
  paused: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/30',
  draft: 'text-muted-foreground bg-muted border-border',
}

export default function Workflows() {
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<'all' | 'active' | 'paused' | 'draft'>('all')

  const filteredWorkflows = mockWorkflows.filter((workflow) => {
    const matchesSearch = workflow.name.toLowerCase().includes(search.toLowerCase())
    const matchesFilter = filter === 'all' || workflow.status === filter
    return matchesSearch && matchesFilter
  })

  return (
    <div className="space-y-6 animate-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Workflows</h1>
          <p className="text-muted-foreground mt-1">
            Manage and monitor your automation workflows
          </p>
        </div>
        <Link to="/workflows/new">
          <Button variant="gradient" className="gap-2">
            <Plus className="h-4 w-4" />
            Create Workflow
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search workflows..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          {(['all', 'active', 'paused', 'draft'] as const).map((status) => (
            <Button
              key={status}
              variant={filter === status ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter(status)}
              className="capitalize"
            >
              {status === 'all' && <Filter className="h-4 w-4 mr-2" />}
              {status}
            </Button>
          ))}
        </div>
      </div>

      {/* Workflows Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredWorkflows.map((workflow, index) => {
          const TriggerIcon = triggerIcons[workflow.trigger]
          return (
            <Link key={workflow.id} to={`/workflows/${workflow.id}`}>
              <Card
                className={cn(
                  'group h-full hover:border-primary/50 transition-all duration-300 cursor-pointer',
                  `stagger-${(index % 5) + 1}`
                )}
              >
                <CardContent className="p-6">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className={cn('h-10 w-10 rounded-xl flex items-center justify-center', triggerColors[workflow.trigger])}>
                      <TriggerIcon className="h-5 w-5" />
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className={cn(
                          'px-2.5 py-0.5 rounded-full text-xs font-medium border capitalize',
                          statusColors[workflow.status]
                        )}
                      >
                        {workflow.status}
                      </span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={(e) => e.preventDefault()}
                      >
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Content */}
                  <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors">
                    {workflow.name}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                    {workflow.description}
                  </p>

                  {/* Stats */}
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <WorkflowIcon className="h-4 w-4" />
                        <span>{workflow.executions.toLocaleString()}</span>
                      </div>
                      {workflow.successRate > 0 && (
                        <div className="flex items-center gap-1">
                          {workflow.successRate >= 98 ? (
                            <CheckCircle2 className="h-4 w-4 text-green-400" />
                          ) : (
                            <XCircle className="h-4 w-4 text-yellow-400" />
                          )}
                          <span className={workflow.successRate >= 98 ? 'text-green-400' : 'text-yellow-400'}>
                            {workflow.successRate}%
                          </span>
                        </div>
                      )}
                    </div>
                    <span className="text-xs text-muted-foreground">{workflow.lastRun}</span>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 mt-4 pt-4 border-t border-border opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="flex-1"
                      onClick={(e) => e.preventDefault()}
                    >
                      {workflow.status === 'active' ? (
                        <>
                          <Pause className="h-4 w-4 mr-2" /> Pause
                        </>
                      ) : (
                        <>
                          <Play className="h-4 w-4 mr-2" /> Run
                        </>
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => e.preventDefault()}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-red-400 hover:text-red-300"
                      onClick={(e) => e.preventDefault()}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </Link>
          )
        })}

        {/* Create New Card */}
        <Link to="/workflows/new">
          <Card className="h-full border-dashed hover:border-primary/50 hover:bg-primary/5 transition-all duration-300 cursor-pointer group">
            <CardContent className="p-6 h-full flex flex-col items-center justify-center text-center min-h-[280px]">
              <div className="h-14 w-14 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Plus className="h-7 w-7 text-primary" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Create New Workflow</h3>
              <p className="text-sm text-muted-foreground">
                Start from scratch or use a template
              </p>
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* Empty State */}
      {filteredWorkflows.length === 0 && (
        <div className="text-center py-12">
          <WorkflowIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No workflows found</h3>
          <p className="text-muted-foreground mb-4">
            {search ? 'Try a different search term' : 'Create your first workflow to get started'}
          </p>
          <Link to="/workflows/new">
            <Button variant="gradient">
              <Plus className="h-4 w-4 mr-2" />
              Create Workflow
            </Button>
          </Link>
        </div>
      )}
    </div>
  )
}
