import { Routes, Route } from 'react-router-dom'
import { Toaster } from '@/components/ui/toaster'
import Layout from '@/components/layout/Layout'
import Dashboard from '@/pages/Dashboard'
import Workflows from '@/pages/Workflows'
import WorkflowEditor from '@/pages/WorkflowEditor'
import Integrations from '@/pages/Integrations'
import Templates from '@/pages/Templates'
import Settings from '@/pages/Settings'
import Landing from '@/pages/Landing'
import History from '@/pages/History'

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route element={<Layout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/workflows" element={<Workflows />} />
          <Route path="/workflows/:id" element={<WorkflowEditor />} />
          <Route path="/integrations" element={<Integrations />} />
          <Route path="/templates" element={<Templates />} />
          <Route path="/history" element={<History />} />
          <Route path="/settings" element={<Settings />} />
        </Route>
      </Routes>
      <Toaster />
    </>
  )
}

export default App
