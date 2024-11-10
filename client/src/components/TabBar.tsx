import React from "react";
import { X } from "lucide-react";
import { useEditorStore } from "../store/editorStore";

export const TabBar = () => {
	const { openFiles, currentFile, setCurrentFile, closeFile } =
		useEditorStore();

	const hasDuplicateFilename = (path: string) => {
		const fileName = path.split("\\").pop();
		return (
			openFiles.filter((p) => p.split("\\").pop() === fileName).length > 1
		);
	};

	return (
		<div className="bg-zinc-900 border-b border-zinc-700 flex">
			{openFiles.map((path) => {
				const fileName = path.split("\\").pop();
				const showFullPath = hasDuplicateFilename(path);

				return (
					<div
						key={path}
						className={`
              h-10 group flex items-center px-4 py-2 border-r border-zinc-700 cursor-pointer
              ${currentFile === path ? "bg-zinc-800" : "hover:bg-zinc-800"}
            `}
						onClick={() => setCurrentFile(path)}
					>
						<div className="flex flex-col">
							<span className="text-sm text-zinc-300">
								{fileName}
							</span>
							{showFullPath && (
								<span className="text-xs text-zinc-500 mt-0">
									{path.split("/").join("\\")}
								</span>
							)}
						</div>
						<button
							className="ml-2 p-1 rounded hover:bg-zinc-700 opacity-0 group-hover:opacity-100"
							onClick={(e) => {
								e.stopPropagation();
								closeFile(path);
							}}
						>
							<X size={14} />
						</button>
					</div>
				);
			})}
		</div>
	);
};
