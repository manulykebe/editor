import React from 'react';
import { Terminal, Bug, AlertCircle } from 'lucide-react';

const tabs = [
  { id: 'problems', icon: AlertCircle, label: 'Problems' },
  { id: 'output', icon: Terminal, label: 'Output' },
  { id: 'debug', icon: Bug, label: 'Debug Console' },
  { id: 'terminal', icon: Terminal, label: 'Terminal' }
];

export const BottomPanel = () => {
  const [activeTab, setActiveTab] = React.useState('terminal');

  return (
    <div className="h-full flex flex-col bg-zinc-900">
      <div className="flex border-b border-zinc-700">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              className={`
                px-3 py-1 flex items-center gap-1 text-sm
                ${activeTab === tab.id ? 'border-b-2 border-blue-500' : ''}
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
      <div className="flex-1 p-2 text-sm font-mono">
        {activeTab === 'terminal' && (
          <div className="text-zinc-300">
            <div>$ npm run dev</div>
            <div className="text-green-400">VITE v5.4.2 ready in 150 ms</div>
            <div className="text-zinc-400">➜ Local: http://localhost:5173/</div>
          </div>
        )}
      </div>
    </div>
  );
};