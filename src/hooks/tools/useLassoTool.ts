import { useContext } from "react";

import { SelectionContext } from "@/context/Selection";
import { ToolContext } from "@/context/Tool";

import { useRadiusPosition } from "../useRadiusPosition";

export function useLassoTool(mouseCoords: Position, holdingAlt: boolean) {
	const { setSelectionCoords } = useContext(SelectionContext);
	const { radius } = useContext(ToolContext);

	const radiusPosition = useRadiusPosition(mouseCoords);

	const use = () => {
		setSelectionCoords((prev) => {
			const radiusCoords: CoordinateArray = [];

			for (let x = 0; x < radius; x++) {
				for (let y = 0; y < radius; y++) {
					const tileX = radiusPosition.x + x;
					const tileY = radiusPosition.y + y;

					const exists = prev.some(([x2, y2]) => x2 === tileX && y2 === tileY);
					if ((holdingAlt && exists) || !exists) radiusCoords.push([tileX, tileY]);
				}
			}

			if (holdingAlt) {
				return prev.filter(([x, y]) => !radiusCoords.some(([x2, y2]) => x2 === x && y2 === y));
			} else {
				return [...prev, ...radiusCoords];
			}
		});
	};

	return { use };
}
