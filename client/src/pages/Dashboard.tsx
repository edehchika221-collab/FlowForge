import { Link } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Workflow,
  Zap,
  Clock,
  TrendingUp,
  ArrowRight,
  Plus,
  Play,
  CheckCircle2,
  XCircle,
  Activity,
  Sparkles,
} from 'lucide-react'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'

const stats = [
  {
    title: 'Active Workflows',
    value: '12',
    change: '+2 this week',
    icon: Workflow,
    color: 'text-primary',
    bgColor: 'bg-primary/10',
  },
  {
    title: 'Executions Today',
    value: '1,284',
    change: '+18% vs yesterday',
    icon: Zap,
    color: 'text-green-400',
    bgColor: 'bg-green-400/10',
  },
  {
    title: 'Success Rate',
    value: '99.2%',
    change: '+0.3% this week',
    icon: TrendingUp,
    color: 'text-blue-400',
    bgColor: 'bg-blue-400/10',
  },
  {
    title: 'Time Saved',
    value: '47h',
    change: 'This month',
    icon: Clock,
    color: 'text-purple-400',
    bgColor: 'bg-purple-400/10',
  },
]

const chartData = [
  { name: 'Mon', executions: 240, success: 235 },
  { name: 'Tue', executions: 320, success: 318 },
  { name: 'Wed', executions: 280, success: 275 },
  { name: 'Thu', executions: 390, success: 385 },
  { name: 'Fri', executions: 480, success: 470 },
  { name: 'Sat', executions: 220, success: 218 },
  { name: 'Sun', executions: 180, success: 178 },
]

const recentExecutions = [
  { id: 1, workflow: 'Lead Nurturing', status: 'success', time: '2 min ago' },
  { id: 2, workflow: 'Daily Report', status: 'success', time: '15 min ago' },
  { id: 3, workflow: 'Customer Onboarding', status: 'failed', time: '32 min ago' },
  { id: 4, workflow: 'Slack Notifications', status: 'success', time: '1 hour ago' },
  { id: 5, workflow: 'Data Sync', status: 'success', time: '2 hours ago' },
]

const quickActions = [
  { title: 'Create Workflow', icon: Plus, href: '/workflows/new', color: 'from-primary to-secondary' },
  { title: 'Browse Templates', icon: Sparkles, href: '/templates', color: 'from-purple-500 to-pink-500' },
  { title: 'Add Integration', icon: Zap, href: '/integrations', color: 'from-green-500 to-emerald-500' },
]

export default function Dashboard() {
  return (
    <div className="space-y-8 animate-in">
      {/* Welcome Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Welcome back! 👋</h1>
          <p className="text-muted-foreground mt-1">
            Here's what's happening with your automations today.
          </p>
        </div>
        <Link to="/workflows/new">
          <Button variant="gradient" className="gap-2">
            <Plus className="h-4 w-4" />
            Create Workflow
          </Button>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <Card key={stat.title} className={`stagger-${index + 1}`}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.title}</p>
                  <p className="text-3xl font-bold mt-1">{stat.value}</p>
                  <p className="text-xs text-muted-foreground mt-1">{stat.change}</p>
                </div>
                <div className={`h-12 w-12 rounded-xl ${stat.bgColor} flex items-center justify-center`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts and Activity */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Chart */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Execution History</CardTitle>
            <Button variant="ghost" size="sm">
              View All
            </Button>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorExecutions" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorSuccess" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="name" stroke="#9ca3af" fontSize={12} />
                  <YAxis stroke="#9ca3af" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1f2937',
                      border: '1px solid #374151',
                      borderRadius: '8px',
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="executions"
                    stroke="#6366f1"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorExecutions)"
                  />
                  <Area
                    type="monotone"
                    dataKey="success"
                    stroke="#22c55e"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorSuccess)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Recent Activity</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="space-y-4">
            {recentExecutions.map((execution) => (
              <div
                key={execution.id}
                className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
              >
                {execution.status === 'success' ? (
                  <CheckCircle2 className="h-5 w-5 text-green-400 shrink-0" />
                ) : (
                  <XCircle className="h-5 w-5 text-red-400 shrink-0" />
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{execution.workflow}</p>
                  <p className="text-xs text-muted-foreground">{execution.time}</p>
                </div>
                <Button variant="ghost" size="icon" className="shrink-0">
                  <Play className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {quickActions.map((action) => (
            <Link key={action.title} to={action.href}>
              <Card className="group hover:border-primary/50 transition-all duration-300 cursor-pointer overflow-hidden">
                <CardContent className="p-6 relative">
                  <div className={`absolute inset-0 bg-gradient-to-br ${action.color} opacity-0 group-hover:opacity-5 transition-opacity`} />
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`h-12 w-12 rounded-xl bg-gradient-to-br ${action.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                        <action.icon className="h-6 w-6 text-white" />
                      </div>
                      <span className="font-semibold">{action.title}</span>
                    </div>
                    <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-foreground group-hover:translate-x-1 transition-all" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
