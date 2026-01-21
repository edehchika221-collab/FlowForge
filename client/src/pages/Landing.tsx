import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { 
  Sparkles, 
  Zap, 
  Bot, 
  Workflow, 
  ArrowRight,
  Play,
  CheckCircle2,
  Star
} from 'lucide-react'
import { motion } from 'framer-motion'

const features = [
  {
    icon: Workflow,
    title: 'Visual Workflow Builder',
    description: 'Drag and drop nodes to create powerful automation sequences without writing code.',
  },
  {
    icon: Bot,
    title: 'AI-Powered Actions',
    description: 'Leverage Claude AI to generate content, extract data, and make intelligent decisions.',
  },
  {
    icon: Zap,
    title: 'Instant Triggers',
    description: 'React to events in real-time with webhooks, schedules, and app integrations.',
  },
]

const stats = [
  { value: '200+', label: 'Integrations' },
  { value: '10M+', label: 'Workflows Run' },
  { value: '99.9%', label: 'Uptime' },
  { value: '5min', label: 'Avg. Setup Time' },
]

export default function Landing() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/10">
        <div className="mx-auto max-w-7xl px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-secondary">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold gradient-text">FlowForge AI</span>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/dashboard">
              <Button variant="ghost">Dashboard</Button>
            </Link>
            <Link to="/dashboard">
              <Button variant="gradient">Get Started Free</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 dot-pattern opacity-30" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/20 rounded-full blur-3xl" />
        
        <div className="relative mx-auto max-w-7xl px-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            {/* Badge */}
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 border border-primary/20 px-4 py-1.5 mb-8">
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-primary">AI-Powered Automation</span>
            </div>
            
            {/* Headline */}
            <h1 className="text-5xl sm:text-7xl font-extrabold tracking-tight mb-6">
              Automate Smarter with{' '}
              <span className="gradient-text">Intelligent Workflows</span>
            </h1>
            
            {/* Subtitle */}
            <p className="mx-auto max-w-2xl text-xl text-muted-foreground mb-10">
              Build powerful automations in minutes with our visual workflow builder. 
              Let AI handle the complex logic while you focus on growing your business.
            </p>
            
            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/dashboard">
                <Button size="xl" variant="gradient" className="gap-2">
                  Start Building Free
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
              <Button size="xl" variant="glass" className="gap-2">
                <Play className="h-5 w-5" />
                Watch Demo
              </Button>
            </div>
            
            {/* Trust Badges */}
            <div className="flex items-center justify-center gap-8 mt-12 text-muted-foreground">
              <div className="flex items-center gap-1">
                <CheckCircle2 className="h-4 w-4 text-success" />
                <span className="text-sm">No credit card required</span>
              </div>
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 text-warning" />
                <span className="text-sm">4.9/5 from 2,000+ reviews</span>
              </div>
            </div>
          </motion.div>
          
          {/* Hero Image - Workflow Preview */}
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mt-16 relative"
          >
            <div className="relative mx-auto max-w-5xl rounded-2xl overflow-hidden border border-border shadow-2xl shadow-primary/10">
              <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent z-10" />
              <div className="bg-card p-8">
                {/* Mock Workflow Canvas */}
                <div className="relative h-96 rounded-xl bg-background border border-border grid-pattern overflow-hidden">
                  {/* Mock Nodes */}
                  <div className="absolute left-12 top-20 glass rounded-xl p-4 w-48 node-shadow">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="h-8 w-8 rounded-lg bg-green-500/20 flex items-center justify-center">
                        <Zap className="h-4 w-4 text-green-400" />
                      </div>
                      <span className="font-medium text-sm">Webhook</span>
                    </div>
                    <p className="text-xs text-muted-foreground">Receive incoming data</p>
                  </div>
                  
                  <div className="absolute left-72 top-36 glass rounded-xl p-4 w-48 node-shadow animate-pulse-glow">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="h-8 w-8 rounded-lg bg-primary/20 flex items-center justify-center">
                        <Bot className="h-4 w-4 text-primary" />
                      </div>
                      <span className="font-medium text-sm">AI Process</span>
                    </div>
                    <p className="text-xs text-muted-foreground">Analyze with Claude</p>
                  </div>
                  
                  <div className="absolute right-12 top-20 glass rounded-xl p-4 w-48 node-shadow">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="h-8 w-8 rounded-lg bg-blue-500/20 flex items-center justify-center">
                        <svg className="h-4 w-4 text-blue-400" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523A2.528 2.528 0 0 1 0 15.165a2.527 2.527 0 0 1 2.522-2.52h2.52v2.52zm1.271 0a2.527 2.527 0 0 1 2.521-2.52 2.527 2.527 0 0 1 2.521 2.52v6.313A2.528 2.528 0 0 1 8.834 24a2.528 2.528 0 0 1-2.521-2.522v-6.313z"/>
                        </svg>
                      </div>
                      <span className="font-medium text-sm">Slack</span>
                    </div>
                    <p className="text-xs text-muted-foreground">Send notification</p>
                  </div>
                  
                  {/* Connection Lines */}
                  <svg className="absolute inset-0 w-full h-full pointer-events-none">
                    <path
                      d="M 210 145 Q 260 145 280 180"
                      fill="none"
                      stroke="url(#gradient)"
                      strokeWidth="2"
                      strokeDasharray="5,5"
                      className="animate-pulse"
                    />
                    <path
                      d="M 520 180 Q 540 145 590 145"
                      fill="none"
                      stroke="url(#gradient)"
                      strokeWidth="2"
                      strokeDasharray="5,5"
                      className="animate-pulse"
                    />
                    <defs>
                      <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#6366f1" />
                        <stop offset="100%" stopColor="#a855f7" />
                      </linearGradient>
                    </defs>
                  </svg>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 border-y border-border bg-card/50">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="text-4xl font-bold gradient-text mb-1">{stat.value}</div>
                <div className="text-muted-foreground">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">
              Everything you need to{' '}
              <span className="gradient-text">automate</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Powerful features that make automation accessible to everyone
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group relative"
              >
                <div className="glass rounded-2xl p-8 h-full transition-all duration-300 hover:bg-white/10 hover:border-primary/30">
                  <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <feature.icon className="h-7 w-7 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 gradient-animated opacity-10" />
        <div className="relative mx-auto max-w-4xl px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to automate your workflow?
          </h2>
          <p className="text-xl text-muted-foreground mb-10">
            Join thousands of teams already saving hours every week with FlowForge AI
          </p>
          <Link to="/dashboard">
            <Button size="xl" variant="gradient" className="gap-2">
              Get Started Free
              <ArrowRight className="h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-12">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-secondary">
                <Sparkles className="h-4 w-4 text-white" />
              </div>
              <span className="font-bold gradient-text">FlowForge AI</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2026 FlowForge AI. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
