import React from 'react';
import { Terminal, Bug, AlertCircle, X } from 'lucide-react';
import { useEditorStore } from '../store/editorStore';

const tabs = [
  { id: 'problems', icon: AlertCircle, label: 'Problems' },
  { id: 'output', icon: Terminal, label: 'Output' },
  { id: 'debug', icon: Bug, label: 'Debug Console' },
  { id: 'terminal', icon: Terminal, label: 'Terminal' }
];

export const BottomPanel = () => {
  const [activeTab, setActiveTab] = React.useState('output');
  const { executionResult, isExecuting } = useEditorStore();

  return (
    <div className="h-full flex flex-col bg-zinc-900">
      <div className="flex border-b border-zinc-700">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              className={`
                px-3 py-1 flex items-center gap-1 text-sm text-zinc-400
                ${activeTab === tab.id ? 'border-b-2 border-blue-500 text-zinc-200' : ''}
                hover:bg-gray-800 dark:hover:bg-gray-900
              `}
              onClick={() => setActiveTab(tab.id)}
            >
              <Icon size={16} />
              {tab.label}
            </button>
          );
        })}
      </div>
      <div className="flex-1 p-2 font-mono overflow-y-auto bg-zinc-900">
        {activeTab === 'output' && (
          <div className="text-zinc-300">
            {isExecuting ? (
              <div className="text-blue-400 animate-pulse">Executing...</div>
            ) : executionResult ? (
              <>
                {executionResult.output.map((line, i) => (
                  <div key={i} className={`
                    ${line.startsWith('[ERROR]') ? 'text-red-400' : 'text-green-400'}
                    whitespace-pre-wrap font-mono text-sm
                  `}>
                    {line}
                  </div>
                ))}
                {executionResult.error && (
                  <div className="text-red-400 mt-2 whitespace-pre-wrap font-mono text-sm">
                    Error: {executionResult.error}
                  </div>
                )}
              </>
            ) : (
              <div className="text-zinc-500">Ready to execute code...</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};