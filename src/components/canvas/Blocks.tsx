/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useRef } from "react";

import * as PIXI from "pixi.js";
import { useApp } from "@pixi/react";
import { CompositeTilemap, settings } from "@pixi/tilemap";

import { getBlockData } from "@/utils/getBlockData";
import { findBlockFromRgb } from "@/utils/findBlockFromRgb";

interface Props {
	blocks: Block[];
	setBlocks: React.Dispatch<React.SetStateAction<Block[]>>;
	missingTexture: PIXI.Texture | undefined;
	textures: Record<string, PIXI.Texture>;
	solidTextures: Record<string, PIXI.Texture>;
	image: HTMLImageElement | undefined;
	imageDimensions: Dimension;
	coords: Position;
	scale: number;
	version: number;
	setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

// Lifts 16,000 tiles limit
settings.use32bitIndex = true;

function Blocks({ blocks, setBlocks, missingTexture, textures, solidTextures, image, imageDimensions, coords, scale, version, setLoading }: Props) {
	const app = useApp();
	const tilemapRef = useRef<CompositeTilemap>();

	const blockData = getBlockData(version);

	const tileBlocks = () => {
		if (!tilemapRef.current) return;
		const tilemap = tilemapRef.current;
		tilemap.clear();

		// Tile solid colors at smaller scales
		if (scale >= 0.5) {
			blocks.forEach((block) => {
				tilemap.tile(textures[`${block.name}.png`] ?? missingTexture, block.x * 16, block.y * 16);
			});
		} else {
			blocks.forEach((block) => {
				tilemap.tile(solidTextures[`${block.name}`] ?? missingTexture, block.x * 16, block.y * 16);
			});
		}
	};

	useEffect(() => {
		const tilemap = new CompositeTilemap();
		tilemapRef.current = tilemap;
		tilemap.cullable = true;
		app.stage.addChildAt(tilemap, 0);

		tileBlocks();
	}, []);

	useEffect(tileBlocks, [blocks]);

	useEffect(() => {
		if (!tilemapRef.current) return;

		tileBlocks();

		tilemapRef.current.x = coords.x;
		tilemapRef.current.y = coords.y;
		tilemapRef.current.scale.set(scale, scale);
	}, [coords, scale]);

	useEffect(() => {
		if (!image) return;

		const canvas = document.createElement("canvas");
		const ctx = canvas.getContext("2d");

		if (ctx) {
			canvas.width = imageDimensions.width;
			canvas.height = imageDimensions.height;
			ctx.drawImage(image, 0, 0, imageDimensions.width, imageDimensions.height);

			const imageData = ctx.getImageData(0, 0, imageDimensions.width, imageDimensions.height);
			const newBlocks: Block[] = [];

			for (let i = 0; i < imageData.data.length; i += 4) {
				const block = findBlockFromRgb(blockData, imageData.data[i], imageData.data[i + 1], imageData.data[i + 2], imageData.data[i + 3]);
				if (block == "air") continue;

				const x = Math.floor((i / 4) % imageData.width);
				const y = Math.floor(i / 4 / imageData.width);

				newBlocks.push({
					name: block,
					x,
					y,
				});
			}

			setBlocks(newBlocks);
			setLoading(false);
		}
	}, [image, imageDimensions]);

	return null;
}

export default Blocks;
