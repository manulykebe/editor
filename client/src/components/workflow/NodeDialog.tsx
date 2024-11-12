import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import { nanoid } from 'nanoid';

interface NodeDialogProps {
	isOpen: boolean;
	onClose: () => void;
	onSave: (nodeData: any) => void;
	initialData?: any;
	availableScripts: string[];
}

export const NodeDialog = ({
	isOpen,
	onClose,
	onSave,
	initialData,
	availableScripts,
}: NodeDialogProps) => {
	const [name, setName] = useState("");
	const [description, setDescription] = useState("");
	const [selectedScript, setSelectedScript] = useState("");
	const [isNewScript, setIsNewScript] = useState(false);
	const [newScriptName, setNewScriptName] = useState("");

	useEffect(() => {
		if (initialData) {
			setName(initialData.name || "");
			setDescription(initialData.description || "");
			setSelectedScript(initialData.script || "");
		}
	}, [initialData]);

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		const scriptPath = isNewScript ? `${nanoid(10)}/f.js` : selectedScript;

		onSave({
			name,
			description,
			script: scriptPath,
			callbacks: {
				onStart: false,
				onStartRun: false,
				onComplete: false,
				onCompleteRun: false,
				onReject: false,
				onRejectRun: false,
				onAbort: false,
				onAbortRun: false,
			},
		});

		if (isNewScript) {
			// Create new script file
			fetch("http://localhost:3000/api/files", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					path: scriptPath,
					type: "file",
					content:
						'// New script\nconsole.log("Hello from new script!");',
				}),
			});
		}
	};

	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
			<div className="bg-zinc-800 rounded-lg shadow-xl w-[500px] max-h-[80vh] overflow-y-auto">
				<div className="flex justify-between items-center p-4 border-b border-zinc-700">
					<h2 className="text-xl font-semibold text-white">
						{initialData ? "Edit Node" : "Create Node"}
					</h2>
					<button
						onClick={onClose}
						className="text-zinc-400 hover:text-white"
					>
						<X size={20} />
					</button>
				</div>

				<form onSubmit={handleSubmit} className="p-4 space-y-4">
					<div>
						<label className="block text-sm font-medium text-zinc-300 mb-1">
							Name
						</label>
						<input
							type="text"
							value={name}
							onChange={(e) => setName(e.target.value)}
							maxLength={20}
							className="w-full bg-zinc-700 text-white px-3 py-2 rounded border border-zinc-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
							required
						/>
					</div>

					<div>
						<label className="block text-sm font-medium text-zinc-300 mb-1">
							Description
						</label>
						<textarea
							value={description}
							onChange={(e) => setDescription(e.target.value)}
							className="w-full bg-zinc-700 text-white px-3 py-2 rounded border border-zinc-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
							rows={3}
						/>
					</div>

					<div>
						<label className="block text-sm font-medium text-zinc-300 mb-1">
							Script
						</label>
						<div className="flex gap-2">
							<select
								value={selectedScript}
								onChange={(e) => {
									setSelectedScript(e.target.value);
									setIsNewScript(e.target.value === "new");
								}}
								className="flex-1 bg-zinc-700 text-white px-3 py-2 rounded border border-zinc-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
								required
							>
								<option value="">Select a script</option>
								{availableScripts.map((script) => (
									<option key={script} value={script}>
										{script}
									</option>
								))}
								<option value="new">Create new script</option>
							</select>
						</div>
					</div>

					{isNewScript && (
						<div>
							<label className="block text-sm font-medium text-zinc-300 mb-1">
								New Script Name
							</label>
							<input
								type="text"
								value={newScriptName}
								onChange={(e) =>
									setNewScriptName(e.target.value)
								}
								className="w-full bg-zinc-700 text-white px-3 py-2 rounded border border-zinc-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
								required
							/>
						</div>
					)}

					<div className="flex justify-end gap-2 pt-4">
						<button
							type="button"
							onClick={onClose}
							className="px-4 py-2 text-zinc-300 hover:text-white hover:bg-zinc-700 rounded"
						>
							Cancel
						</button>
						<button
							type="submit"
							className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded"
						>
							{initialData ? "Update" : "Create"}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
};
