import { useContext, useMemo } from "react";
import { ToolContext } from "@/context/Tool";

export function useRadiusPosition(mouseCoords: Position): Position {
	const { radius } = useContext(ToolContext);

	// If number is odd, cursor is in the center
	// If number is even, cursor is in the top-left corner

	return useMemo(() => {
		const halfSize = Math.floor(radius / 2);
		const x = mouseCoords.x - (radius % 2 === 0 ? 0 : halfSize);
		const y = mouseCoords.y - (radius % 2 === 0 ? 0 : halfSize);
		return { x, y };
	}, [radius, mouseCoords]);
}
