import React, { useContext, useMemo, useRef, useState } from "react";
import { Container, Graphics, Sprite, Stage } from "@pixi/react";
import { AlphaFilter } from "pixi.js";

import { CanvasContext } from "@/context/Canvas";
import { ThemeContext } from "@/context/Theme";
import { TexturesContext } from "@/context/Textures";

import { useBlockData } from "@/hooks/useBlockData";
import { useTextures } from "@/hooks/useTextures";

interface Props {
	stageWidth: number;
	searchInput: string;
	selectedBlocks: string[];
	setSelectedBlocks: React.Dispatch<React.SetStateAction<string[]>>;
	userModifiedBlocks: React.MutableRefObject<boolean>;
}

function BlockSelector({ stageWidth, searchInput, selectedBlocks, setSelectedBlocks, userModifiedBlocks }: Props) {
	const { version } = useContext(CanvasContext);
	const { missingTexture } = useContext(TexturesContext);
	const { isDark } = useContext(ThemeContext);

	const blockData = useBlockData(version);
	const textures = useTextures(version);

	const [hoverPosition, setHoverPosition] = useState<Position | null>(null);
	const showStage = useRef(true);

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

	// Fixes issue #1 - entire app crashing when closing dialog with Stage mounted
	if (!showStage.current) return null;

	return (
		<Stage
			width={stageWidth}
			height={Math.ceil(Object.keys(blockData).length / blocksPerColumn) * (32 + 2)}
			options={{ backgroundAlpha: 0 }}
			onPointerLeave={() => setHoverPosition(null)}
			onUnmount={() => {
				// NOTE: this event gets called a couple times when run in development
				showStage.current = false;
			}}
		>
			<Container>
				{filteredBlocks.map((block, index) => {
					const x = (index % blocksPerColumn) * (32 + 2) + 2;
					const y = Math.floor(index / blocksPerColumn) * (32 + 2) + 2;

					return (
						<>
							<Sprite
								key={block}
								texture={textures[block] ?? missingTexture}
								x={x}
								y={y}
								scale={2}
								eventMode={"static"}
								pointerover={() => setHoverPosition({ x, y })}
								click={() => onClick(block)}
								filters={selectedBlocks.includes(block) ? [] : [new AlphaFilter(0.2)]}
							/>

							{selectedBlocks.includes(block) && (
								<Graphics
									key={index}
									x={x}
									y={y}
									draw={(g) => {
										g.clear();
										g.beginFill(0xffffff, 0.2);
										g.lineStyle(2, isDark ? 0xffffff : 0x000000, 0.4, 0);
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
							g.lineStyle(4, isDark ? 0xffffff : 0x000000, 1, 1);
							g.drawRect(0, 0, 32, 32);
						}}
					/>
				)}
			</Container>
		</Stage>
	);
}

export default BlockSelector;
