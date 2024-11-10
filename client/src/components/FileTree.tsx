import React, { useEffect, useState } from "react";
import {
	ChevronDown,
	ChevronRight,
	File,
	FileText,
	Folder,
	FolderPlus,
	Plus,
	X,
	Trash,
} from "lucide-react";
import { useEditorStore } from "../store/editorStore";

interface FileTreeItem {
	name: string;
	type: "file" | "folder";
	path: string;
	children?: FileTreeItem[];
}

const FileTreeItem: React.FC<{ item: FileTreeItem; onRefresh: () => void }> = ({
	item,
	onRefresh,
}) => {
	const [isExpanded, setIsExpanded] = React.useState(true);
	const [isCreating, setIsCreating] = React.useState(false);
	const [newItemName, setNewItemName] = React.useState("");
	const [newItemType, setNewItemType] = React.useState<"file" | "folder">(
		"file"
	);
	const { currentFile, openFile } = useEditorStore(); // Update this line

	const handleClick = () => {
		if (item.type === "file") {
			openFile(item.path);
		} else {
			setIsExpanded(!isExpanded);
		}
	};

	const handleCreate = async (type: "file" | "folder") => {
		setNewItemType(type);
		setIsCreating(true);
		setIsExpanded(true);
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!newItemName) return;

		try {
			const newPath = `${item.path}/${newItemName}${
				newItemType === "file" ? ".js" : ""
			}`;
			await fetch("http://localhost:3000/api/files", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					path: newPath.slice(1),
					type: newItemType,
					content: newItemType === "file" ? "// New file" : undefined,
				}),
			});
			setIsCreating(false);
			setNewItemName("");
			onRefresh();
		} catch (error) {
			console.error("Error creating item:", error);
		}
	};

	const handleDelete = async () => {
		if (!confirm(`Delete ${item.name}?`)) return;

		try {
			await fetch(
				`http://localhost:3000/api/files?path=${encodeURIComponent(
					item.path.slice(1)
				)}`,
				{
					method: "DELETE",
				}
			);
			onRefresh();
		} catch (error) {
			console.error("Error deleting item:", error);
		}
	};

	return (
		<div>
			<div className="group flex items-center hover:bg-gray-700 text-sm">
				<div
					className={`flex-1 flex items-center py-1 px-4 cursor-pointer ${
						item.path === currentFile ? "bg-gray-700" : ""
					}`}
					onClick={handleClick}
				>
					{item.type === "folder" ? (
						<>
							{isExpanded ? (
								<ChevronDown size={16} className="mr-1" />
							) : (
								<ChevronRight size={16} className="mr-1" />
							)}
							<Folder size={16} className="mr-2 text-blue-400" />
						</>
					) : (
						<>
							<span className="w-4 mr-1" />
							<FileText
								size={16}
								className="mr-2 text-gray-400"
							/>
						</>
					)}
					{item.name}
				</div>
				{item.type === "folder" && (
					<div className="hidden group-hover:flex items-center px-2">
						<button
							className="p-1 hover:bg-gray-600 rounded"
							onClick={() => handleCreate("file")}
							title="New File"
						>
							<File size={14} />
						</button>
						<button
							className="p-1 hover:bg-gray-600 rounded"
							onClick={() => handleCreate("folder")}
							title="New Folder"
						>
							<FolderPlus size={14} />
						</button>
						<button
							className="p-1 hover:bg-gray-600 rounded"
							onClick={handleDelete}
							title="Delete"
						>
							<Trash size={14} />
						</button>
					</div>
				)}
				{item.type === "file" && (
					<div className="hidden group-hover:flex items-center px-2">
						<button
							className="p-1 hover:bg-gray-600 rounded"
							onClick={handleDelete}
							title="Delete"
						>
							<Trash size={14} />
						</button>
					</div>
				)}
			</div>

			{isCreating && (
				<form
					onSubmit={handleSubmit}
					className="ml-8 my-1 flex items-center"
				>
					<input
						type="text"
						value={newItemName}
						onChange={(e) => setNewItemName(e.target.value)}
						placeholder={`New ${newItemType}...`}
						className="bg-gray-800 text-white px-2 py-1 text-sm rounded"
						autoFocus
					/>
					<button
						type="submit"
						className="ml-2 p-1 hover:bg-gray-600 rounded"
					>
						<Plus size={14} />
					</button>
				</form>
			)}

			{item.type === "folder" && isExpanded && item.children && (
				<div className="ml-4">
					{item.children.map((child) => (
						<FileTreeItem
							key={child.path}
							item={child}
							onRefresh={onRefresh}
						/>
					))}
				</div>
			)}
		</div>
	);
};

export const FileTree = () => {
	const [files, setFiles] = useState<FileTreeItem[]>([]);

	const fetchFiles = async () => {
		try {
			const response = await fetch(
				"http://localhost:3000/api/files/tree"
			);
			const data = await response.json();
			setFiles(data);
		} catch (error) {
			console.error("Error fetching files:", error);
		}
	};

	useEffect(() => {
		fetchFiles();
	}, []);

	return (
		<div className="text-gray-300">
			{files.map((item) => (
				<FileTreeItem
					key={item.path}
					item={item}
					onRefresh={fetchFiles}
				/>
			))}
		</div>
	);
};
