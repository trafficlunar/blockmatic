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
}

// Lifts 16,000 tiles limit
settings.use32bitIndex = true;

function Blocks({ blocks, missingTexture, textures, coords, scale, version }: Props) {
	const app = useApp();
	const tilemapRef = useRef<CompositeTilemap>();

	const tileBlocks = () => {
		if (!tilemapRef.current) return;
		const tilemap = tilemapRef.current;
		tilemap.clear();

		// Tile solid colors at smaller scales
		blocks.forEach((block) => {
			tilemap.tile(textures[block.name] ?? missingTexture, block.x * 16, block.y * 16);
		});
	};

	useEffect(() => {
		const tilemap = new CompositeTilemap();
		tilemapRef.current = tilemap;
		app.stage.addChildAt(tilemap, 0);

		tileBlocks();
	}, []);

	useEffect(tileBlocks, [blocks, version]);

	useEffect(() => {
		if (!tilemapRef.current) return;

		tileBlocks();

		tilemapRef.current.x = coords.x;
		tilemapRef.current.y = coords.y;
		tilemapRef.current.scale.set(scale, scale);
	}, [coords, scale]);

	return null;
}

export default Blocks;
