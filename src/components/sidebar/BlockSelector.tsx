import { useContext, useEffect, useMemo, useState } from "react";
import { BlocksIcon } from "lucide-react";

import { Application } from "@pixi/react";
import * as PIXI from "pixi.js";

import { LoadingContext } from "@/context/Loading";
import { CanvasContext } from "@/context/Canvas";
import { ThemeContext } from "@/context/Theme";
import { ToolContext } from "@/context/Tool";

import { useBlockData } from "@/hooks/useBlockData";
import { useTextures } from "@/hooks/useTextures";

interface Props {
	stageWidth: number;
	searchInput: string;
}

function BlockSelector({ stageWidth, searchInput }: Props) {
	const { loading } = useContext(LoadingContext);
	const { version } = useContext(CanvasContext);
	const { isDark } = useContext(ThemeContext);
	const { selectedBlock, setSelectedBlock } = useContext(ToolContext);

	const [app, setApp] = useState<PIXI.Application>();

	const [hoverPosition, setHoverPosition] = useState<Position | null>(null);
	const [selectedBlockPosition, setSelectedBlockPosition] = useState<Position | null>({ x: 0, y: 0 });

	const blocksPerColumn = Math.floor(stageWidth / (32 + 2));

	const blockData = useBlockData(version);
	const filteredBlocks = useMemo(() => Object.keys(blockData).filter((value) => value.includes(searchInput)), [searchInput, blockData]);
	const textures = useTextures(version, filteredBlocks);

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

	useEffect(() => {
		if (!app?.renderer?.view?.canvas.style) return;

		// Can't set it in props for some reason
		app.renderer.view.canvas.style.touchAction = "auto";
	}, [app]);

	if (loading) return null;

	if (filteredBlocks.length == 0) {
		return (
			<div className="size-full flex flex-col justify-center items-center gap-1 text-zinc-400">
				<BlocksIcon size={40} />
				<span>No blocks found</span>
			</div>
		);
	}

	return (
		<div onMouseLeave={() => setHoverPosition(null)} className="h-min">
			<Application
				width={stageWidth}
				height={Math.ceil(Object.keys(blockData).length / blocksPerColumn) * (32 + 2) + 8}
				backgroundAlpha={0}
				onInit={setApp}
			>
				<pixiContainer>
					{filteredBlocks.map((block, index) => {
						const texture = textures[block];
						const { x, y } = getBlockPosition(index);

						const onClick = () => {
							setSelectedBlock(block);
							setSelectedBlockPosition({ x, y });
						};

						return (
							<pixiSprite
								key={block}
								texture={texture}
								x={x}
								y={y}
								scale={2}
								eventMode={"static"}
								onMouseOver={() => setHoverPosition({ x, y })}
								onClick={onClick}
								onTap={onClick}
								alpha={selectedBlock == block ? 1 : 0.3}
							/>
						);
					})}

					{hoverPosition && (
						<pixiGraphics
							x={hoverPosition.x}
							y={hoverPosition.y}
							draw={(g) => {
								g.clear();
								g.rect(0, 0, 32, 32);
								g.stroke({ width: 2, color: isDark ? 0xffffff : 0x000000, alignment: 1 });
							}}
						/>
					)}

					{selectedBlockPosition && (
						<pixiGraphics
							x={selectedBlockPosition.x}
							y={selectedBlockPosition.y}
							draw={(g) => {
								g.clear();
								g.rect(0, 0, 32, 32);
								g.stroke({ width: 2, color: isDark ? 0xffffff : 0x000000, alpha: 0.75, alignment: 0 });
							}}
						/>
					)}
				</pixiContainer>
			</Application>
		</div>
	);
}

export default BlockSelector;
