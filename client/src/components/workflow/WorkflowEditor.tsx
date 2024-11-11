import React, { useState, useCallback, useEffect } from 'react';
import ReactFlow, { 
  Background, 
  Controls,
  Connection,
  Edge,
  Node,
  addEdge,
  useNodesState,
  useEdgesState
} from 'reactflow';
import 'reactflow/dist/style.css';
import { WorkflowNode } from './WorkflowNode';
import { WorkflowControls } from './WorkflowControls';
import { NodeDialog } from './NodeDialog';
import { useWorkflowStore } from '../../store/workflowStore';

const nodeTypes = {
  workflowNode: WorkflowNode,
};

export const WorkflowEditor = () => {
  const { currentWorkflow, updateWorkflow } = useWorkflowStore();
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingNode, setEditingNode] = useState<Node | null>(null);
  const [availableScripts, setAvailableScripts] = useState<string[]>([]);

  useEffect(() => {
    // Load available scripts
    fetch('http://localhost:3000/api/files/tree')
      .then(res => res.json())
      .then(tree => {
        const scripts: string[] = [];
        const extractScripts = (items: any[]) => {
          items.forEach(item => {
            if (item.type === 'file' && item.path.endsWith('.js')) {
              scripts.push(item.path);
            }
            if (item.children) {
              extractScripts(item.children);
            }
          });
        };
        extractScripts(tree);
        setAvailableScripts(scripts);
      });
  }, []);

  const onConnect = useCallback(
    (params: Connection) => {
      if (params.source === params.target) {
        const label = window.prompt('Enter repeat count (-1 or >0):', '1');
        if (label) {
          const count = parseInt(label);
          if (count === -1 || count > 0) {
            setEdges((eds) => 
              addEdge({ 
                ...params, 
                label: `repeats: ${count}`,
                type: 'smoothstep',
                animated: true 
              }, eds)
            );
          }
        }
      } else {
        setEdges((eds) => addEdge({ ...params, type: 'smoothstep' }, eds));
      }
    },
    [setEdges]
  );

  const onSave = useCallback(() => {
    if (currentWorkflow) {
      updateWorkflow({
        ...currentWorkflow,
        nodes,
        edges
      });
    }
  }, [currentWorkflow, nodes, edges, updateWorkflow]);

  const handleAddNode = () => {
    setEditingNode(null);
    setIsDialogOpen(true);
  };

  const handleNodeDoubleClick = (event: React.MouseEvent, node: Node) => {
    setEditingNode(node);
    setIsDialogOpen(true);
  };

  const handleDialogSave = (nodeData: any) => {
    if (editingNode) {
      setNodes((nds) =>
        nds.map((node) =>
          node.id === editingNode.id
            ? { ...node, data: { ...node.data, ...nodeData } }
            : node
        )
      );
    } else {
      const newNode: Node = {
        id: crypto.randomUUID(),
        type: 'workflowNode',
        position: { x: 100, y: 100 },
        data: nodeData,
      };
      setNodes((nds) => [...nds, newNode]);
    }
    setIsDialogOpen(false);
    setEditingNode(null);
  };

  return (
    <div className="h-full w-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeDoubleClick={handleNodeDoubleClick}
        nodeTypes={nodeTypes}
        fitView
      >
        <Background />
        <Controls />
        <WorkflowControls onSave={onSave} onAddNode={handleAddNode} />
      </ReactFlow>

      <NodeDialog
        isOpen={isDialogOpen}
        onClose={() => {
          setIsDialogOpen(false);
          setEditingNode(null);
        }}
        onSave={handleDialogSave}
        initialData={editingNode?.data}
        availableScripts={availableScripts}
      />
    </div>
  );
};