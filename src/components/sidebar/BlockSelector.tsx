import { useContext, useEffect, useMemo, useState } from "react";
import { Container, Graphics, Sprite, Stage } from "@pixi/react";
import { BlocksIcon } from "lucide-react";

import { CanvasContext } from "@/context/Canvas";
import { ThemeContext } from "@/context/Theme";
import { ToolContext } from "@/context/Tool";

import { useBlockData } from "@/hooks/useBlockData";
import { useTextures } from "@/hooks/useTextures";
import { AlphaFilter, Application } from "pixi.js";

interface Props {
	stageWidth: number;
	searchInput: string;
}

function BlockSelector({ stageWidth, searchInput }: Props) {
	const { version } = useContext(CanvasContext);
	const { isDark } = useContext(ThemeContext);
	const { selectedBlock, setSelectedBlock } = useContext(ToolContext);

	const [app, setApp] = useState<Application>();

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
		if (!app?.renderer?.view?.style) return;

		// Can't set it in props for some reason
		app.renderer.view.style.touchAction = "auto";
	}, [app]);

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
			height={Math.ceil(Object.keys(blockData).length / blocksPerColumn) * (32 + 2) + 8}
			options={{ backgroundAlpha: 0 }}
			onMouseLeave={() => setHoverPosition(null)}
			onMount={setApp}
		>
			<Container>
				{filteredBlocks.map((block, index) => {
					const texture = textures[block];
					const { x, y } = getBlockPosition(index);

					const onClick = () => {
						setSelectedBlock(block);
						setSelectedBlockPosition({ x, y });
					};

					return (
						<Sprite
							key={block}
							texture={texture}
							x={x}
							y={y}
							scale={2}
							eventMode={"static"}
							mouseover={() => setHoverPosition({ x, y })}
							click={onClick}
							tap={onClick}
							filters={selectedBlock == block ? [] : [new AlphaFilter(0.3)]}
						/>
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

				{selectedBlockPosition && (
					<Graphics
						x={selectedBlockPosition.x}
						y={selectedBlockPosition.y}
						draw={(g) => {
							g.clear();
							g.lineStyle(2, isDark ? 0xffffff : 0x000000, 0.75, 0);
							g.drawRect(0, 0, 32, 32);
						}}
					/>
				)}
			</Container>
		</Stage>
	);
}

export default BlockSelector;
