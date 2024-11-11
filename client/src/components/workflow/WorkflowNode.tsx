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
}

export const WorkflowNode = ({ data }: WorkflowNodeProps) => {
  return (
    <div className="bg-zinc-800 rounded-lg shadow-lg p-4 min-w-[200px]">
      {/* Top Markers */}
      <div className="flex justify-between mb-2">
        <div className="flex gap-1">
          {data.callbacks.onStart && (
            <div className="text-green-400 cursor-pointer" title="onStartCallback">
              <Play size={16} />
            </div>
          )}
          {data.callbacks.onStartRun && (
            <div className="text-blue-400 cursor-pointer" title="onStartRunCallback">
              <Play size={16} />
            </div>
          )}
        </div>
        <div className="flex gap-1">
          {data.callbacks.onComplete && (
            <div className="text-green-400 cursor-pointer" title="onCompleteCallback">
              <Settings size={16} />
            </div>
          )}
          {data.callbacks.onCompleteRun && (
            <div className="text-blue-400 cursor-pointer" title="onCompleteRunCallback">
              <Settings size={16} />
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="text-white">
        <h3 className="font-medium text-lg mb-1">{data.name}</h3>
        <p className="text-sm text-zinc-400">{data.description}</p>
        {data.repeat > 0 && (
          <div className="text-sm text-blue-400 mt-1">
            Repeats: {data.repeat}
          </div>
        )}
      </div>

      {/* Bottom Markers */}
      <div className="flex justify-between mt-2">
        <div className="flex gap-1">
          {data.callbacks.onAbort && (
            <div className="text-red-400 cursor-pointer" title="onAbortCallback">
              <XCircle size={16} />
            </div>
          )}
          {data.callbacks.onAbortRun && (
            <div className="text-orange-400 cursor-pointer" title="onAbortRunCallback">
              <XCircle size={16} />
            </div>
          )}
        </div>
        <div className="flex gap-1">
          {data.callbacks.onReject && (
            <div className="text-red-400 cursor-pointer" title="onRejectCallback">
              <AlertCircle size={16} />
            </div>
          )}
          {data.callbacks.onRejectRun && (
            <div className="text-orange-400 cursor-pointer" title="onRejectRunCallback">
              <AlertCircle size={16} />
            </div>
          )}
        </div>
      </div>

      {/* Handles */}
      <Handle type="target" position={Position.Top} className="w-3 h-3" />
      <Handle type="source" position={Position.Bottom} className="w-3 h-3" />
    </div>
  );
};