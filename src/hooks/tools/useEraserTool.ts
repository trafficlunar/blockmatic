import { useContext } from "react";

import { CanvasContext } from "@/context/Canvas";
import { SelectionContext } from "@/context/Selection";
import { ToolContext } from "@/context/Tool";

import { useRadiusPosition } from "../useRadiusPosition";

export function useEraserTool(mouseCoords: Position) {
	const { blocks, setBlocks } = useContext(CanvasContext);
	const { isInSelection } = useContext(SelectionContext);
	const { radius } = useContext(ToolContext);

	const radiusPosition = useRadiusPosition(mouseCoords);

	const use = () => {
		const updated = blocks.filter((block) => {
			const withinRadius =
				block.x >= radiusPosition.x && block.x < radiusPosition.x + radius && block.y >= radiusPosition.y && block.y < radiusPosition.y + radius;
			return !withinRadius || !isInSelection(block.x, block.y);
		});

		setBlocks(updated);
	};

	return { use };
}
