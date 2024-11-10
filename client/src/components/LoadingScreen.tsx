// src/components/LoadingScreen.tsx
import React from "react";
import { FilePlus2 } from "lucide-react"; // Using a file-related icon as logo

export const LoadingScreen = () => {
	return (
		<div className="fixed inset-0 bg-zinc-900 flex items-center justify-center">
			<div className="flex flex-col items-center gap-4">
				<FilePlus2 size={48} className="text-blue-500 animate-pulse" />
				<div className="text-zinc-400 text-sm font-medium animate-pulse">
					Loading editor...
				</div>
			</div>
		</div>
	);
};
