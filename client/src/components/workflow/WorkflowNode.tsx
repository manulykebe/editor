import React from 'react';
import { Handle, Position } from 'reactflow';
import { Settings, Play, AlertCircle, XCircle } from 'lucide-react';

interface WorkflowNodeProps {
  data: {
    id: string;
    name: string;
    description: string;
    repeat: number;
    callbacks: {
      onStart: boolean;
      onStartRun: boolean;
      onComplete: boolean;
      onCompleteRun: boolean;
      onReject: boolean;
      onRejectRun: boolean;
      onAbort: boolean;
      onAbortRun: boolean;
    };
  };
  selected?: boolean;  
}

interface CallbackMarker {
  type: string;
  position: 'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight' | 'bottomCenter';
  icon: React.ReactNode;
  color: string;
}

export const WorkflowNode = ({ data, selected }: WorkflowNodeProps) => {
  const handleCallbackAction = (action: 'create' | 'edit' | 'delete', type: string) => {
    if (action === 'create') {
      // Show dropdown or create file
      const filename = `${data.id}/${type}.js`;
    } else if (action === 'edit') {
      // Open in editor
    } else if (action === 'delete') {
      // Remove callback
    }
  };

  return (
    <div className="bg-zinc-800 rounded-lg p-4 min-w-[200px] max-w-[200px] h-[100px]">
      {/* Top Markers */}
      <div className="flex justify-between mb-2">
        <div className="flex gap-1">
          { (
            <div 
              className="text-green-400 cursor-pointer group relative" 
              title="onStartCallback"
            >
              <Play size={16} />
              <div className="hidden group-hover:block absolute -top-8 bg-zinc-700 p-1 rounded">
                <div className="flex gap-1">
                  <button onClick={() => handleCallbackAction('edit', 'onStart')}>Edit</button>
                  <button onClick={() => handleCallbackAction('delete', 'onStart')}>Delete</button>
                </div>
              </div>
            </div>
          )}
          {data.repeat  && (
            <div className="text-blue-400 cursor-pointer" title="onStartRunCallback">
              <Play size={16} />
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="text-white">
        <h3 className="font-medium text-lg mb-1">{data.name}</h3>
        <p className="text-sm text-zinc-400">{data.description}</p>
      </div>

      {/* Bottom Markers */}
      <div className="flex justify-between mt-2">
        {/* Add onAbort, onReject etc markers */}
      </div>

      {/* Handles */}
      <Handle type="source" position={Position.Left} className="w-3 h-3" />
      <Handle type="target" position={Position.Right} className="w-3 h-3" />
    </div>
  );
};