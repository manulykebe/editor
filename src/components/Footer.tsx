import { Terminal, GitBranch, Bell, Check } from "lucide-react";
import { useEditorStore } from "../store/editorStore";

export const Footer = () => {
	const { toggleBottomPanel } = useEditorStore();

	return (
		<div className="h-6 bg-blue-600 text-white flex items-center justify-between px-2 text-xs">
			<div className="flex items-center gap-4">
				<div className="flex items-center gap-1">
					<GitBranch size={14} />
					<span>main</span>
				</div>
			</div>
			<div className="flex items-center gap-4">
				<div className="flex items-center gap-1">
					<Check size={14} />
					<span>Ln 1, Col 1</span>
				</div>
				<div>Spaces: 2</div>
				<div>UTF-8</div>
				<div className="flex items-center gap-1">
					<Bell size={14} />
					<span>0</span>
				</div>
				<button
					className="flex items-center gap-1 hover:bg-blue-700 px-2 py-0.5 rounded"
					onClick={toggleBottomPanel}
				>
					<Terminal size={14} />
					<span>Terminal</span>
				</button>
			</div>
		</div>
	);
};
