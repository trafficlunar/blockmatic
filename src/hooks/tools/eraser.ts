import { useContext, useRef } from "react";

import { CanvasContext } from "@/context/Canvas";
import { SelectionContext } from "@/context/Selection";
import { ToolContext } from "@/context/Tool";

import { useRadiusPosition } from "../useRadiusPosition";
import { interpolate } from "@/utils/interpolate";

export function useEraserTool(mouseCoords: Position) {
	const { blocks, setBlocks } = useContext(CanvasContext);
	const { isInSelection } = useContext(SelectionContext);
	const { radius } = useContext(ToolContext);

	const radiusPosition = useRadiusPosition(mouseCoords);
	const lastPosition = useRef<Position | null>(null);

	const stop = () => {
		lastPosition.current = null;
	};

	const use = () => {
		const positions: Position[] = [];

		const eraseBlock = (x: number, y: number) => {
			if (isInSelection(x, y)) {
				positions.push({ x, y });
			}
		};

		// Interpolate to ensure continuous erasing
		if (lastPosition.current) {
			const interpolatedPositions = interpolate(radius, lastPosition.current, radiusPosition);
			if (!interpolatedPositions) return;

			interpolatedPositions.forEach(({ x, y }) => eraseBlock(x, y));
		} else {
			for (let x = 0; x < radius; x++) {
				for (let y = 0; y < radius; y++) {
					eraseBlock(radiusPosition.x + x, radiusPosition.y + y);
				}
			}
		}

		// Filter out erased blocks
		const updatedBlocks = blocks.filter((block) => !positions.some((b) => block.x === b.x && block.y === b.y));

		setBlocks(updatedBlocks);
		lastPosition.current = radiusPosition;
	};

	return { stop, use };
}
