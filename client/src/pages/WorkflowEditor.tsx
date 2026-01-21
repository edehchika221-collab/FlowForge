import { useCallback, useState, useMemo, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Edge,
  BackgroundVariant,
  Panel,
  Node,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  ArrowLeft,
  Save,
  Play,
  Undo,
  Redo,
  Settings,
  Sparkles,
  Plus,
} from "lucide-react";
import TriggerNode from "@/components/workflow/nodes/TriggerNode";
import ActionNode from "@/components/workflow/nodes/ActionNode";
import AINode from "@/components/workflow/nodes/AINode";
import LogicNode from "@/components/workflow/nodes/LogicNode";
import NodeLibrary from "@/components/workflow/NodeLibrary";
import NodeConfigPanel from "@/components/workflow/NodeConfigPanel";
import { useWorkflowStore } from "@/stores/workflowStore";

const nodeTypes = {
  trigger: TriggerNode,
  action: ActionNode,
  ai: AINode,
  logic: LogicNode,
};

export default function WorkflowEditor() {
  const { id } = useParams();
  const { fetchWorkflow, createWorkflow, updateWorkflow } = useWorkflowStore();
  const navigate = useNavigate();

  // State
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [showLibrary, setShowLibrary] = useState(true);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [workflowName, setWorkflowName] = useState("Untitled Workflow");
  const [isSaving, setIsSaving] = useState(false);

  // Load workflow data
  useEffect(() => {
    const loadWorkflow = async () => {
      if (id && id !== "new") {
        const workflow = await fetchWorkflow(id);
        if (workflow) {
          setWorkflowName(workflow.name);
          setNodes(workflow.nodes || []);
          setEdges(workflow.edges || []);
        }
      }
    };
    loadWorkflow();
  }, [id, fetchWorkflow, setNodes, setEdges]);

  const onConnect = useCallback(
    (params: Connection) =>
      setEdges((eds) => addEdge({ ...params, animated: true }, eds)),
    [setEdges],
  );

  const onSave = async () => {
    setIsSaving(true);
    try {
      const workflowData = {
        name: workflowName,
        nodes,
        edges,
        status: "active" as const, // Default to active for now
      };

      if (id === "new") {
        const newWorkflow = await createWorkflow(workflowData);
        if (newWorkflow) {
          navigate(`/workflows/${newWorkflow.id}`);
        }
      } else if (id) {
        await updateWorkflow(id, workflowData);
      }
    } finally {
      setIsSaving(false);
    }
  };

  const onNodeClick = useCallback((_: React.MouseEvent, node: any) => {
    setSelectedNode(node.id);
  }, []);

  const onPaneClick = useCallback(() => {
    setSelectedNode(null);
  }, []);

  const selectedNodeData = useMemo(() => {
    if (!selectedNode) return null;
    return nodes.find((n) => n.id === selectedNode);
  }, [selectedNode, nodes]);

  const addNode = useCallback(
    (type: string, nodeType: string, label: string) => {
      const newNode = {
        id: `${Date.now()}`,
        type,
        position: {
          x: Math.random() * 400 + 200,
          y: Math.random() * 300 + 100,
        },
        data: { label, type: nodeType, description: "" },
      };
      setNodes((nds) => [...nds, newNode]);
    },
    [setNodes],
  );

  return (
    <div className="h-[calc(100vh-7rem)] flex flex-col -m-6">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-card">
        <div className="flex items-center gap-4">
          <Link to="/workflows">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div className="h-6 w-px bg-border" />
          <Input
            value={workflowName}
            onChange={(e) => setWorkflowName(e.target.value)}
            className="w-64 h-9 bg-transparent border-transparent hover:border-border focus:border-border transition-colors font-semibold"
          />
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" disabled>
            <Undo className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" disabled>
            <Redo className="h-4 w-4" />
          </Button>
          <div className="h-6 w-px bg-border" />
          <Button variant="outline" size="sm" className="gap-2">
            <Settings className="h-4 w-4" />
            Settings
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="gap-2"
            onClick={onSave}
            disabled={isSaving}
          >
            <Save className="h-4 w-4" />
            {isSaving ? "Saving..." : "Save"}
          </Button>
          <Button variant="gradient" size="sm" className="gap-2">
            <Play className="h-4 w-4" />
            Run
          </Button>
        </div>
      </div>

      {/* Editor */}
      <div className="flex-1 flex">
        {/* Node Library */}
        {showLibrary && (
          <NodeLibrary
            onAddNode={addNode}
            onClose={() => setShowLibrary(false)}
          />
        )}

        {/* Canvas */}
        <div className="flex-1 relative">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onNodeClick={onNodeClick}
            onPaneClick={onPaneClick}
            nodeTypes={nodeTypes}
            fitView
            className="bg-background"
          >
            <Background
              variant={BackgroundVariant.Dots}
              gap={24}
              size={1}
              color="rgba(99, 102, 241, 0.15)"
            />
            <Controls className="!bg-card !border-border" />
            <MiniMap
              className="!bg-card !border-border"
              nodeColor={(node) => {
                switch (node.type) {
                  case "trigger":
                    return "#22c55e";
                  case "action":
                    return "#3b82f6";
                  case "ai":
                    return "#6366f1";
                  case "logic":
                    return "#f59e0b";
                  default:
                    return "#6b7280";
                }
              }}
            />

            {/* AI Panel */}
            <Panel position="bottom-center" className="mb-4">
              <div className="glass rounded-xl p-4 max-w-xl">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center shrink-0">
                    <Sparkles className="h-5 w-5 text-white" />
                  </div>
                  <Input
                    placeholder="Describe your workflow in natural language... (e.g., 'When I receive a Slack message, analyze sentiment and reply')"
                    className="flex-1 bg-transparent border-transparent focus:border-primary placeholder:text-muted-foreground/60"
                  />
                  <Button variant="gradient" size="sm">
                    Generate
                  </Button>
                </div>
              </div>
            </Panel>

            {/* Add Node Button */}
            {!showLibrary && (
              <Panel position="top-left" className="ml-2 mt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowLibrary(true)}
                  className="gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Add Node
                </Button>
              </Panel>
            )}
          </ReactFlow>
        </div>

        {/* Config Panel */}
        {selectedNodeData && (
          <NodeConfigPanel
            node={selectedNodeData}
            onClose={() => setSelectedNode(null)}
            onUpdate={(data) => {
              setNodes((nds) =>
                nds.map((n) =>
                  n.id === selectedNode
                    ? { ...n, data: { ...n.data, ...data } }
                    : n,
                ),
              );
            }}
          />
        )}
      </div>
    </div>
  );
}
