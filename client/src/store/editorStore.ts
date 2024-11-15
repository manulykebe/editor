import { create } from "zustand";
import {
	ExecutionService,
	ExecutionResult,
} from "../services/ExecutionService";
import { useState, useCallback } from "react";
import { ModuleManager } from "../utils/ModuleManager";
import { useWorkflowStore } from "./workflowStore";

const DEFAULT_CODE = `console.log('Hello, world!');`;

interface FileData {
	path: string;
	content: string;
}

interface EditorStore {
	isBottomPanelVisible: boolean;
	isDarkMode: boolean;
	currentFile: string | null;
	openFiles: string[];
	fileContents: Record<string, string>;
	toggleBottomPanel: () => void;
	toggleDarkMode: () => void;
	setCurrentFile: (path: string | null) => void;
	openFile: (path: string) => void;
	closeFile: (path: string) => void;
	updateFileContent: (path: string, content: string) => void;
	saveFile: (path: string, content: string) => Promise<void>;
	executeFile: (path: string) => Promise<void>;
	isExecuting: boolean;
	executionResult: ExecutionResult | null;
	editorType: 'monaco' | 'ace';
	setEditorType: (type: 'monaco' | 'ace') => void;
	lintErrors: Record<string, any[]>;
	setLintErrors: (path: string, errors: any[]) => void;
}

export const useEditorStore = create<EditorStore>((set, get) => ({
	isBottomPanelVisible: false,
	isDarkMode: false,
	currentFile: null,
	openFiles: [],
	fileContents: {},
	isExecuting: false,
	executionResult: null,
	editorType: 'monaco',
	lintErrors: {},
	toggleBottomPanel: () =>
		set((state) => ({
			isBottomPanelVisible: !state.isBottomPanelVisible,
		})),
	toggleDarkMode: () =>
		set((state) => ({
			isDarkMode: !state.isDarkMode,
		})),
	setCurrentFile: (path: string | null) => {
		if (path) {
			try {
				fetch(
					`http://localhost:3000/api/files?path=${encodeURIComponent(
						path.slice(1)
					)}`
				)
					.then((res) => res.json())
					.then((data) => {
						set((state) => ({
							currentFile: path,
							fileContents: {
								...state.fileContents,
								[path]: data.content,
							},
						}));
						// Reset currentWorkflow when switching to file
						useWorkflowStore.getState().setCurrentWorkflow(null);
					});
			} catch (error) {
				console.error("Error loading file:", error);
			}
		} else {
			set({ currentFile: null });
		}
	},
	openFile: async (path) => {
		const { openFiles, setCurrentFile } = get();
		if (!openFiles.includes(path)) {
			set((state) => ({ openFiles: [...state.openFiles, path] }));
		}
		setCurrentFile(path);
	},
	closeFile: (path) => {
		set((state) => {
			const openFiles = state.openFiles.filter((p) => p !== path);
			const nextFile = openFiles[openFiles.length - 1] || null;
			return {
				openFiles,
				currentFile:
					state.currentFile === path ? nextFile : state.currentFile,
			};
		});
	},
	updateFileContent: (path, content) => {
		set((state) => ({
			fileContents: { ...state.fileContents, [path]: content },
		}));
	},
	saveFile: async (path, content) => {
		try {
			await fetch("http://localhost:3000/api/files", {
				method: "PUT",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ path: path.slice(1), content }),
			});
		} catch (error) {
			console.error("Error saving file:", error);
		}
	},
	executeFile: async (path) => {
		const content = get().fileContents[path];
		if (!content) return;

		set({ isExecuting: true, executionResult: null });

		try {
			const result = await ExecutionService.executeScript(content, path);
			set({
				executionResult: result,
				isExecuting: false,
			});
		} catch (error) {
			set({
				executionResult: {
					success: false,
					output: [],
					error:
						error instanceof Error
							? error.message
							: "Unknown error",
				},
				isExecuting: false,
			});
		}
	},
	setEditorType: (type) => set({ editorType: type }),
	setLintErrors: (path, errors) => set((state) => ({
		lintErrors: { ...state.lintErrors, [path]: errors }
	}))
}));
