import { useContext, useEffect, useMemo, useState } from "react";
import { Container, Graphics, Sprite, Stage } from "@pixi/react";
import { BlocksIcon } from "lucide-react";

import { TexturesContext } from "@/context/Textures";
import { ThemeContext } from "@/context/Theme";
import { ToolContext } from "@/context/Tool";

import _blockData from "@/data/blocks/programmer-art/data.json";
const blockData: BlockData = _blockData;

interface Props {
	stageWidth: number;
	searchInput: string;
}

function SelectorBlocks({ stageWidth, searchInput }: Props) {
	const { missingTexture, textures } = useContext(TexturesContext);
	const { isDark } = useContext(ThemeContext);
	const { selectedBlock, setSelectedBlock } = useContext(ToolContext);

	const [hoverPosition, setHoverPosition] = useState<Position | null>(null);
	const [selectedBlockPosition, setSelectedBlockPosition] = useState<Position | null>({ x: 0, y: 0 });

	const blocksPerColumn = Math.floor(stageWidth / (32 + 2));
	const filteredBlocks = useMemo(() => Object.keys(blockData).filter((value) => value.includes(searchInput)), [searchInput]);

	const getBlockPosition = (index: number): Position => {
		const x = (index % blocksPerColumn) * (32 + 2) + 2;
		const y = Math.floor(index / blocksPerColumn) * (32 + 2) + 2;
		return { x, y };
	};

	useEffect(() => {
		const index = filteredBlocks.indexOf(selectedBlock);
		if (index == -1) {
			setSelectedBlockPosition(null);
			return;
		}
		const position = getBlockPosition(index);
		setSelectedBlockPosition(position);
	}, [searchInput, selectedBlock]);

	if (filteredBlocks.length == 0) {
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
			onMouseLeave={() => setHoverPosition(null)}
		>
			<Container>
				{filteredBlocks.map((block, index) => {
					const texture = textures[`${block}.png`] ?? missingTexture;
					const { x, y } = getBlockPosition(index);

					return (
						<Sprite
							texture={texture}
							x={x}
							y={y}
							scale={2}
							interactive={true}
							pointerover={() => setHoverPosition({ x, y })}
							click={() => {
								setSelectedBlock(block);
								setSelectedBlockPosition({ x, y });
							}}
						/>
					);
				})}

				{hoverPosition && (
					<Graphics
						x={hoverPosition.x}
						y={hoverPosition.y}
						draw={(g) => {
							g.clear();
							g.beginFill(0x000000, 0.5);
							g.lineStyle(2, isDark ? 0xffffff : 0x000000, 1, 1);
							g.drawRect(0, 0, 32, 32);
						}}
					/>
				)}

				{selectedBlockPosition && (
					<Graphics
						x={selectedBlockPosition.x}
						y={selectedBlockPosition.y}
						draw={(g) => {
							g.clear();
							g.lineStyle(2, isDark ? 0xffffff : 0x000000, 1, 1);
							g.drawRect(0, 0, 32, 32);
						}}
					/>
				)}
			</Container>
		</Stage>
	);
}

export default SelectorBlocks;
