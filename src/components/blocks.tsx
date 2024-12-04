import { useEffect, useState } from "react";
import { Image as KonvaImage } from "react-konva";

import blocksData from "@/lib/blocks/programmer-art/average_colors.json";

function Blocks() {
	const [blocks, setBlocks] = useState<Block[]>([]);
	const [images, setImages] = useState<{ [key: string]: HTMLImageElement }>({});

	useEffect(() => {
		const loadedImages: { [key: string]: HTMLImageElement } = {};

		for (const name of Object.keys(blocksData)) {
			const image = new Image();
			image.src = `/blocks/programmer-art/${name}.png`;
			loadedImages[name] = image;
		}

		setImages(loadedImages);
		setBlocks([
			{ name: "stone", x: 0, y: 0 },
			{ name: "birch_log", x: 1, y: 1 },
			{ name: "redstone_lamp", x: 2, y: 0 },
			{ name: "dirt", x: 3, y: 1 }
		]);
	}, []);

	return (
		<>
			{blocks.map((block, index) => (
				<KonvaImage key={index} image={images[block.name]} x={block.x * 16} y={block.y * 16} />
			))}
		</>
	);
}

export default Blocks;
