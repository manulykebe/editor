import React from 'react';
import { EdgeProps, getSmoothStepPath } from 'reactflow';

export const SelfLoopEdge = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  style = {},
  markerEnd,
}: EdgeProps) => {
  const radius = 30;
  const path = `
    M ${sourceX},${sourceY}
    a ${radius},${radius} 0 1,0 ${radius * -2},0
    a ${radius},${radius} 0 1,0 ${radius * 2},0
  `;

  return (
    <g>
      <path
        id={id}
        className="react-flow__edge-path"
        d={path}
        markerEnd={markerEnd}
        style={style}
      />
    </g>
  );
};