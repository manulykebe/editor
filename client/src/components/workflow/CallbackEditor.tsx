import React, { useState } from 'react';
import { X, Maximize2, Minimize2 } from 'lucide-react';
import Editor from '@monaco-editor/react';

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
  initialCode
}) => {
  const [code, setCode] = useState(initialCode);
  const [isFullscreen, setIsFullscreen] = useState(false);

  if (!isOpen) return null;

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div 
        className={`
          bg-zinc-800 rounded-lg shadow-xl flex flex-col
          ${isFullscreen ? 'fixed inset-4' : 'w-[800px] h-[600px]'}
          transition-all duration-200
        `}
      >
        <div className="flex justify-between items-center p-4 border-b border-zinc-700">
          <h2 className="text-xl font-semibold text-white">{title}</h2>
          <div className="flex items-center gap-2">
            <button 
              onClick={toggleFullscreen} 
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
            defaultValue={initialCode}
            value={code}
            onChange={(value) => setCode(value || '')}
            theme="vs-dark"
            language="javascript"
            options={{
              minimap: { enabled: false },
              fontSize: 14,
              lineNumbers: 'on',
              renderLineHighlight: 'all',
              scrollBeyondLastLine: false,
              automaticLayout: true,
              padding: { top: 10 },
            }}
          />
        </div>

        <div className="p-4 border-t border-zinc-700 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-zinc-300 hover:text-white hover:bg-zinc-700 rounded transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => onSave(code)}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};