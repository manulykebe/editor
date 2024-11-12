import React, { useState, useCallback, useEffect } from "react";
import ReactFlow, {
	Background,
	Controls,
	Connection,
	Edge,
	Node,
	addEdge,
	useNodesState,
	useEdgesState,
} from "reactflow";
import "reactflow/dist/style.css";
import { WorkflowNode } from "./WorkflowNode";
import { WorkflowControls } from "./WorkflowControls";
import { NodeDialog } from "./NodeDialog";
import { useWorkflowStore } from "../../store/workflowStore";
import { SelfLoopEdge } from "./SelfLoopEdge";
import { useEditorStore } from "../../store/editorStore";
import { nanoid } from 'nanoid';

const nodeTypes = {
	workflowNode: WorkflowNode,
};
const edgeTypes = {
	selfLoopEdge: SelfLoopEdge,
};

export const WorkflowEditor = () => {
	const { currentWorkflow, updateWorkflow, saveWorkflow } =
		useWorkflowStore();
	const { isDarkMode } = useEditorStore();
	const [nodes, setNodes, onNodesChange] = useNodesState([]);
	const [edges, setEdges, onEdgesChange] = useEdgesState([]);
	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const [editingNode, setEditingNode] = useState<Node | null>(null);
	const [availableScripts, setAvailableScripts] = useState<string[]>([]);
	const [isSaving, setIsSaving] = useState(false);

	// Add effect to sync with currentWorkflow
	useEffect(() => {
		if (currentWorkflow) {
			setNodes(currentWorkflow.nodes || []);
			setEdges(currentWorkflow.edges || []);
		} else {
			// Reset when no workflow selected
			setNodes([]);
			setEdges([]);
		}
	}, [currentWorkflow, setNodes, setEdges]);

	useEffect(() => {
		// Load available scripts
		fetch("http://localhost:3000/api/files/tree")
			.then((res) => res.json())
			.then((tree) => {
				const scripts: string[] = [];
				const extractScripts = (items: any[]) => {
					items.forEach((item) => {
						if (item.type === "file" && item.path.endsWith(".js")) {
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
			let edgeType = "default";
			if (params.source === params.target) {
				edgeType = "selfLoopEdge";
			}
			setEdges((eds) =>
				addEdge(
					{
						...params,
						type: edgeType,
					},
					eds
				)
			);
		},
		[setEdges]
	);

	const onSave = useCallback(async () => {
		if (currentWorkflow) {
			try {
				setIsSaving(true);
				const updatedWorkflow = {
					...currentWorkflow,
					nodes,
					edges,
				};

				// Update local state
				updateWorkflow(updatedWorkflow);

				// Persist to backend
				await saveWorkflow(updatedWorkflow);
			} catch (error) {
				console.error("Error saving workflow:", error);
				// Could add toast notification here
			} finally {
				setIsSaving(false);
			}
		}
	}, [currentWorkflow, nodes, edges, updateWorkflow, saveWorkflow]);

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
				id: nanoid(10),
				type: "workflowNode",
				position: { x: 100, y: 100 },
				data: nodeData,
			};
			setNodes((nds) => [...nds, newNode]);
		}
		setIsDialogOpen(false);
		setEditingNode(null);
	};

	const onKeyDown = useCallback(
		(event: KeyboardEvent) => {
			// Check if delete or backspace was pressed
			if (event.key === "Delete" || event.key === "Backspace") {
				setEdges((eds) => eds.filter((edge) => !edge.selected));
			}
		},
		[setEdges]
	);

	// Add event listener
	useEffect(() => {
		document.addEventListener("keydown", onKeyDown);
		return () => {
			document.removeEventListener("keydown", onKeyDown);
		};
	}, [onKeyDown]);

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
				edgeTypes={edgeTypes}
				deleteKeyCode={["Backspace", "Delete"]} // Enable built-in delete functionality
				fitView
			>
				<Background />
				<Controls />
				<WorkflowControls
					onSave={onSave}
					onAddNode={handleAddNode}
					isSaving={isSaving}
				/>
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
