import { useEffect, useRef, useState } from "react";

import * as PIXI from "pixi.js";
import { useApp } from "@pixi/react";
import { CompositeTilemap, settings } from "@pixi/tilemap";

import blocksData from "@/data/blocks/programmer-art/average_colors.json";

interface Props {
	blocks: Block[];
	setBlocks: React.Dispatch<React.SetStateAction<Block[]>>;
	textures: Record<string, PIXI.Texture>;
	image: HTMLImageElement | undefined;
	imageDimensions: Dimension;
	coords: Position;
	scale: number;
}

// Lifts 16,000 tiles limit
settings.use32bitIndex = true;

function Blocks({ blocks, setBlocks, textures, image, imageDimensions, coords, scale }: Props) {
	const app = useApp();
	const [missingTexture, setMissingTexture] = useState<PIXI.Texture>();

	const tilemapRef = useRef<CompositeTilemap>();

	const tileBlocks = () => {
		if (!tilemapRef.current) return;
		const tilemap = tilemapRef.current;
		tilemap.clear();

		blocks.forEach((block) => {
			tilemap.tile(textures[block.name] ?? missingTexture, block.x * 16, block.y * 16);
		});
	};

	useEffect(() => {
		// Load the missing texture
		const loadMissingTexture = async () => {
			const mTexture = await PIXI.Texture.from("/blocks/missing.png");
			setMissingTexture(mTexture);
		};
		loadMissingTexture();

		// Create tilemap
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

	const findClosestBlock = (r: number, g: number, b: number, a: number) => {
		let closestBlock = "";
		let closestDistance = Infinity;

		Object.entries(blocksData).forEach(([block, rgba]) => {
			const distance = Math.sqrt(Math.pow(r - rgba[0], 2) + Math.pow(g - rgba[1], 2) + Math.pow(b - rgba[2], 2) + Math.pow(a - rgba[3], 3));
			if (distance < closestDistance) {
				closestDistance = distance;
				closestBlock = block;
			}
		});

		return closestBlock;
	};

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
				const block = findClosestBlock(imageData.data[i], imageData.data[i + 1], imageData.data[i + 2], imageData.data[i + 3]);

				const x = Math.floor((i / 4) % imageData.width);
				const y = Math.floor(i / 4 / imageData.width);

				newBlocks.push({
					name: block,
					x,
					y,
				});
			}

			setBlocks(newBlocks);
		}
	}, [image, imageDimensions]);

	return null;
}

export default Blocks;
