import { useMemo } from "react";

import _blockData from "@/data/blocks/data.json";
const blockData: BlockData = _blockData;

export function useBlockData(version: number): BlockData {
	return useMemo(() => {
		const result: BlockData = {};

		for (const key in blockData) {
			if (blockData[key].version <= version) {
				result[key] = blockData[key];
			}
		}

		return result;
	}, [version]);
}
