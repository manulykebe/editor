import { Terminal, GitBranch, Bell, Check, Sun, Moon } from "lucide-react";
import { useEditorStore } from "../store/editorStore";
import { useEffect } from "react";

export const Footer = () => {
	const {
		isBottomPanelVisible,
		isDarkMode,
		toggleBottomPanel,
		toggleDarkMode,
	} = useEditorStore();

	useEffect(() => {
		if (isDarkMode) {
			document.documentElement.classList.add("dark");
		} else {
			document.documentElement.classList.remove("dark");
		}
	}, [isDarkMode]);
	return (
		<div className="h-6 bg-blue-600 dark:bg-zinc-800 text-white flex items-center justify-between px-2 text-xs">
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
				<div className="flex items-center gap-1">
					<button
						className={`flex items-center gap-1 px-2 py-0.5 rounded ${
							isBottomPanelVisible
								? "bg-blue-700 dark:bg-zinc-700"
								: "hover:bg-blue-700 dark:hover:bg-gray-700"
						}`}
						onClick={toggleBottomPanel}
					>
						<Terminal size={14} />
						<span>Terminal</span>
					</button>
					<button
						className="flex items-center gap-1 px-2 py-0.5 rounded hover:bg-blue-700 dark:hover:bg-gray-700"
						onClick={toggleDarkMode}
					>
						{isDarkMode ? <Sun size={14} /> : <Moon size={14} />}
					</button>
				</div>
			</div>
		</div>
	);
};
