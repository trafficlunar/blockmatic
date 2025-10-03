import React, { useContext, useMemo, useState } from "react";

import { CanvasContext } from "@/context/Canvas";
import { ThemeContext } from "@/context/Theme";
import { TexturesContext } from "@/context/Textures";

import { useBlockData } from "@/hooks/useBlockData";
import { useTextures } from "@/hooks/useTextures";
import { Application } from "@pixi/react";

interface Props {
	stageWidth: number;
	searchInput: string;
	selectedBlocks: string[];
	setSelectedBlocks: React.Dispatch<React.SetStateAction<string[]>>;
	userModifiedBlocks: React.RefObject<boolean>;
}

function BlockSelector({ stageWidth, searchInput, selectedBlocks, setSelectedBlocks, userModifiedBlocks }: Props) {
	const { version } = useContext(CanvasContext);
	const { missingTexture } = useContext(TexturesContext);
	const { isDark } = useContext(ThemeContext);

	const blockData = useBlockData(version);
	const textures = useTextures(version);

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
		<div onPointerLeave={() => setHoverPosition(null)}>
			<Application width={stageWidth} height={Math.ceil(Object.keys(blockData).length / blocksPerColumn) * (32 + 2)} backgroundAlpha={0}>
				<pixiContainer>
					{filteredBlocks.map((block, index) => {
						const x = (index % blocksPerColumn) * (32 + 2) + 2;
						const y = Math.floor(index / blocksPerColumn) * (32 + 2) + 2;

						return (
							<>
								<pixiSprite
									key={block}
									texture={textures[block] ?? missingTexture}
									x={x}
									y={y}
									scale={2}
									eventMode={"static"}
									onPointerOver={() => setHoverPosition({ x, y })}
									onClick={() => onClick(block)}
									alpha={selectedBlocks.includes(block) ? 1 : 0.2}
								/>

								{selectedBlocks.includes(block) && (
									<pixiGraphics
										key={index}
										x={x}
										y={y}
										draw={(g) => {
											g.clear();
											g.rect(0, 0, 32, 32);
											g.stroke({ width: 2, color: isDark ? 0xffffff : 0x000000, alpha: 0.4, alignment: 0 });
										}}
									/>
								)}
							</>
						);
					})}

					{hoverPosition && (
						<pixiGraphics
							x={hoverPosition.x}
							y={hoverPosition.y}
							draw={(g) => {
								g.clear();
								g.rect(0, 0, 32, 32);
								g.stroke({ width: 4, color: isDark ? 0xffffff : 0x000000, alignment: 1 });
							}}
						/>
					)}
				</pixiContainer>
			</Application>
		</div>
	);
}

export default BlockSelector;
