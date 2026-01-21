import { Link } from 'react-router-dom'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Search,
  ArrowRight,
  Zap,
  Mail,
  Users,
  ShoppingCart,
  Bell,
  FileText,
  Clock,
  Sparkles,
  TrendingUp,
  MessageSquare,
  Database,
} from 'lucide-react'
import { useState } from 'react'
import { cn } from '@/lib/utils'

interface Template {
  id: string
  name: string
  description: string
  category: string
  icon: any
  color: string
  uses: number
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced'
  aiPowered?: boolean
}

const templates: Template[] = [
  {
    id: '1',
    name: 'Lead Nurturing Sequence',
    description: 'Automatically follow up with leads based on their engagement and behavior',
    category: 'Marketing',
    icon: Users,
    color: 'from-blue-500 to-cyan-500',
    uses: 4582,
    difficulty: 'Intermediate',
    aiPowered: true,
  },
  {
    id: '2',
    name: 'Daily Slack Standup',
    description: 'Collect team updates and post a summary to your Slack channel',
    category: 'Productivity',
    icon: MessageSquare,
    color: 'from-purple-500 to-pink-500',
    uses: 3291,
    difficulty: 'Beginner',
  },
  {
    id: '3',
    name: 'E-commerce Order Alerts',
    description: 'Get notified in Slack when new orders come in from Shopify',
    category: 'E-commerce',
    icon: ShoppingCart,
    color: 'from-green-500 to-emerald-500',
    uses: 2847,
    difficulty: 'Beginner',
  },
  {
    id: '4',
    name: 'AI Customer Support',
    description: 'Classify and auto-respond to support tickets using AI',
    category: 'Support',
    icon: Sparkles,
    color: 'from-primary to-secondary',
    uses: 2156,
    difficulty: 'Advanced',
    aiPowered: true,
  },
  {
    id: '5',
    name: 'Weekly Report Generator',
    description: 'Compile data from multiple sources into a weekly summary email',
    category: 'Reporting',
    icon: FileText,
    color: 'from-orange-500 to-red-500',
    uses: 1893,
    difficulty: 'Intermediate',
    aiPowered: true,
  },
  {
    id: '6',
    name: 'Social Media Scheduler',
    description: 'Schedule and post content across multiple social platforms',
    category: 'Marketing',
    icon: Clock,
    color: 'from-pink-500 to-rose-500',
    uses: 1654,
    difficulty: 'Beginner',
  },
  {
    id: '7',
    name: 'New User Onboarding',
    description: 'Send welcome emails and set up accounts for new users',
    category: 'Operations',
    icon: Mail,
    color: 'from-yellow-500 to-orange-500',
    uses: 1432,
    difficulty: 'Intermediate',
  },
  {
    id: '8',
    name: 'Database Sync',
    description: 'Keep your databases synchronized across multiple platforms',
    category: 'Developer',
    icon: Database,
    color: 'from-teal-500 to-cyan-500',
    uses: 1287,
    difficulty: 'Advanced',
  },
  {
    id: '9',
    name: 'Lead Score Calculator',
    description: 'Calculate lead scores based on behavior and update CRM',
    category: 'Sales',
    icon: TrendingUp,
    color: 'from-indigo-500 to-purple-500',
    uses: 1156,
    difficulty: 'Intermediate',
    aiPowered: true,
  },
]

const categories = ['All', 'Marketing', 'Productivity', 'E-commerce', 'Support', 'Sales', 'Developer']

const difficultyColors = {
  Beginner: 'text-green-400 bg-green-400/10',
  Intermediate: 'text-yellow-400 bg-yellow-400/10',
  Advanced: 'text-red-400 bg-red-400/10',
}

export default function Templates() {
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All')

  const filteredTemplates = templates.filter((template) => {
    const matchesSearch = template.name.toLowerCase().includes(search.toLowerCase()) ||
      template.description.toLowerCase().includes(search.toLowerCase())
    const matchesCategory = category === 'All' || template.category === category
    return matchesSearch && matchesCategory
  })

  return (
    <div className="space-y-6 animate-in">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Templates</h1>
        <p className="text-muted-foreground mt-1">
          Start quickly with pre-built workflow templates
        </p>
      </div>

      {/* Featured Template */}
      <Card className="overflow-hidden border-primary/30 bg-gradient-to-r from-primary/10 to-secondary/10">
        <CardContent className="p-8">
          <div className="flex flex-col md:flex-row gap-6 items-center">
            <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shrink-0">
              <Sparkles className="h-10 w-10 text-white" />
            </div>
            <div className="flex-1 text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
                <span className="text-xs font-medium text-primary bg-primary/20 px-2 py-0.5 rounded-full">
                  ✨ Featured
                </span>
                <span className="text-xs font-medium text-primary bg-primary/20 px-2 py-0.5 rounded-full">
                  AI-Powered
                </span>
              </div>
              <h2 className="text-2xl font-bold mb-2">AI Content Pipeline</h2>
              <p className="text-muted-foreground mb-4">
                Generate, review, and publish content automatically using Claude AI. Perfect for marketing teams.
              </p>
              <Link to="/workflows/new?template=ai-content">
                <Button variant="gradient" className="gap-2">
                  Use Template
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search templates..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
          {categories.map((cat) => (
            <Button
              key={cat}
              variant={category === cat ? 'default' : 'outline'}
              size="sm"
              onClick={() => setCategory(cat)}
              className="whitespace-nowrap"
            >
              {cat}
            </Button>
          ))}
        </div>
      </div>

      {/* Templates Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredTemplates.map((template, index) => (
          <Link key={template.id} to={`/workflows/new?template=${template.id}`}>
            <Card
              className={cn(
                'group h-full hover:border-primary/50 transition-all cursor-pointer overflow-hidden',
                `stagger-${(index % 5) + 1}`
              )}
            >
              <CardContent className="p-6">
                <div className="flex items-start gap-4 mb-4">
                  <div className={cn('h-12 w-12 rounded-xl bg-gradient-to-br flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform', template.color)}>
                    <template.icon className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className={cn('text-xs font-medium px-2 py-0.5 rounded-full', difficultyColors[template.difficulty])}>
                        {template.difficulty}
                      </span>
                      {template.aiPowered && (
                        <span className="flex items-center gap-1 text-xs font-medium text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                          <Sparkles className="h-3 w-3" />
                          AI
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                
                <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors">
                  {template.name}
                </h3>
                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                  {template.description}
                </p>
                
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground px-2 py-1 bg-muted rounded-md">
                    {template.category}
                  </span>
                  <span className="text-muted-foreground flex items-center gap-1">
                    <Zap className="h-4 w-4" />
                    {template.uses.toLocaleString()} uses
                  </span>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Empty State */}
      {filteredTemplates.length === 0 && (
        <div className="text-center py-12">
          <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No templates found</h3>
          <p className="text-muted-foreground mb-4">Try a different search term or category</p>
        </div>
      )}
    </div>
  )
}
