import React, { useState } from 'react';
import { Plus, Edit2, Trash2 } from 'lucide-react';

export interface CallbackMarker {
  name: string;
  position: 'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight' | 'bottomCenter';
  icon: React.ReactNode;
  color: string;
  isRunCallback?: boolean;
}

interface CallbackMarkerProps {
  marker: CallbackMarker;
  isEnabled: boolean;
  workflowId: string;
  nodeId: string;
  onAction: (action: 'create' | 'edit' | 'delete', type: string) => void;
}

const positionClasses = {
  topLeft: 'top-2 left-2',
  topRight: 'top-2 right-2',
  bottomLeft: 'bottom-2 left-2',
  bottomRight: 'bottom-2 right-2',
  bottomCenter: 'bottom-2 left-1/2 transform -translate-x-1/2'
};

export const CallbackMarker: React.FC<CallbackMarkerProps> = ({ 
  marker, 
  isEnabled, 
  onAction 
}) => {
  const [showActions, setShowActions] = useState(false);

  if (!isEnabled && marker.isRunCallback) return null;

  return (
    <div 
      className={`absolute ${positionClasses[marker.position]} group`}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      <div 
        className={`w-3 h-3 rounded-full cursor-pointer flex items-center justify-center ${
          isEnabled ? marker.color : 'bg-zinc-600'
        }`}
        title={marker.name}
      >
        {React.cloneElement(marker.icon as React.ReactElement, { 
          size: 12,
          className: 'text-zinc-900'
        })}
      </div>

      {showActions && (
        <div className="absolute z-50 bg-zinc-800 rounded shadow-lg p-1 text-xs whitespace-nowrap">
          <div className="mb-1 font-medium text-zinc-300">{marker.name}</div>
          <div className="flex gap-1">
            {!isEnabled && (
              <button
                className="p-1 hover:bg-zinc-700 rounded flex items-center gap-1 text-green-400"
                onClick={() => onAction('create', marker.name)}
              >
                <Plus size={12} />
                Create
              </button>
            )}
            {isEnabled && (
              <>
                <button
                  className="p-1 hover:bg-zinc-700 rounded flex items-center gap-1 text-blue-400"
                  onClick={() => onAction('edit', marker.name)}
                >
                  <Edit2 size={12} />
                  Edit
                </button>
                <button
                  className="p-1 hover:bg-zinc-700 rounded flex items-center gap-1 text-red-400"
                  onClick={() => onAction('delete', marker.name)}
                >
                  <Trash2 size={12} />
                  Delete
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};