import React, { createContext, ReactNode, useMemo, useState } from "react";

interface Context {
	stageSize: Dimension;
	canvasSize: CanvasSize;
	blocks: Block[];
	coords: Position;
	scale: number;
	version: number;
	setStageSize: React.Dispatch<React.SetStateAction<Dimension>>;
	setBlocks: React.Dispatch<React.SetStateAction<Block[]>>;
	setCoords: React.Dispatch<React.SetStateAction<Position>>;
	setScale: React.Dispatch<React.SetStateAction<number>>;
	setVersion: React.Dispatch<React.SetStateAction<number>>;
}

interface Props {
	children: ReactNode;
}

export const CanvasContext = createContext<Context>({} as Context);

export const CanvasProvider = ({ children }: Props) => {
	const [stageSize, setStageSize] = useState({ width: 0, height: 0 } as Dimension);
	const [blocks, setBlocks] = useState<Block[]>([]);
	const [coords, setCoords] = useState<Position>({ x: 0, y: 0 });
	const [scale, setScale] = useState(1);
	const [version, setVersion] = useState(1214);

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
		<CanvasContext.Provider
			value={{ stageSize, canvasSize, blocks, coords, scale, version, setStageSize, setBlocks, setCoords, setScale, setVersion }}
		>
			{children}
		</CanvasContext.Provider>
	);
};
