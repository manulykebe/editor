import React, { useState, useCallback, useEffect } from "react";
import { FileText, Plus, Trash } from "lucide-react";
import { useWorkflowStore } from "../../store/workflowStore";
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

export const WorkflowTree = () => {
	const {
		workflows,
		currentWorkflow,
		setCurrentWorkflow,
		deleteWorkflow,
		saveWorkflow,
	} = useWorkflowStore();

	const handleCreateWorkflow = async () => {
		const newWorkflow = {
			id: crypto.randomUUID(),
			name: "New Workflow",
			description: "A new workflow",
			nodes: [],
			edges: [],
		};
		await saveWorkflow(newWorkflow);
		setCurrentWorkflow(newWorkflow);
	};

	return (
		<div className="text-gray-300">
			<button
				onClick={handleCreateWorkflow}
				className="p-1 hover:bg-gray-600 rounded"
				title="New Workflow"
			>
				<Plus size={14} />
			</button>
			<div className="space-y-1">
				{workflows.map((workflow) => (
					<div
						key={workflow.id}
						className={`group flex items-center px-4 py-1 cursor-pointer ${
							currentWorkflow?.id === workflow.id
								? "bg-gray-700"
								: "hover:bg-gray-700"
						}`}
						onClick={() => setCurrentWorkflow(workflow)}
					>
						<FileText size={14} className="mr-2 text-gray-400" />
						<span className="text-sm flex-1">{workflow.name}</span>
						<button
							onClick={(e) => {
								e.stopPropagation();
								if (confirm("Delete this workflow?")) {
									deleteWorkflow(workflow.id);
								}
							}}
							className="p-1 hover:bg-gray-600 rounded opacity-0 group-hover:opacity-100"
							title="Delete Workflow"
						>
							<Trash size={14} />
						</button>
					</div>
				))}
			</div>
		</div>
	);
};

export const WorkflowEditor = () => {
	const { currentWorkflow, updateWorkflow } = useWorkflowStore();
	const [nodes, setNodes, onNodesChange] = useNodesState([]);
	const [edges, setEdges, onEdgesChange] = useEdgesState([]);

	useEffect(() => {
		if (currentWorkflow) {
			setNodes(currentWorkflow.nodes);
			setEdges(currentWorkflow.edges);
		}
	}, [currentWorkflow]);
};
