import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Search,
  Check,
  ExternalLink,
  Zap,
  Mail,
  MessageSquare,
  Database,
  FileSpreadsheet,
  Calendar,
  ShoppingCart,
  CreditCard,
  Users,
  Globe,
  Cloud,
} from 'lucide-react'
import { useState } from 'react'
import { cn } from '@/lib/utils'

interface Integration {
  id: string
  name: string
  description: string
  icon: any
  color: string
  category: string
  connected: boolean
  popular?: boolean
}

const integrations: Integration[] = [
  { id: 'slack', name: 'Slack', description: 'Send messages and notifications', icon: MessageSquare, color: 'bg-[#4A154B]', category: 'Communication', connected: true, popular: true },
  { id: 'gmail', name: 'Gmail', description: 'Send and manage emails', icon: Mail, color: 'bg-red-500', category: 'Communication', connected: true, popular: true },
  { id: 'notion', name: 'Notion', description: 'Manage pages and databases', icon: FileSpreadsheet, color: 'bg-gray-800', category: 'Productivity', connected: false, popular: true },
  { id: 'google-calendar', name: 'Google Calendar', description: 'Manage calendar events', icon: Calendar, color: 'bg-blue-500', category: 'Productivity', connected: false },
  { id: 'shopify', name: 'Shopify', description: 'Manage orders and products', icon: ShoppingCart, color: 'bg-green-600', category: 'E-commerce', connected: false, popular: true },
  { id: 'stripe', name: 'Stripe', description: 'Payment processing', icon: CreditCard, color: 'bg-violet-500', category: 'Finance', connected: true },
  { id: 'salesforce', name: 'Salesforce', description: 'CRM and sales automation', icon: Cloud, color: 'bg-sky-500', category: 'CRM', connected: false, popular: true },
  { id: 'hubspot', name: 'HubSpot', description: 'Marketing and sales', icon: Users, color: 'bg-orange-500', category: 'CRM', connected: false },
  { id: 'postgres', name: 'PostgreSQL', description: 'Database queries', icon: Database, color: 'bg-blue-700', category: 'Database', connected: false },
  { id: 'webhook', name: 'Webhooks', description: 'Custom HTTP integrations', icon: Globe, color: 'bg-gray-600', category: 'Developer', connected: true },
  { id: 'zapier', name: 'Zapier', description: 'Connect 5000+ apps', icon: Zap, color: 'bg-orange-400', category: 'Automation', connected: false },
  { id: 'airtable', name: 'Airtable', description: 'Spreadsheet database', icon: FileSpreadsheet, color: 'bg-teal-500', category: 'Productivity', connected: false },
]

const categories = ['All', 'Communication', 'Productivity', 'E-commerce', 'Finance', 'CRM', 'Database', 'Developer']

export default function Integrations() {
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All')

  const filteredIntegrations = integrations.filter((integration) => {
    const matchesSearch = integration.name.toLowerCase().includes(search.toLowerCase()) ||
      integration.description.toLowerCase().includes(search.toLowerCase())
    const matchesCategory = category === 'All' || integration.category === category
    return matchesSearch && matchesCategory
  })

  const connectedCount = integrations.filter((i) => i.connected).length

  return (
    <div className="space-y-6 animate-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Integrations</h1>
          <p className="text-muted-foreground mt-1">
            Connect your favorite apps • {connectedCount} connected
          </p>
        </div>
        <Button variant="outline" className="gap-2">
          <ExternalLink className="h-4 w-4" />
          Request Integration
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search integrations..."
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

      {/* Popular Section */}
      {category === 'All' && !search && (
        <div>
          <h2 className="text-lg font-semibold mb-4">🔥 Popular Integrations</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {integrations.filter((i) => i.popular).map((integration) => (
              <Card key={integration.id} className="group hover:border-primary/50 transition-all cursor-pointer">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className={cn('h-10 w-10 rounded-lg flex items-center justify-center', integration.color)}>
                      <integration.icon className="h-5 w-5 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm">{integration.name}</span>
                        {integration.connected && (
                          <Check className="h-4 w-4 text-green-400" />
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* All Integrations Grid */}
      <div>
        <h2 className="text-lg font-semibold mb-4">
          {category === 'All' ? 'All Integrations' : category}
        </h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredIntegrations.map((integration, index) => (
            <Card
              key={integration.id}
              className={cn(
                'group hover:border-primary/50 transition-all cursor-pointer',
                `stagger-${(index % 5) + 1}`
              )}
            >
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className={cn('h-12 w-12 rounded-xl flex items-center justify-center shrink-0', integration.color)}>
                    <integration.icon className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold">{integration.name}</h3>
                      {integration.connected && (
                        <span className="flex items-center gap-1 text-xs text-green-400 bg-green-400/10 px-2 py-0.5 rounded-full">
                          <Check className="h-3 w-3" />
                          Connected
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">{integration.description}</p>
                    <span className="text-xs text-muted-foreground px-2 py-1 bg-muted rounded-md">
                      {integration.category}
                    </span>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-border opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    variant={integration.connected ? 'outline' : 'default'}
                    size="sm"
                    className="w-full"
                  >
                    {integration.connected ? 'Manage' : 'Connect'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Empty State */}
      {filteredIntegrations.length === 0 && (
        <div className="text-center py-12">
          <Globe className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No integrations found</h3>
          <p className="text-muted-foreground mb-4">Try a different search term or category</p>
        </div>
      )}
    </div>
  )
}
