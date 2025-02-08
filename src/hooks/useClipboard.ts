import { useContext } from "react";

import { CanvasContext } from "@/context/Canvas";
import { SelectionContext } from "@/context/Selection";
import { ToolContext } from "@/context/Tool";

export function useClipboard() {
	const { blocks } = useContext(CanvasContext);
	const { selectionCoords, setSelectionCoords, setSelectionLayerBlocks } = useContext(SelectionContext);
	const { setTool } = useContext(ToolContext);

	function copy() {
		const selectorBlocks = selectionCoords.map(([x, y]) => blocks.find((block) => block.x === x && block.y === y)).filter(Boolean);
		navigator.clipboard.writeText(JSON.stringify(selectorBlocks));
	}

	async function paste() {
		try {
			const clipboardText = await navigator.clipboard.readText();
			const clipboardBlocks = JSON.parse(clipboardText);

			// Check if pasted object is of type Block[]
			if (
				!Array.isArray(clipboardBlocks) ||
				!clipboardBlocks.every((block) => typeof block.x === "number" && typeof block.y === "number" && typeof block.name === "string")
			)
				return;

			setSelectionLayerBlocks(clipboardBlocks);
			setSelectionCoords(clipboardBlocks.map(({ x, y }) => [x, y]));
			setTool("move");
		} catch (error) {
			console.error("Failed to read/parse clipboard:", error);
		}
	}

	return { copy, paste };
}
