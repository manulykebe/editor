import React from "react";
import { X } from "lucide-react";

const tabs = [
	{ id: 1, name: "App.tsx", path: "/src/App.tsx" },
	{ id: 2, name: "Editor.tsx", path: "/src/components/Editor.tsx" },
];

export const TabBar = () => {
	const [activeTab, setActiveTab] = React.useState(tabs[0].id);

	return (
		<div className="bg-gray-900 dark:bg-zinc-950 border-b border-gray-700 flex">
			{tabs.map((tab) => (
				<div
					key={tab.path}
					className={`
            group flex items-center px-4 py-2 border-r border-gray-700 cursor-pointer
            ${
				activeTab === tab.id
					? "bg-gray-800 dark:bg-zinc-900"
					: "hover:bg-gray-800 dark:hover:bg-gray-900"
			}
          `}
					onClick={() => setActiveTab(tab.id)}
				>
					<span className="text-sm text-gray-300">{tab.name}</span>
					<button className="ml-2 p-1 rounded hover:bg-gray-700 opacity-0 group-hover:opacity-100">
						<X size={14} />
					</button>
				</div>
			))}
		</div>
	);
};
