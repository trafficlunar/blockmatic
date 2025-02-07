import { useContext } from "react";

import { SelectionContext } from "@/context/Selection";
import { CanvasContext } from "@/context/Canvas";

export function useMoveTool(mouseMovement: Position) {
	const { setBlocks } = useContext(CanvasContext);
	const { selectionLayerBlocks, setSelectionCoords, setSelectionLayerBlocks, isInSelection } = useContext(SelectionContext);

	const use = () => {
		// If there is no selection currently being moved...
		if (selectionLayerBlocks.length == 0) {
			const result: Block[] = [];

			setBlocks((prev) =>
				prev.filter((b) => {
					const isSelected = isInSelection(b.x, b.y);

					// Add blocks in the selection coords to the selection layer
					if (isSelected) result.push(b);

					// Remove blocks originally there
					return !isSelected;
				})
			);
			setSelectionLayerBlocks(result);
		}

		// Increase each coordinate in the selection by the mouse movement
		setSelectionCoords((prev) => prev.map(([x, y]) => [x + mouseMovement.x, y + mouseMovement.y]));
		setSelectionLayerBlocks((prev) => prev.map((b) => ({ ...b, x: b.x + mouseMovement.x, y: b.y + mouseMovement.y })));
	};

	return { use };
}
