import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { X, Maximize2, Minimize2, Save } from "lucide-react";
import Editor from "@monaco-editor/react";

interface CallbackEditorProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (code: string) => void;
  title: string;
  initialCode: string;
}

export const CallbackEditor: React.FC<CallbackEditorProps> = ({
  isOpen,
  onClose,
  onSave,
  title,
  initialCode,
}) => {
  const [code, setCode] = useState(initialCode);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isAutoSave, setIsAutoSave] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [saveTimeout, setSaveTimeout] = useState<NodeJS.Timeout | null>(null);

  // Reset code when initialCode changes
  useEffect(() => {
    setCode(initialCode);
    setIsDirty(false);
  }, [initialCode]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (saveTimeout) {
        clearTimeout(saveTimeout);
      }
    };
  }, [saveTimeout]);

  const handleCodeChange = (newCode: string | undefined) => {
    if (!newCode) return;
    
    setCode(newCode);
    setIsDirty(true);

    if (isAutoSave) {
      if (saveTimeout) {
        clearTimeout(saveTimeout);
      }
      
      const timeout = setTimeout(() => {
        onSave(newCode);
        setIsDirty(false);
      }, 1000);
      
      setSaveTimeout(timeout);
    }
  };

  const handleManualSave = () => {
    onSave(code);
    setIsDirty(false);
  };

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div
        className={`
          bg-zinc-800 rounded-lg shadow-xl flex flex-col
          ${isFullscreen ? "fixed inset-4" : "w-[800px] h-[600px]"}
          transition-all duration-200
        `}
      >
        <div className="flex justify-between items-center p-4 border-b border-zinc-700">
          <div className="flex items-center gap-4">
            <h2 className="text-xl font-semibold text-white">{title}</h2>
            {isDirty && !isAutoSave && (
              <span className="text-yellow-400 text-sm">?</span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 mr-4">
              <label className="text-sm text-zinc-400">
                <input
                  type="checkbox"
                  checked={isAutoSave}
                  onChange={(e) => setIsAutoSave(e.target.checked)}
                  className="mr-2"
                />
                Auto-Save
              </label>
            </div>
            {!isAutoSave && (
              <button
                onClick={handleManualSave}
                className="p-2 hover:bg-zinc-700 rounded text-zinc-400 hover:text-white flex items-center gap-1"
                title="Save (Ctrl+S)"
              >
                <Save size={20} />
              </button>
            )}
            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-2 hover:bg-zinc-700 rounded text-zinc-400 hover:text-white"
              title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
            >
              {isFullscreen ? <Minimize2 size={20} /> : <Maximize2 size={20} />}
            </button>
            <button
              onClick={onClose}
              className="p-2 hover:bg-zinc-700 rounded text-zinc-400 hover:text-white"
              title="Close"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-hidden">
          <Editor
            height="100%"
            defaultValue={code}
            value={code}
            onChange={handleCodeChange}
            theme="vs-dark"
            language="javascript"
            options={{
              minimap: { enabled: false },
              fontSize: 14,
              lineNumbers: "on",
              renderLineHighlight: "all",
              scrollBeyondLastLine: false,
              automaticLayout: true,
              padding: { top: 10 },
            }}
            onMount={(editor) => {
              editor.addCommand(
                monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS,
                () => {
                  if (!isAutoSave) {
                    handleManualSave();
                  }
                }
              );
            }}
          />
        </div>

        <div className="p-4 border-t border-zinc-700 flex justify-between items-center">
          <div className="text-sm text-zinc-400">
            {isAutoSave ? "Auto-saving enabled" : "Press Ctrl+S to save"}
          </div>
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-zinc-300 hover:text-white hover:bg-zinc-700 rounded transition-colors"
            >
              Close
            </button>
            {!isAutoSave && (
              <button
                onClick={handleManualSave}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors"
              >
                Save
              </button>
            )}
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};