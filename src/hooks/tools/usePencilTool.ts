import { useContext } from "react";

import { CanvasContext } from "@/context/Canvas";
import { SelectionContext } from "@/context/Selection";
import { ToolContext } from "@/context/Tool";

import { useRadiusPosition } from "../useRadiusPosition";

export function usePencilTool(mouseCoords: Position) {
	const { blocks, setBlocks } = useContext(CanvasContext);
	const { isInSelection } = useContext(SelectionContext);
	const { selectedBlock, radius } = useContext(ToolContext);

	const radiusPosition = useRadiusPosition(mouseCoords);

	const use = () => {
		if (selectedBlock == "air") return;
		const radiusBlocks: Block[] = [];

		for (let x = 0; x < radius; x++) {
			for (let y = 0; y < radius; y++) {
				const tileX = radiusPosition.x + x;
				const tileY = radiusPosition.y + y;

				// Only add blocks within the selection
				if (isInSelection(tileX, tileY)) {
					radiusBlocks.push({
						name: selectedBlock,
						x: tileX,
						y: tileY,
					});
				}
			}
		}

		const mergedBlocks = blocks.filter((block) => {
			return !radiusBlocks.some((newBlock) => block.x === newBlock.x && block.y === newBlock.y);
		});

		setBlocks([...mergedBlocks, ...radiusBlocks]);
	};

	return { use };
}
