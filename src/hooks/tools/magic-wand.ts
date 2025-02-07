import { useContext } from "react";

import { CanvasContext } from "@/context/Canvas";
import { SelectionContext } from "@/context/Selection";

export function useMagicWandTool(mouseCoords: Position, holdingShift: boolean, holdingAlt: boolean) {
	const { blocks, canvasSize } = useContext(CanvasContext);
	const { setSelectionCoords } = useContext(SelectionContext);

	// Directions for adjacent blocks (up, down, left, right)
	const directions = [
		{ dx: 0, dy: 1 },
		{ dx: 0, dy: -1 },
		{ dx: 1, dy: 0 },
		{ dx: -1, dy: 0 },
	];

	const use = () => {
		const visited = new Set<string>();
		const result: CoordinateArray = [];
		const startBlock = blocks.find((block) => block.x === mouseCoords.x && block.y === mouseCoords.y);
		const startName = startBlock ? startBlock.name : "air";

		function depthFirstSearch(x: number, y: number) {
			const key = `${x},${y}`;
			if (visited.has(key)) return;
			visited.add(key);

			const withinCanvas = x >= canvasSize.minX && x < canvasSize.maxX && y >= canvasSize.minY && y < canvasSize.maxY;
			if (!withinCanvas) return;

			result.push([x, y]);

			for (const { dx, dy } of directions) {
				const newX = x + dx;
				const newY = y + dy;
				const adjacentBlock = blocks.find((b) => b.x === newX && b.y === newY);
				const adjacentName = adjacentBlock ? adjacentBlock.name : "air";

				if (adjacentName === startName) {
					depthFirstSearch(newX, newY);
				}
			}
		}

		depthFirstSearch(mouseCoords.x, mouseCoords.y);
		setSelectionCoords((prev) => {
			if (holdingAlt) {
				// If holding alt, remove new magic wand selection
				return prev.filter(([x, y]) => !result.some(([x2, y2]) => x2 === x && y2 === y));
			} else if (holdingShift) {
				// If holding shift, add magic wand selection to existing selection
				const existing = new Set(prev.map(([x, y]) => `${x},${y}`));
				const newCoords = result.filter(([x, y]) => !existing.has(`${x},${y}`));
				return [...prev, ...newCoords];
			}

			// If not holding alt or shift, replace the existing selection with the magic wand selection
			return result;
		});
	};

	return { use };
}
