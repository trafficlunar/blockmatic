import React, { createContext, ReactNode, useMemo, useState } from "react";

interface Props {
	children: ReactNode;
}

export const CanvasContext = createContext({
	canvasSize: { minX: 0, minY: 0, maxX: 0, maxY: 0 },
	blocks: [] as Block[],
	setBlocks: ((blocks: Block[]) => {}) as React.Dispatch<React.SetStateAction<Block[]>>,
});

export const CanvasProvider = ({ children }: Props) => {
	const [blocks, setBlocks] = useState<Block[]>([]);

	const canvasSize = useMemo(() => {
		let minX = Infinity,
			maxX = -Infinity;
		let minY = Infinity,
			maxY = -Infinity;

		blocks.forEach((coord) => {
			if (coord.x < minX) minX = coord.x;
			if (coord.x > maxX) maxX = coord.x;
			if (coord.y < minY) minY = coord.y;
			if (coord.y > maxY) maxY = coord.y;
		});

		return {
			minX,
			minY,
			maxX: maxX + 1,
			maxY: maxY + 1,
		};
	}, [blocks]);

	return <CanvasContext.Provider value={{ canvasSize, blocks, setBlocks }}>{children}</CanvasContext.Provider>;
};
