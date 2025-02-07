import { useContext } from "react";

import { CanvasContext } from "@/context/Canvas";
import { ToolContext } from "@/context/Tool";

export function useEyedropperTool(mouseCoords: Position) {
	const { blocks } = useContext(CanvasContext);
	const { setSelectedBlock } = useContext(ToolContext);

	const use = () => {
		const mouseBlock = blocks.find((block) => block.x === mouseCoords.x && block.y === mouseCoords.y);
		if (mouseBlock) setSelectedBlock(mouseBlock.name);
	};

	return { use };
}
