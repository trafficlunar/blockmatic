import { useContext, useRef } from "react";

import { CanvasContext } from "@/context/Canvas";
import { SelectionContext } from "@/context/Selection";
import { ToolContext } from "@/context/Tool";

import { useRadiusPosition } from "@/hooks/useRadiusPosition";
import { interpolate } from "@/utils/interpolate";

export function usePencilTool(mouseCoords: Position) {
	const { blocks, setBlocks } = useContext(CanvasContext);
	const { isInSelection } = useContext(SelectionContext);
	const { selectedBlock, radius } = useContext(ToolContext);

	const radiusPosition = useRadiusPosition(mouseCoords);
	const lastPosition = useRef<Position | null>(null);

	const stop = () => {
		lastPosition.current = null;
	};

	const use = () => {
		// Don't allow the user to add air blocks
		if (selectedBlock == "air") return;
		const newBlocks: Block[] = [];

		const addBlock = (x: number, y: number) => {
			if (isInSelection(x, y)) {
				newBlocks.push({
					name: selectedBlock,
					x,
					y,
				});
			}
		};

		// Interpolate to remove holes
		if (lastPosition.current) {
			const interpolatedPositions = interpolate(radius, lastPosition.current, radiusPosition);
			if (!interpolatedPositions) return;

			interpolatedPositions.forEach(({ x, y }) => addBlock(x, y));
		} else {
			for (let x = 0; x < radius; x++) {
				for (let y = 0; y < radius; y++) {
					const tileX = radiusPosition.x + x;
					const tileY = radiusPosition.y + y;

					addBlock(tileX, tileY);
				}
			}
		}

		// Remove duplicates
		const mergedBlocks = blocks.filter((block) => {
			return !newBlocks.some((b) => block.x === b.x && block.y === b.y);
		});

		setBlocks([...mergedBlocks, ...newBlocks]);
		lastPosition.current = radiusPosition;
	};

	return { stop, use };
}
