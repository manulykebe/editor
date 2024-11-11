import React from 'react';
import { Panel } from 'reactflow';
import { Save, Plus, Play, Pause } from 'lucide-react';

interface WorkflowControlsProps {
  onSave: () => void;
  onAddNode: () => void;
  isSaving?: boolean;
}

export const WorkflowControls = ({ onSave, onAddNode }: WorkflowControlsProps) => {
  return (
    <Panel position="top-right" className="bg-zinc-800 p-2 rounded-lg shadow-lg">
      <div className="flex gap-2">
        <button
          className="p-2 hover:bg-zinc-700 rounded text-zinc-300 hover:text-zinc-50"
          onClick={onSave}
          title="Save Workflow"
        >
          <Save size={20} />
        </button>
        <button
          className="p-2 hover:bg-zinc-700 rounded text-zinc-300 hover:text-zinc-50"
          onClick={onAddNode}
          title="Add Node"
        >
          <Plus size={20} />
        </button>
        <button
          className="p-2 hover:bg-zinc-700 rounded text-zinc-300 hover:text-zinc-50"
          title="Run Workflow"
        >
          <Play size={20} />
        </button>
        <button
          className="p-2 hover:bg-zinc-700 rounded text-zinc-300 hover:text-zinc-50"
          title="Stop Workflow"
        >
          <Pause size={20} />
        </button>
      </div>
    </Panel>
  );
};