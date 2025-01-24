// Check if a block is within the selection
export function isInSelection(selection: CoordinateArray, x: number, y: number): boolean {
	if (selection.length !== 0) {
		return selection.some(([x2, y2]) => x2 === x && y2 === y);
	}
	return true;
}

export function confirmSelection(
	blocks: Block[],
	layerBlocks: Block[],
	setBlocks: React.Dispatch<React.SetStateAction<Block[]>>,
	setLayerBlocks: React.Dispatch<React.SetStateAction<Block[]>>
) {
	const combinedBlocks = [...blocks, ...layerBlocks];
	const uniqueBlocks = Array.from(new Map(combinedBlocks.map((block) => [`${block.x},${block.y}`, block])).values());

	setBlocks(uniqueBlocks);
	setLayerBlocks([]);
}
