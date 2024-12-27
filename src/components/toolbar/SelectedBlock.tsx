import { useContext, useEffect, useRef, useState } from "react";
import { Container, Sprite, Stage } from "@pixi/react";
import * as PIXI from "pixi.js";

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

import { TexturesContext } from "@/context/Textures";
import { ToolContext } from "@/context/Tool";

import _blockData from "@/data/blocks/data.json";
const blockData: BlockData = _blockData;

function SelectedBlock() {
	const { missingTexture, textures } = useContext(TexturesContext);
	const { selectedBlock } = useContext(ToolContext);

	const divRef = useRef<HTMLDivElement>(null);

	const [selectedBlockName, setSelectedBlockName] = useState("Stone");
	const [selectedBlockTexture, setSelectedBlockTexture] = useState<PIXI.Texture>();

	useEffect(() => {
		const blockInfo = blockData[selectedBlock];
		setSelectedBlockName(blockInfo.name);
		setSelectedBlockTexture(textures[`${selectedBlock}.png`] ?? missingTexture);
	}, [textures, selectedBlock, missingTexture]);

	return (
		<TooltipProvider>
			<Tooltip delayDuration={0}>
				<TooltipTrigger asChild>
					<div ref={divRef} className="absolute bottom-1 w-8 h-8 outline outline-1 outline-zinc-800 dark:outline-zinc-200">
						<Stage width={divRef.current?.clientWidth} height={divRef.current?.clientHeight}>
							<Container>
								<Sprite texture={selectedBlockTexture} scale={2} />
							</Container>
						</Stage>
					</div>
				</TooltipTrigger>
				<TooltipContent side="right" sideOffset={10}>
					<p>{selectedBlockName}</p>
				</TooltipContent>
			</Tooltip>
		</TooltipProvider>
	);
}

export default SelectedBlock;
