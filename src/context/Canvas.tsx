import React, { createContext, ReactNode, useMemo, useState } from "react";

interface Props {
	children: ReactNode;
}

export const CanvasContext = createContext({
	stageSize: { width: 0, height: 0 } as Dimension,
	canvasSize: { minX: 0, minY: 0, maxX: 0, maxY: 0 },
	blocks: [] as Block[],
	coords: { x: 0, y: 0 } as Position,
	scale: 0,
	setStageSize: ((size: Dimension) => {}) as React.Dispatch<React.SetStateAction<Dimension>>,
	setBlocks: ((blocks: Block[]) => {}) as React.Dispatch<React.SetStateAction<Block[]>>,
	setCoords: ((coords: Position) => {}) as React.Dispatch<React.SetStateAction<Position>>,
	setScale: ((value: number) => {}) as React.Dispatch<React.SetStateAction<number>>,
});

export const CanvasProvider = ({ children }: Props) => {
	const [stageSize, setStageSize] = useState({ width: 0, height: 0 } as Dimension);
	const [blocks, setBlocks] = useState<Block[]>([]);
	const [coords, setCoords] = useState<Position>({ x: 0, y: 0 });
	const [scale, setScale] = useState(1);

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

	return (
		<CanvasContext.Provider value={{ stageSize, canvasSize, blocks, coords, scale, setStageSize, setBlocks, setCoords, setScale }}>
			{children}
		</CanvasContext.Provider>
	);
};
