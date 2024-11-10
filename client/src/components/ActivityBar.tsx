import React from "react";
import { Files, Search, GitBranch, Box, User, Settings } from "lucide-react";

const topItems = [
	{ id: "explorer", icon: Files, label: "Explorer" },
	{ id: "search", icon: Search, label: "Search" },
	{ id: "source-control", icon: GitBranch, label: "Source Control" },
	{ id: "extensions", icon: Box, label: "Extensions" },
];

const bottomItems = [
	{ id: "account", icon: User, label: "Account" },
	{ id: "manage", icon: Settings, label: "Manage" },
];

export const ActivityBar = () => {
	const [activeItem, setActiveItem] = React.useState("explorer");

	return (
		<div className="w-12 bg-gray-900 dark:bg-zinc-950 border-r border-gray-700 flex flex-col justify-between py-2">
			<div className="flex flex-col items-center gap-4">
				{topItems.map((item) => {
					const Icon = item.icon;
					return (
						<button
							key={item.id}
							className={`p-2 rounded hover:bg-gray-700 relative group ${
								activeItem === item.id
									? "text-white bg-gray-700"
									: "text-gray-400"
							}`}
							onClick={() => setActiveItem(item.id)}
						>
							<Icon size={24} />
							<div className="hidden group-hover:block absolute left-full top-1/2 -translate-y-1/2 ml-2 px-2 py-1 bg-gray-800 dark:bg-zinc-900 text-white text-xs whitespace-nowrap rounded z-50">
								{item.label}
							</div>
							{activeItem === item.id && (
								<div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-6 bg-white" />
							)}
						</button>
					);
				})}
			</div>
			<div className="flex flex-col items-center gap-4">
				{bottomItems.map((item) => {
					const Icon = item.icon;
					return (
						<button
							key={item.id}
							className="p-2 rounded hover:bg-gray-700 text-gray-400 relative group"
						>
							<Icon size={24} />
							<div className="hidden group-hover:block absolute left-full top-1/2 -translate-y-1/2 ml-2 px-2 py-1 bg-gray-800 text-white text-xs whitespace-nowrap rounded z-50">
								{item.label}
							</div>
						</button>
					);
				})}
			</div>
		</div>
	);
};
