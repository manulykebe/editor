import React, { useEffect } from "react";
import { ChevronDown, ChevronRight, Plus, MoreHorizontal } from "lucide-react";
import { FileTree } from "./FileTree";
import { WorkflowTree } from "./workflow/WorkflowTree";
import { useWorkflowStore } from "../store/workflowStore";

interface PanelProps {
	title: string;
	children: React.ReactNode;
	defaultExpanded?: boolean;
}

const Panel = ({ title, children, defaultExpanded = false }: PanelProps) => {
	const [isExpanded, setIsExpanded] = React.useState(defaultExpanded);

	return (
		<div className="border-b border-gray-700">
			<div
				className="flex items-center px-0 py-1 hover:bg-gray-700 dark:hover:bg-gray-800 cursor-pointer"
				onClick={() => setIsExpanded(!isExpanded)}
			>
				{isExpanded ? (
					<ChevronDown size={16} className="mr-1" />
				) : (
					<ChevronRight size={16} className="mr-1" />
				)}
				<span className="text-sm font-medium flex-1">{title}</span>
				<div className="flex items-center gap-1">
					<button className="p-1 hover:bg-gray-600 dark:hover:bg-gray-700 rounded">
						<Plus size={14} />
					</button>
					<button className="p-1 hover:bg-gray-600 dark:hover:bg-gray-700 rounded">
						<MoreHorizontal size={14} />
					</button>
				</div>
			</div>
			{isExpanded && <div className="py-1">{children}</div>}
		</div>
	);
};

export const SidePanel = () => {
  const { loadWorkflows } = useWorkflowStore();
  useEffect(() => {
    loadWorkflows();
  }, [loadWorkflows]);
	return (
		<div className="h-full bg-gray-800 dark:bg-zinc-900 overflow-y-auto">
			<Panel title="editor" defaultExpanded>
				<FileTree />
			</Panel>
      <Panel title="workflows" defaultExpanded>
        <WorkflowTree />
			</Panel>
			<Panel title="outline">
				<div className="px-4 py-2 text-sm text-gray-400">
					No outline information available
				</div>
			</Panel>
			<Panel title="TIMELINE">
				<div className="px-4 py-2 text-sm text-gray-400">
					No timeline information available
				</div>
			</Panel>
		</div>
	);
};
