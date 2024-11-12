import React, { useState, useCallback } from 'react';
import { Handle, Position } from 'reactflow';
import { Play, Check, AlertCircle, XCircle } from 'lucide-react';
import { CallbackMarker } from './CallbackMarker';
import { CallbackEditor } from './CallbackEditor';
import type { CallbackMarker as CallbackMarkerType } from './CallbackMarker';

interface WorkflowNodeProps {
  data: {
    id: string;
    name: string;
    description: string;
    repeat?: number;
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

export const WorkflowNode = ({ data, selected }: WorkflowNodeProps) => {
  const [editorOpen, setEditorOpen] = useState(false);
  const [currentCallback, setCurrentCallback] = useState<{
    type: string;
    code: string;
  } | null>(null);

  const markers: CallbackMarkerType[] = [
    // Top Left
    {
      name: 'onStartCallback',
      position: 'topLeft',
      icon: <Play />,
      color: 'bg-green-400'
    },
    {
      name: 'onStartRunCallback',
      position: 'topLeft',
      icon: <Play />,
      color: 'bg-blue-400',
      isRunCallback: true
    },
    // Top Right
    {
      name: 'onCompleteCallback',
      position: 'topRight',
      icon: <Check />,
      color: 'bg-green-400'
    },
    {
      name: 'onCompleteRunCallback',
      position: 'topRight',
      icon: <Check />,
      color: 'bg-blue-400',
      isRunCallback: true
    },
    // Bottom Left
    {
      name: 'onAbortCallback',
      position: 'bottomLeft',
      icon: <XCircle />,
      color: 'bg-red-400'
    },
    {
      name: 'onAbortRunCallback',
      position: 'bottomLeft',
      icon: <XCircle />,
      color: 'bg-orange-400',
      isRunCallback: true
    },
    // Bottom Right
    {
      name: 'onRejectCallback',
      position: 'bottomRight',
      icon: <AlertCircle />,
      color: 'bg-yellow-400'
    },
    {
      name: 'onRejectRunCallback',
      position: 'bottomRight',
      icon: <AlertCircle />,
      color: 'bg-amber-400',
      isRunCallback: true
    }
  ];

  const handleCallbackAction = useCallback(async (action: 'create' | 'edit' | 'delete', type: string) => {
    const filename = `${data.id}/${type}.js`;
    
    if (action === 'create' || action === 'edit') {
      try {
        if (action === 'edit') {
          const response = await fetch(`http://localhost:3000/api/files?path=${encodeURIComponent(filename)}`);
          const { content } = await response.json();
          setCurrentCallback({ type, code: content });
        } else {
          setCurrentCallback({
            type,
            code: `// ${type}\nconsole.log('${type} executed');`
          });
        }
        setEditorOpen(true);
      } catch (error) {
        console.error('Error loading callback file:', error);
      }
    } else if (action === 'delete') {
      if (!confirm(`Delete ${type}?`)) return;
      
      try {
        await fetch(`http://localhost:3000/api/files?path=${encodeURIComponent(filename)}`, {
          method: 'DELETE'
        });
        // Update node data to reflect the removed callback
        data.callbacks[type.replace('Callback', '')] = false;
      } catch (error) {
        console.error('Error deleting callback file:', error);
      }
    }
  }, [data]);

  const handleSaveCallback = useCallback(async (code: string) => {
    if (!currentCallback) return;

    const filename = `${data.id}/${currentCallback.type}.js`;
    
    try {
      await fetch('http://localhost:3000/api/files', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          path: filename,
          content: code
        })
      });
      
      // Update node data to reflect the new/updated callback
      data.callbacks[currentCallback.type.replace('Callback', '')] = true;
      setEditorOpen(false);
      setCurrentCallback(null);
    } catch (error) {
      console.error('Error saving callback file:', error);
    }
  }, [currentCallback, data]);

  return (
    <>
      <div className="relative bg-zinc-800 rounded-lg p-4 min-w-[200px] max-w-[200px] h-[100px]">
        {/* Markers */}
        {markers.map((marker) => (
          <CallbackMarker
            key={marker.name}
            marker={marker}
            isEnabled={data.callbacks[marker.name.replace('Callback', '')]}
            workflowId={data.id}
            nodeId={data.id}
            onAction={handleCallbackAction}
          />
        ))}

        {/* Content */}
        <div className="text-white mt-4">
          <h3 className="font-medium text-lg mb-1">{data.name}</h3>
          <p className="text-sm text-zinc-400">{data.description}</p>
        </div>

        {/* Handles */}
        <Handle type="target" position={Position.Left} className="w-3 h-3 !bg-blue-400" />
        <Handle type="source" position={Position.Right} className="w-3 h-3 !bg-blue-400" />
      </div>

      {/* Callback Editor Dialog */}
      <CallbackEditor
        isOpen={editorOpen}
        onClose={() => {
          setEditorOpen(false);
          setCurrentCallback(null);
        }}
        onSave={handleSaveCallback}
        title={currentCallback ? `Edit ${currentCallback.type}` : 'Create Callback'}
        initialCode={currentCallback?.code || ''}
      />
    </>
  );
};