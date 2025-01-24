// Check if a block is within the selection
export const isInSelection = (selection: CoordinateArray, x: number, y: number): boolean => {
	if (selection.length !== 0) {
		return selection.some(([x2, y2]) => x2 === x && y2 === y);
	}
	return true;
};
