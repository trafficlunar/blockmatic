import _blockData from "@/data/blocks/data.json";
const blockData: BlockData = _blockData;

export function getBlockData(version: number) {
	const filteredData: BlockData = {};

	for (const key in blockData) {
		if (blockData[key].version <= version) {
			filteredData[key] = blockData[key];
		}
	}

	return filteredData;
}
