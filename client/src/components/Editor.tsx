import { useEffect } from "react";
import Editor, { loader } from "@monaco-editor/react";
import { useEditorStore } from "../store/editorStore";

const defaultCode = `// Welcome to the editor
function greeting() {
    console.log("Hello, World!");
}

// Start coding here...`;

export const MonacoEditor = () => {
	const { isDarkMode } = useEditorStore();

	// Define custom light theme
	useEffect(() => {
		loader.init().then((monaco) => {
			monaco.editor.defineTheme("soft-light", {
				base: "vs",
				inherit: true,
				rules: [],
				colors: {
					"editor.background": "#1f2937", // gray-800
					"editor.foreground": "#f3f4f6", // gray-100
					"editorCursor.foreground": "#f3f4f6", // gray-100
					"editor.lineHighlightBackground": "#374151", // gray-700
					"editorError.foreground": "#ef4444", // red-500
					"editorWarning.foreground": "#f59e0b", // amber-500
					"editorInfo.foreground": "#3b82f6", // blue-500
				},
			});

			// Configure the ESLint markers
			monaco.languages.typescript.javascriptDefaults.setDiagnosticsOptions(
				{
					noSemanticValidation: false,
					noSyntaxValidation: false,
				}
			);

			// Enable ESLint features
			monaco.languages.typescript.javascriptDefaults.setCompilerOptions({
				target: monaco.languages.typescript.ScriptTarget.ES2015,
				allowNonTsExtensions: true,
				moduleResolution:
					monaco.languages.typescript.ModuleResolutionKind.NodeJs,
				module: monaco.languages.typescript.ModuleKind.CommonJS,
				noEmit: true,
				esModuleInterop: true,
				jsx: monaco.languages.typescript.JsxEmit.React,
				reactNamespace: "React",
				allowJs: true,
				typeRoots: ["node_modules/@types"],
			});
		});
	}, []);

	return (
		<div className={`h-full w-full`}>
			<Editor
				height="100%"
				defaultValue={defaultCode}
				theme={isDarkMode ? "vs-dark" : "soft-light"}
				options={{
					minimap: { enabled: false },
					fontSize: 14,
				}}
			/>
		</div>
	);
};

export { MonacoEditor as Editor };
