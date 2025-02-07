import { useContext } from "react";

import { SelectionContext } from "@/context/Selection";
import { ToolContext } from "@/context/Tool";

export function useRectangleSelectTool(mouseCoords: Position, dragStartCoords: Position, holdingShift: boolean) {
	const { setSelectionCoords } = useContext(SelectionContext);
	const { radius } = useContext(ToolContext);

	const use = () => {
		const newSelection: CoordinateArray = [];

		const startX = Math.min(dragStartCoords.x, mouseCoords.x);
		let endX = Math.max(dragStartCoords.x, mouseCoords.x);
		const startY = Math.min(dragStartCoords.y, mouseCoords.y);
		let endY = Math.max(dragStartCoords.y, mouseCoords.y);

		const isRadiusEven = radius == 1 || radius % 2 == 0;
		const radiusOffset = isRadiusEven ? radius : radius - 1;

		// If holding shift, create a square selection
		if (holdingShift) {
			const width = Math.abs(endX - startX);
			const height = Math.abs(endY - startY);
			const size = Math.max(width, height);

			endX = startX + (endX < startX ? -size : size);
			endY = startY + (endY < startY ? -size : size);
		}

		for (let x = startX; x < endX + radiusOffset; x++) {
			for (let y = startY; y < endY + radiusOffset; y++) {
				newSelection.push([x, y]);
			}
		}

		setSelectionCoords(newSelection);
	};

	return { use };
}
