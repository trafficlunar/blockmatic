/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useRef } from "react";

import * as PIXI from "pixi.js";
import { useApp } from "@pixi/react";
import { CompositeTilemap, settings } from "@pixi/tilemap";

interface Props {
	blocks: Block[];
	missingTexture: PIXI.Texture | undefined;
	textures: Record<string, PIXI.Texture>;
	coords: Position;
	scale: number;
	version: number;
	isSelectionLayer?: boolean;
}

// Lifts 16,000 tiles limit
settings.use32bitIndex = true;

function Blocks({ blocks, missingTexture, textures, coords, scale, version, isSelectionLayer }: Props) {
	const app = useApp();
	const tilemapRef = useRef<CompositeTilemap>();
	const containerRef = useRef<PIXI.Container>();

	useEffect(() => {
		if (!tilemapRef.current) return;
		const tilemap = tilemapRef.current;

		tilemap.clear();

		// Tile solid colors at smaller scales
		blocks.forEach((block) => {
			tilemap.tile(textures[block.name] ?? missingTexture, block.x * 16, block.y * 16);
		});
	}, [blocks, version]);

	useEffect(() => {
		if (containerRef.current) return;

		const container = new PIXI.Container();
		containerRef.current = container;

		// Put selection layer on top of the blocks layer
		app.stage.addChildAt(container, isSelectionLayer ? 1 : 0);

		const tilemap = new CompositeTilemap();
		tilemapRef.current = tilemap;
		container.addChild(tilemap);

		if (isSelectionLayer) container.filters = [new PIXI.AlphaFilter(0.5)];
	}, []);

	useEffect(() => {
		if (!tilemapRef.current) return;
		const tilemap = tilemapRef.current;

		tilemap.x = coords.x;
		tilemap.y = coords.y;
		tilemap.scale.set(scale, scale);
	}, [coords, scale]);

	return null;
}

export default Blocks;
