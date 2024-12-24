import { useContext, useMemo } from "react";
import { Container, Graphics, Sprite, Stage } from "@pixi/react";
import * as PIXI from "pixi.js";

import { BlocksIcon } from "lucide-react";

import constants from "@/constants";
import { TexturesContext } from "@/context/Textures";

import _blockData from "@/data/blocks/programmer-art/data.json";
const blockData: BlockData = _blockData;

interface Props {
	stageWidth: number;
	searchInput: string;
}

function SelectorBlocks({ stageWidth, searchInput }: Props) {
	const { textures } = useContext(TexturesContext);

	const blocksPerColumn = Math.floor(stageWidth / (32 + 1));
	const blocks = useMemo(() => Object.keys(blockData).filter((value) => value.includes(searchInput)), [searchInput]);

	const textureCache = useMemo(() => {
		return (blockName: string) => {
			let texture = textures[`${blockName}.png`];
			if (!texture) {
				const baseTexture = new PIXI.BaseTexture(constants.MISSING_TEXTURE);
				texture = new PIXI.Texture(baseTexture);
			}

			return texture;
		};
	}, [textures]);

	const onMouseMove = (e: React.MouseEvent) => {
		console.log(e.clientX, e.clientY);
	};

	if (blocks.length == 0) {
		return (
			<div className="w-full h-full flex flex-col justify-center items-center gap-1 text-zinc-400">
				<BlocksIcon size={40} />
				<span>No blocks found</span>
			</div>
		);
	}

	return (
		<Stage
			width={stageWidth}
			height={Math.ceil(Object.keys(blockData).length / blocksPerColumn) * (32 + 2)}
			options={{ backgroundAlpha: 0 }}
			onMouseMove={onMouseMove}
		>
			<Container>
				{blocks.map((block, index) => {
					const texture = textureCache(block);
					const x = (index % blocksPerColumn) * (32 + 2);
					const y = Math.floor(index / blocksPerColumn) * (32 + 2);

					return <Sprite texture={texture} x={x} y={y} scale={2} />;
				})}

				<Graphics
					draw={(g) => {
						g.clear();
						g.lineStyle(1, 0xffffff, 1);
						g.drawRect(0, 0, 16, 16);
					}}
				/>
			</Container>
		</Stage>
	);
}

export default SelectorBlocks;
