import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  History, 
  Search, 
  Filter, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Calendar,
  ArrowRight,
  RefreshCw,
  MoreHorizontal
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { Link } from 'react-router-dom'
import { cn } from '@/lib/utils'

interface Execution {
  id: string
  workflowId: string
  workflowName: string
  status: 'success' | 'failed'
  startedAt: string
  completedAt: string
  duration: number
  logs?: string[]
}

export default function HistoryPage() {
  const [executions, setExecutions] = useState<Execution[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [filter, setFilter] = useState<'all' | 'success' | 'failed'>('all')

  const fetchHistory = async () => {
    try {
      setLoading(true)
      const res = await fetch('http://localhost:5000/api/workflows/executions')
      const data = await res.json()
      setExecutions(data)
    } catch (error) {
      console.error('Failed to fetch history:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchHistory()
  }, [])

  const filteredExecutions = executions.filter(exec => {
    const matchesSearch = exec.workflowName.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          exec.id.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesFilter = filter === 'all' || exec.status === filter
    return matchesSearch && matchesFilter
  })

  // Stats
  const totalRuns = executions.length
  const successCount = executions.filter(e => e.status === 'success').length
  const successRate = totalRuns > 0 ? Math.round((successCount / totalRuns) * 100) : 0
  const avgDuration = totalRuns > 0 
    ? Math.round(executions.reduce((acc, curr) => acc + curr.duration, 0) / totalRuns) 
    : 0

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight gradient-text">Execution History</h1>
          <p className="text-muted-foreground mt-1">
            View logs and status of all workflow runs
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={fetchHistory} className="gap-2">
            <RefreshCw className={cn("h-4 w-4", loading && "animate-spin")} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="p-6 glass border-border/50">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-blue-500/10 flex items-center justify-center">
              <History className="h-6 w-6 text-blue-500" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Runs</p>
              <h3 className="text-2xl font-bold">{totalRuns}</h3>
            </div>
          </div>
        </Card>
        <Card className="p-6 glass border-border/50">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-green-500/10 flex items-center justify-center">
              <CheckCircle className="h-6 w-6 text-green-500" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Success Rate</p>
              <h3 className="text-2xl font-bold">{successRate}%</h3>
            </div>
          </div>
        </Card>
        <Card className="p-6 glass border-border/50">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-purple-500/10 flex items-center justify-center">
              <Clock className="h-6 w-6 text-purple-500" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Avg. Duration</p>
              <h3 className="text-2xl font-bold">{avgDuration}ms</h3>
            </div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-card/50 p-4 rounded-xl border border-border/50">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search by workflow name or ID..." 
            className="pl-9 bg-background/50 border-border/50 focus:border-primary"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <select 
            className="bg-background/50 border border-border/50 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
            value={filter}
            onChange={(e) => setFilter(e.target.value as any)}
          >
            <option value="all">All Status</option>
            <option value="success">Success</option>
            <option value="failed">Failed</option>
          </select>
        </div>
      </div>

      {/* Executions List */}
      <div className="space-y-4">
        {filteredExecutions.length === 0 ? (
          <div className="text-center py-12">
            <div className="h-16 w-16 bg-muted/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <History className="h-8 w-8 text-muted-foreground/50" />
            </div>
            <h3 className="text-lg font-medium">No executions found</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Try running a workflow to see it appear here.
            </p>
          </div>
        ) : (
          filteredExecutions.map((exec, index) => (
            <motion.div
              key={exec.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className="hover:border-primary/50 transition-colors duration-200">
                <div className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className={cn(
                      "mt-1 rounded-full p-2 shrink-0",
                      exec.status === 'success' ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500"
                    )}>
                      {exec.status === 'success' ? (
                        <CheckCircle className="h-5 w-5" />
                      ) : (
                        <XCircle className="h-5 w-5" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold text-base">{exec.workflowName}</h4>
                        <span className="text-xs font-mono text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                          {exec.id.substring(0, 8)}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="h-3.5 w-3.5" />
                          {new Date(exec.startedAt).toLocaleString()}
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Clock className="h-3.5 w-3.5" />
                          {exec.duration}ms
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Link to={`/workflows/${exec.workflowId}`}>
                      <Button variant="ghost" size="sm" className="gap-2">
                        View Workflow
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </Link>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))
        )}
      </div>
    </div>
  )
}
