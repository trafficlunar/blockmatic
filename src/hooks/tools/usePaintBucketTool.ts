import { useContext } from "react";

import { CanvasContext } from "@/context/Canvas";
import { ToolContext } from "@/context/Tool";

export function usePaintBucketTool(mouseCoords: Position) {
	const { blocks, canvasSize, setBlocks } = useContext(CanvasContext);
	const { selectedBlock } = useContext(ToolContext);

	// Directions for adjacent blocks (up, down, left, right)
	const directions = [
		{ dx: 0, dy: 1 },
		{ dx: 0, dy: -1 },
		{ dx: 1, dy: 0 },
		{ dx: -1, dy: 0 },
	];

	const use = () => {
		const visited = new Set<string>();
		const startBlock = blocks.find((block) => block.x === mouseCoords.x && block.y === mouseCoords.y);
		const startName = startBlock ? startBlock.name : "air";

		// If the target area is already the selected block, return
		if (startName === selectedBlock) return;

		function floodFill(x: number, y: number) {
			const key = `${x},${y}`;
			if (visited.has(key)) return;
			visited.add(key);

			const withinCanvas = x >= canvasSize.minX && x < canvasSize.maxX && y >= canvasSize.minY && y < canvasSize.maxY;
			if (!withinCanvas) return;

			const block = blocks.find((b) => b.x === x && b.y === y);
			const currentName = block ? block.name : "air";

			// Only fill if the current block name matches the target block name.
			if (currentName !== startName) return;

			// Update block name or push new one
			if (block) {
				block.name = selectedBlock;
			} else {
				blocks.push({ x, y, name: selectedBlock });
			}

			// Recursive
			for (const { dx, dy } of directions) {
				floodFill(x + dx, y + dy);
			}
		}

		floodFill(mouseCoords.x, mouseCoords.y);
		setBlocks(() => [...blocks]);
	};

	return { use };
}
