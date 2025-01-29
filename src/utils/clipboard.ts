export function copy(selectionCoords: CoordinateArray, blocks: Block[]) {
	// Get all blocks within selection
	const selectorBlocks = selectionCoords
		.map((coord) => {
			const [x, y] = coord;
			return blocks.find((block) => block.x === x && block.y === y);
		})
		.filter((block) => block !== undefined);

	// Write to clipboard
	navigator.clipboard.writeText(JSON.stringify(selectorBlocks));
}

export async function paste(
	setSelectionLayerBlocks: React.Dispatch<React.SetStateAction<Block[]>>,
	setSelectionCoords: React.Dispatch<React.SetStateAction<CoordinateArray>>,
	setTool: React.Dispatch<React.SetStateAction<Tool>>
) {
	try {
		// Read clipboard then parse it
		const clipboardText = await navigator.clipboard.readText();
		const clipboardBlocks = JSON.parse(clipboardText);

		// Check if pasted object is of type Block[]
		if (
			!Array.isArray(clipboardBlocks) ||
			!clipboardBlocks.every((block) => typeof block.x === "number" && typeof block.y === "number" && typeof block.name === "string")
		)
			return;

		setSelectionLayerBlocks(clipboardBlocks);
		setSelectionCoords(clipboardBlocks.map((block) => [block.x, block.y]));
		setTool("move");
	} catch (error) {
		console.error("Failed to read/parse clipboard:", error);
	}
}
