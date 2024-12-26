import _blockData from "@/data/blocks/programmer-art/data.json";
const blockData: BlockData = _blockData;

export const findBlockFromRgb = (r: number, g: number, b: number, a: number): string => {
	return Object.entries(blockData).reduce(
		(closestBlock, [block, data]) => {
			const distance = Math.sqrt(
				Math.pow(r - data.color[0], 2) + Math.pow(g - data.color[1], 2) + Math.pow(b - data.color[2], 2) + Math.pow(a - data.color[3], 2)
			);
			return distance < closestBlock.distance ? { block, distance } : closestBlock;
		},
		{ block: "", distance: Infinity }
	).block;
};
