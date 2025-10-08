import React, { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useState } from "react";
import pako from "pako";

import { HistoryContext } from "./History";
import welcomeBlocksData from "@/data/welcome.json";

interface Context {
	stageSize: Dimension;
	canvasSize: BoundingBox;
	blocks: Block[];
	coords: Position;
	scale: number;
	version: number;
	setStageSize: React.Dispatch<React.SetStateAction<Dimension>>;
	setBlocks: React.Dispatch<React.SetStateAction<Block[]>>;
	setCoords: React.Dispatch<React.SetStateAction<Position>>;
	setScale: React.Dispatch<React.SetStateAction<number>>;
	setVersion: React.Dispatch<React.SetStateAction<number>>;
	centerCanvas: () => void;
}

interface Props {
	children: ReactNode;
}

// eslint-disable-next-line react-refresh/only-export-components
export const CanvasContext = createContext<Context>({} as Context);

export const CanvasProvider = ({ children }: Props) => {
	const { addHistory } = useContext(HistoryContext);

	const [stageSize, setStageSize] = useState<Dimension>({ width: 0, height: 0 });
	const [blocks, setBlocks] = useState<Block[]>(welcomeBlocksData);
	const [coords, setCoords] = useState<Position>({ x: 0, y: 0 });
	const [scale, setScale] = useState(1);
	const [version, setVersion] = useState(12110);

	// Get the farthest away blocks in each direction
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

		if (minX == Infinity || maxX == Infinity || minY == Infinity || maxY == Infinity) {
			return {
				minX: 0,
				minY: 0,
				maxX: 0,
				maxY: 0,
			};
		}

		return {
			minX,
			minY,
			maxX: maxX + 1,
			maxY: maxY + 1,
		};
	}, [blocks]);

	const centerCanvas = useCallback(() => {
		// Margin of 8 blocks on each side
		const margin = 8 * 16;

		// Calculate the total width and height of the blocks, including margin
		const blocksWidth = (canvasSize.maxX - canvasSize.minX) * 16 + margin * 2;
		const blocksHeight = (canvasSize.maxY - canvasSize.minY) * 16 + margin * 2;

		// Calculate the scale to fit the blocks (with margin) within the stage
		const scaleX = stageSize.width / blocksWidth;
		const scaleY = stageSize.height / blocksHeight;

		// Use the smaller scale to fit the blocks inside the entire screen
		const newScale = Math.min(scaleX, scaleY);

		// Calculate the coordinates to center the blocks in the middle of the stage
		const newX = stageSize.width / 2 - ((blocksWidth - margin * 2) * newScale) / 2 - canvasSize.minX * 16 * newScale;
		const newY = stageSize.height / 2 - ((blocksHeight - margin * 2) * newScale) / 2 - canvasSize.minY * 16 * newScale;

		setScale(newScale);
		setCoords({ x: newX, y: newY });
	}, [canvasSize, stageSize]);

	useEffect(() => {
		// Load blocks from previous session (if any)
		const localStorageBlocks = localStorage.getItem("blocks");
		if (localStorageBlocks) {
			try {
				// Convert stored string (Base64) back to bytes
				const compressedData = Uint8Array.from(atob(localStorageBlocks), (c) => c.charCodeAt(0));
				const decompressed = pako.inflate(compressedData, { to: "string" });
				const parsedBlocks = JSON.parse(decompressed);

				setBlocks(parsedBlocks);
				addHistory(
					"Load Previous Session",
					() => setBlocks(parsedBlocks),
					() => setBlocks(welcomeBlocksData)
				);
			} catch (err) {
				console.error("Failed to load blocks from localStorage:", err);
				localStorage.removeItem("blocks");
			}
		} else {
			// Add history entry for new canvas
			addHistory(
				"New Canvas",
				() => setBlocks(welcomeBlocksData),
				() => setBlocks([])
			);
		}
	}, []);

	// Set blocks to localStorage for session persistence
	useEffect(() => {
		// If blocks are the same as the starting welcome blocks, return
		if (JSON.stringify(blocks) === JSON.stringify(welcomeBlocksData)) return;

		const encoder = new TextEncoder();
		const data = encoder.encode(JSON.stringify(blocks));
		const compressed = pako.deflate(data);

		// Store compressed data as Base64 string
		const base64 = btoa(String.fromCharCode(...compressed));
		localStorage.setItem("blocks", base64);
	}, [blocks]);

	return (
		<CanvasContext.Provider
			value={{
				stageSize,
				canvasSize,
				blocks,
				coords,
				scale,
				version,
				setStageSize,
				setBlocks,
				setCoords,
				setScale,
				setVersion,
				centerCanvas,
			}}
		>
			{children}
		</CanvasContext.Provider>
	);
};
