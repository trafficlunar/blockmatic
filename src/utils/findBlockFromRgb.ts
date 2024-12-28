import _blockData from "@/data/blocks/data.json";
const blockData: BlockData = _blockData;

export const findBlockFromRgb = (data: BlockData | string[], r: number, g: number, b: number, a: number): string => {
	const source = Array.isArray(data) ? Object.entries(blockData).filter(([block]) => data.includes(block)) : Object.entries(data);

	return source.reduce(
		(closestBlock, [block, blockData]) => {
			const distance = Math.sqrt(
				Math.pow(r - blockData.color[0], 2) +
					Math.pow(g - blockData.color[1], 2) +
					Math.pow(b - blockData.color[2], 2) +
					Math.pow(a - blockData.color[3], 2)
			);
			return distance < closestBlock.distance ? { block, distance } : closestBlock;
		},
		{ block: "", distance: Infinity }
	).block;
};
