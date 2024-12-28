import React, { useContext, useMemo, useState } from "react";
import { Container, Graphics, Sprite, Stage } from "@pixi/react";

import { CanvasContext } from "@/context/Canvas";
import { TexturesContext } from "@/context/Textures";
import { ThemeContext } from "@/context/Theme";

import { getBlockData } from "@/utils/getBlockData";

interface Props {
	stageWidth: number;
	searchInput: string;
	selectedBlocks: string[];
	setSelectedBlocks: React.Dispatch<React.SetStateAction<string[]>>;
	userModifiedBlocks: React.MutableRefObject<boolean>;
}

function BlockSelector({ stageWidth, searchInput, selectedBlocks, setSelectedBlocks, userModifiedBlocks }: Props) {
	const { version } = useContext(CanvasContext);
	const { missingTexture, textures } = useContext(TexturesContext);
	const { isDark } = useContext(ThemeContext);

	const blockData = getBlockData(version);

	const [hoverPosition, setHoverPosition] = useState<Position | null>(null);

	const filteredBlocks = useMemo(() => Object.keys(blockData).filter((value) => value.includes(searchInput)), [searchInput, blockData]);
	const blocksPerColumn = Math.floor(stageWidth / (32 + 2));

	const onClick = (block: string) => {
		userModifiedBlocks.current = true;

		if (selectedBlocks.includes(block)) {
			setSelectedBlocks((prev) => prev.filter((blockName) => blockName !== block));
		} else {
			setSelectedBlocks((prev) => [...prev, block]);
		}
	};

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
					const x = (index % blocksPerColumn) * (32 + 2) + 2;
					const y = Math.floor(index / blocksPerColumn) * (32 + 2) + 2;

					return (
						<>
							<Sprite
								key={block}
								texture={texture}
								x={x}
								y={y}
								scale={2}
								interactive={true}
								pointerover={() => setHoverPosition({ x, y })}
								click={() => onClick(block)}
							/>

							{selectedBlocks.includes(block) && (
								<Graphics
									x={x}
									y={y}
									draw={(g) => {
										g.clear();
										g.beginFill(0x000000, 0.5);
										g.lineStyle(2, isDark ? 0xffffff : 0x000000, 1, 1);
										g.drawRect(0, 0, 32, 32);
									}}
								/>
							)}
						</>
					);
				})}

				{hoverPosition && (
					<Graphics
						x={hoverPosition.x}
						y={hoverPosition.y}
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

export default BlockSelector;
