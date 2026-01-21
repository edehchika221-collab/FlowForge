import { create } from 'zustand'
import { Node, Edge } from '@xyflow/react'

interface Workflow {
  id: string
  name: string
  description: string
  nodes: Node[]
  edges: Edge[]
  status: 'active' | 'paused' | 'draft'
  createdAt: Date
  updatedAt: Date
}

interface WorkflowState {
  workflows: Workflow[]
  currentWorkflow: Workflow | null
  isLoading: boolean
  error: string | null

  // Actions
  setWorkflows: (workflows: Workflow[]) => void
  setCurrentWorkflow: (workflow: Workflow | null) => void
  updateCurrentWorkflow: (updates: Partial<Workflow>) => void
  saveWorkflow: (workflow: Workflow) => void
  deleteWorkflow: (id: string) => void
}

export const useWorkflowStore = create<WorkflowState>((set, get) => ({
  workflows: [],
  currentWorkflow: null,
  isLoading: false,
  error: null,

  setWorkflows: (workflows) => set({ workflows }),
  
  setCurrentWorkflow: (workflow) => set({ currentWorkflow: workflow }),
  
  updateCurrentWorkflow: (updates) => {
    const current = get().currentWorkflow
    if (current) {
      set({
        currentWorkflow: {
          ...current,
          ...updates,
          updatedAt: new Date(),
        },
      })
    }
  },
  
  saveWorkflow: (workflow) => {
    const workflows = get().workflows
    const index = workflows.findIndex((w) => w.id === workflow.id)
    if (index >= 0) {
      workflows[index] = workflow
    } else {
      workflows.push(workflow)
    }
    set({ workflows: [...workflows] })
  },
  
  deleteWorkflow: (id) => {
    set({
      workflows: get().workflows.filter((w) => w.id !== id),
    })
  },
}))
