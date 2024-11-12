import React, { useState, useCallback } from "react";
import { Handle, Position } from "reactflow";
import { Play, Check, AlertCircle, XCircle } from "lucide-react";
import { useWorkflowStore } from "../../store/workflowStore";
import { CallbackMarker } from "./CallbackMarker";
import { CallbackEditor } from "./CallbackEditor";
import type { CallbackMarker as CallbackMarkerType } from "./CallbackMarker";

// Define the CallbackKey type
type CallbackKey =
	| "onStart"
	| "onStartRun"
	| "onComplete"
	| "onCompleteRun"
	| "onReject"
	| "onRejectRun"
	| "onAbort"
	| "onAbortRun";

// Update the interface
interface WorkflowNodeProps {
	id: string;
	data: {
		name: string;
		description: string;
		repeat?: number;
		callbacks: Record<CallbackKey, boolean>;
	};
	selected?: boolean;
}

export const WorkflowNode = ({ id, data, selected }: WorkflowNodeProps) => {
	const { currentWorkflow, updateWorkflow } = useWorkflowStore();
	const [editorOpen, setEditorOpen] = useState(false);
	const [currentCallback, setCurrentCallback] = useState<{
		type: string;
		code: string;
	} | null>(null);

	if (!currentWorkflow) {
		console.warn("No workflow selected");
		return null;
	}
	const markers: CallbackMarkerType[] = [
		// Top Left
		{
			name: "onStartCallback",
			position: "topLeft",
			icon: <Play />,
			color: "bg-green-400",
		},
		{
			name: "onStartRunCallback",
			position: "topLeft",
			icon: <Play />,
			color: "bg-blue-400",
			isRunCallback: true,
		},
		// Top Right
		{
			name: "onCompleteCallback",
			position: "topRight",
			icon: <Check />,
			color: "bg-green-400",
		},
		{
			name: "onCompleteRunCallback",
			position: "topRight",
			icon: <Check />,
			color: "bg-blue-400",
			isRunCallback: true,
		},
		// Bottom Left
		{
			name: "onAbortCallback",
			position: "bottomLeft",
			icon: <XCircle />,
			color: "bg-red-400",
		},
		{
			name: "onAbortRunCallback",
			position: "bottomLeft",
			icon: <XCircle />,
			color: "bg-orange-400",
			isRunCallback: true,
		},
		// Bottom Right
		{
			name: "onRejectCallback",
			position: "bottomRight",
			icon: <AlertCircle />,
			color: "bg-yellow-400",
		},
		{
			name: "onRejectRunCallback",
			position: "bottomRight",
			icon: <AlertCircle />,
			color: "bg-amber-400",
			isRunCallback: true,
		},
	];

	const handleCallbackAction = useCallback(
		async (action: "create" | "edit" | "delete", type: string) => {
			if (!id) {
				console.error("Missing node ID");
				return;
			}

			const filename = `${currentWorkflow.id}/${id}/${type}.json`;

			if (action === "create" || action === "edit") {
				try {
					const response = await fetch(
						`http://localhost:3000/api/files?path=${encodeURIComponent(
							filename
						)}`
					);
					const { content } = await response.json();
					setCurrentCallback({
						type,
						code:
							content ||
							`// ${type}\nconsole.log('${type} executed');`,
					});
					setEditorOpen(true);
				} catch (error) {
					console.error("Error loading callback file:", error);
				}
			} else if (action === "delete") {
				if (!confirm(`Delete ${type}?`)) return;

				try {
					await fetch(
						`http://localhost:3000/api/files?path=${encodeURIComponent(
							filename
						)}`,
						{ method: "DELETE" }
					);
					// Update node data to reflect the removed callback
					const callbackKey = type.replace(
						"Callback",
						""
					) as CallbackKey;
					const updatedCallbacks = {
						...data.callbacks,
						[callbackKey]: false,
					};
					updateWorkflow({
						...currentWorkflow,
						nodes: currentWorkflow.nodes.map((n) =>
							n.id === id
								? {
										...n,
										data: {
											...n.data,
											callbacks: updatedCallbacks,
										},
								  }
								: n
						),
					});
				} catch (error) {
					console.error("Error deleting callback file:", error);
				}
			}
		},
		[id, currentWorkflow, data.callbacks, updateWorkflow]
	);

	const handleSaveCallback = useCallback(
		async (code: string) => {
			if (!currentCallback || !id) return;
			const filename = `${currentWorkflow.id}/${id}/${currentCallback.type}.json`;
			try {
				const response = await fetch(
					"http://localhost:3000/api/files",
					{
						method: "PUT",
						headers: { "Content-Type": "application/json" },
						body: JSON.stringify({
							path: filename,
							content: code,
						}),
					}
				);

				if (!response.ok) {
					throw new Error(`Server returned ${response.status}`);
				}

				const callbackKey = currentCallback.type.replace(
					"Callback",
					""
				) as CallbackKey;
				const updatedCallbacks = {
					...data.callbacks,
					[callbackKey]: true,
				};
				updateWorkflow({
					...currentWorkflow,
					nodes: currentWorkflow.nodes.map((n) =>
						n.id === id
							? {
									...n,
									data: {
										...n.data,
										callbacks: updatedCallbacks,
									},
							  }
							: n
					),
				});
				setEditorOpen(false);
				setCurrentCallback(null);
			} catch (error) {
				console.error("Error saving callback file:", error);
				// You might want to show an error message to the user here
			}
		},
		[currentCallback, id, currentWorkflow, data.callbacks, updateWorkflow]
	);

	return (
		<>
			<div className="px-4 py-2 shadow-md rounded-md bg-white border-2 border-stone-400 min-w-[200px] max-w-[200px] h-[100px]">
				{/* Handles */}
				<Handle
					type="target"
					position={Position.Left}
					className="w-3 h-3 !bg-blue-400"
				/>
				<Handle
					type="source"
					position={Position.Right}
					className="w-3 h-3 !bg-blue-400"
				/>
				{/* Markers */}
				{markers.map((marker) => {
					const callbackKey = marker.name.replace(
						"Callback",
						""
					) as CallbackKey;
					const isEnabled = data.callbacks[callbackKey];
					return (
						<CallbackMarker
							key={marker.name}
							marker={marker}
							isEnabled={isEnabled}
							workflowId={currentWorkflow.id}
							nodeId={id}
							onAction={handleCallbackAction}
						/>
					);
				})}
				<div className="flex">
					<div className="rounded-full w-12 h-12 flex justify-center items-center bg-gray-100 dark:bg-gray-700">
						x{data.repeat || 1}
					</div>
					<div className="ml-2">
						<div className="text-gray-800 text-lg font-bold">
							{data.name}
						</div>
						<div className="text-gray-500">{data.description}</div>
					</div>
				</div>
			</div>

			{/* Callback Editor Dialog */}
			<CallbackEditor
				isOpen={editorOpen}
				onClose={() => {
					setEditorOpen(false);
					setCurrentCallback(null);
				}}
				onSave={handleSaveCallback}
				title={
					currentCallback
						? `Edit ${currentCallback.type}`
						: "Create Callback"
				}
				initialCode={currentCallback?.code || ""}
			/>
		</>
	);
};
