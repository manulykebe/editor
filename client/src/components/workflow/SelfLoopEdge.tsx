import React from "react";
import { EdgeProps, useReactFlow } from "reactflow";

export const SelfLoopEdge = ({
	id,
	source,
	sourceX,
	sourceY,
	style = {},
	markerEnd,
}: EdgeProps) => {
	const { getNode } = useReactFlow();

	// Get the node data using the source ID
	const node = getNode(source);

	if (!node) {
		return null;
	}

	const repeatCount = node.data.repeat;

	// Only render if repeatCount is not zero
	if (!repeatCount || repeatCount === 0) {
		return null;
	}

	const { height, width } = node;

	const radius = 10;
	const dh = 20;
	const dv = height! / 2 + dh;

	const path = `
    M ${sourceX}, ${sourceY}
    h -${dh - radius}
    a ${radius},${radius} 0 0 0 -${radius},${radius}
    v ${dv - radius}
    a ${radius},${radius} 0 0 0 ${radius},${radius}
    h ${width! + 6 + 2 * dh - 2 * radius}
    a ${radius},${radius} 0 0 0 ${radius},-${radius}
    v -${dv - radius}
    a ${radius},${radius} 0 0 0 -${radius},-${radius}
    h -${dh - radius}
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
			<text
				x={sourceX+10}
				y={sourceY + dv + 20} // Adjust position as needed
				className="react-flow__edge-text"
				textAnchor="middle"
				style={{ fill: 'blue' }} // Set text color here
			>
				{`repeat: 1/${repeatCount}`}
			</text>
		</g>
	);
};
