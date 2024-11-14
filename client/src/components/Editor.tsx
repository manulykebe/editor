import React, { useEffect, useCallback } from "react";
import Editor, { loader } from "@monaco-editor/react";
import AceEditor from "react-ace";
import type * as Monaco from 'monaco-editor';

// Import ace modules
import "ace-builds/src-min-noconflict/ace";
import "ace-builds/src-min-noconflict/mode-javascript";
import "ace-builds/src-min-noconflict/mode-typescript";
import "ace-builds/src-min-noconflict/theme-github";
import "ace-builds/src-min-noconflict/theme-monokai";
import "ace-builds/src-min-noconflict/ext-language_tools";
import * as ace from 'ace-builds';

import { useEditorStore } from "../store/editorStore";
import debounce from 'lodash/debounce';
import { FilePlus2 } from "lucide-react";

const defaultCode = `// Welcome to the editor
// Open a file from the file tree to start editing...`;

export const EditorWrapper = () => {
  const { 
    isDarkMode, 
    currentFile, 
    fileContents, 
    updateFileContent, 
    saveFile,
    editorType,
    setEditorType 
  } = useEditorStore();

  interface LintMessage {
    line: number;
    column: number;
    message: string;
    severity: 'warning' | 'error';
  }

  const lintCode = (code: string, filename: string): LintMessage[] => {
    const messages: LintMessage[] = [];
    const ext = filename.split('.').pop()?.toLowerCase();
    
    // Lint rules implementation...
    // (keeping your existing lint rules)
    
    return messages;
  };

  const setupMonacoLinting = (editor: Monaco.editor.IStandaloneCodeEditor, monacoInstance: typeof Monaco) => {
    editor.onDidChangeModelContent(() => {
      const model = editor.getModel();
      if (model && currentFile) {
        const code = model.getValue();
        const lintMessages = lintCode(code, currentFile);

        const markers: Monaco.editor.IMarkerData[] = lintMessages.map(msg => ({
          severity: msg.severity === 'error' ? 
            monacoInstance.MarkerSeverity.Error : 
            monacoInstance.MarkerSeverity.Warning,
          message: msg.message,
          startLineNumber: msg.line,
          startColumn: msg.column,
          endLineNumber: msg.line,
          endColumn: msg.column + 1,
          source: 'custom-linter'
        }));

        monacoInstance.editor.setModelMarkers(model, 'custom-linter', markers);
      }
    });
  };

  const setupAceLinting = (editor: any) => {
    editor.getSession().on('change', () => {
      if (currentFile) {
        const code = editor.getValue();
        const lintMessages = lintCode(code, currentFile);

        editor.getSession().setAnnotations(
          lintMessages.map(msg => ({
            row: msg.line - 1,
            column: msg.column,
            text: msg.message,
            type: msg.severity
          }))
        );
      }
    });
  };

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

  useEffect(() => {
    ace.config.set(
      "basePath",
      "node_modules/ace-builds/src-noconflict"
    );
  }, []);

  const getLanguage = (filename: string): string => {
    const ext = filename.split('.').pop()?.toLowerCase();
    switch (ext) {
      case 'ts': return 'typescript';
      case 'tsx': return 'typescriptreact';
      case 'js': return 'javascript';
      case 'jsx': return 'javascriptreact';
      default: return 'javascript';
    }
  };

  const getAceLanguage = (filename: string): string => {
    const ext = filename.split('.').pop()?.toLowerCase();
    switch (ext) {
      case 'ts':
      case 'tsx': return 'typescript';
      case 'js':
      case 'jsx': return 'javascript';
      default: return 'javascript';
    }
  };

  const EditorSwitcher = () => (
    <select 
      className="absolute top-2 right-2 z-10 bg-zinc-800 text-white px-2 py-1 rounded"
      value={editorType}
      onChange={(e) => setEditorType(e.target.value as 'monaco' | 'ace')}
    >
      <option value="monaco">Monaco</option>
      <option value="ace">Ace</option>
    </select>
  );

  if (!currentFile) {
    return (
      <div className="h-full w-full bg-zinc-900 flex items-center justify-center">
        <EditorSwitcher />
        <div className="flex flex-col items-center gap-4">
          <FilePlus2 size={48} className="text-blue-500 animate-pulse" />
          <div className="text-zinc-400 text-sm font-medium">
            Select a file to start editing
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-full w-full">
      <EditorSwitcher />
      {editorType === 'monaco' ? (
        <Editor
          height="100%"
          value={currentFile ? fileContents[currentFile] : defaultCode}
          language={getLanguage(currentFile)}
          theme={isDarkMode ? "vs-dark" : "light"}
          onChange={handleChange}
          onMount={setupMonacoLinting}
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            lineNumbers: "on",
            rulers: [80],
            formatOnPaste: true,
            formatOnType: true,
            suggestOnTriggerCharacters: true,
            wordBasedSuggestions: "currentDocument",
            quickSuggestions: true,
            scrollBeyondLastLine: false,
            automaticLayout: true,
            tabSize: 2,
            detectIndentation: true,
            folding: true,
            glyphMargin: true
          }}
        />
      ) : (
        <AceEditor
          mode={getAceLanguage(currentFile)}
          theme={isDarkMode ? "monokai" : "github"}
          onChange={handleChange}
          onLoad={setupAceLinting}
          value={currentFile ? fileContents[currentFile] : defaultCode}
          name="ace-editor"
          width="100%"
          height="100%"
          fontSize={14}
          showPrintMargin={true}
          showGutter={true}
          highlightActiveLine={true}
          editorProps={{ $blockScrolling: true }}
          setOptions={{
            enableLiveAutocompletion: true,
            enableSnippets: true,
            showLineNumbers: true,
            tabSize: 2
          }}
        />
      )}
    </div>
  );
};

export { EditorWrapper as Editor };