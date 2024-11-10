import React from "react";
import { X } from "lucide-react";
import { useEditorStore } from "../store/editorStore";

export const TabBar = () => {
  const { currentFile, setCurrentFile } = useEditorStore();

  if (!currentFile) {
    return null;
  }

  const fileName = currentFile.split('/').pop() || '';

  return (
    <div className="bg-gray-900 dark:bg-zinc-950 border-b border-gray-700 flex">
      <div className="group flex items-center px-4 py-2 border-r border-gray-700 cursor-pointer bg-gray-800 dark:bg-zinc-900">
        <span className="text-sm text-gray-300">{fileName}</span>
        <button 
          className="ml-2 p-1 rounded hover:bg-gray-700 opacity-0 group-hover:opacity-100"
          onClick={() => setCurrentFile(null)}
        >
          <X size={14} />
        </button>
      </div>
    </div>
  );
};