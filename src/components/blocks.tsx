import { useState } from "react";
import { Image } from "react-konva";
import useImage from "use-image";

function Blocks() {
	const [image] = useImage("/blocks/programmer-art/stone.png");

	const [blocks, setBlocks] = useState<Block[]>([
		{
			name: "stone",
			x: 0,
			y: 0
		},
    {
			name: "stone",
			x: 1,
			y: 1
		},
	]);

	return (
		<>
			{blocks.map((block, index) => (
				<Image key={index} image={image} x={block.x * 16} y={block.y * 16} />
			))}
		</>
	);
}

export default Blocks;
