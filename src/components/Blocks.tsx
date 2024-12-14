import { useEffect } from "react";
import { Sprite } from "@pixi/react";

import blocksData from "@/data/blocks/programmer-art/average_colors.json";
import welcomeBlocksData from "@/data/welcome.json";
import { Texture } from "pixi.js";

interface Props {
	blocks: Block[];
	setBlocks: React.Dispatch<React.SetStateAction<Block[]>>;
	textures: Record<string, Texture>;
}

function Blocks({ blocks, setBlocks, textures }: Props) {
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
		// TESTING: convert image to blocks
		const image = new Image();
		image.src = "/bliss.png";
		image.addEventListener("load", () => {
			const canvas = document.createElement("canvas");
			const ctx = canvas.getContext("2d");

			if (ctx) {
				canvas.width = image.width;
				canvas.height = image.height;
				ctx.drawImage(image, 0, 0, image.width / 4, image.height / 4);

				const imageData = ctx.getImageData(0, 0, image.width / 4, image.height / 4);
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
		});

		setBlocks(welcomeBlocksData);
	}, [textures]);

	return (
		<>
			{blocks.map((block, index) => {
				const texture = textures[block.name];
				if (!texture) {
					console.warn(`Texture not found for block: ${block.name}`);
					return null;
				}

				return <Sprite key={index} texture={texture} x={block.x * 16} y={block.y * 16} />;
			})}
		</>
	);
}

export default Blocks;
