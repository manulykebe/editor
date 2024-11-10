import React from "react";
import { useEffect, useCallback } from "react";
import Editor, { loader } from "@monaco-editor/react";
import { useEditorStore } from "../store/editorStore";
import debounce from 'lodash/debounce';
import { FilePlus2 } from "lucide-react";

const defaultCode = `// Welcome to the editor
// Open a file from the file tree to start editing...`;

export const MonacoEditor = () => {
  const { isDarkMode, currentFile, fileContents, updateFileContent, saveFile } = useEditorStore();

  // 1. Define all hooks first
  const debouncedSave = useCallback(
    debounce((path: string, content: string) => {
      saveFile(path, content);
    }, 1000),
    [saveFile]
  );

  const handleChange = useCallback((value: string | undefined) => {
    if (!currentFile || !value) return;
    updateFileContent(currentFile, value);
    debouncedSave(currentFile, value);
  }, [currentFile, debouncedSave, updateFileContent]);

  // 2. Theme setup effect
  useEffect(() => {
    loader.init().then((monaco) => {
      monaco.editor.defineTheme("soft-light", {
        base: "vs",
        inherit: true,
        rules: [],
        colors: {
          "editor.background": "#1f2937",
          "editor.foreground": "#f3f4f6",
          "editorCursor.foreground": "#f3f4f6",
          "editor.lineHighlightBackground": "#374151",
          "editorError.foreground": "#ef4444",
          "editorWarning.foreground": "#f59e0b",
          "editorInfo.foreground": "#3b82f6",
        },
      });

      monaco.languages.typescript.javascriptDefaults.setDiagnosticsOptions({
        noSemanticValidation: false,
        noSyntaxValidation: false,
      });

      monaco.languages.typescript.javascriptDefaults.setCompilerOptions({
        target: monaco.languages.typescript.ScriptTarget.ES2015,
        allowNonTsExtensions: true,
        moduleResolution: monaco.languages.typescript.ModuleResolutionKind.NodeJs,
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

  // 3. Early return for no file selected
  if (!currentFile) {
    return (
      <div className="h-full w-full bg-zinc-900 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <FilePlus2 size={48} className="text-blue-500 animate-pulse" />
          <div className="text-zinc-400 text-sm font-medium">
            Select a file to start editing
          </div>
        </div>
      </div>
    );
  }

  // 4. Main render
  return (
    <div className="h-full w-full">
      <Editor
        height="100%"
        defaultValue={defaultCode}
        value={currentFile ? fileContents[currentFile] : defaultCode}
        theme={isDarkMode ? "vs-dark" : "soft-light"}
        onChange={handleChange}
        options={{
          minimap: { enabled: false },
          fontSize: 14,
        }}
      />
    </div>
  );
};

export { MonacoEditor as Editor };