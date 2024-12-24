import { useContext, useEffect, useState } from "react";

import constants from "@/constants";

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

import { TexturesContext } from "@/context/Textures";
import { ToolContext } from "@/context/Tool";

import _blockData from "@/data/blocks/programmer-art/data.json";
const blockData: BlockData = _blockData;

function SelectedBlock() {
	const { textures } = useContext(TexturesContext);
	const { selectedBlock } = useContext(ToolContext);

	const [selectedBlockName, setSelectedBlockName] = useState("Stone");
	const [selectedBlockTexture, setSelectedBlockTexture] = useState(constants.MISSING_TEXTURE);

	useEffect(() => {
		const blockInfo = blockData[selectedBlock];
		setSelectedBlockName(blockInfo.name);

		const texture = textures[`${selectedBlock}.png`];
		if (!texture) {
			setSelectedBlockTexture(constants.MISSING_TEXTURE);
			return;
		}

		const canvas = document.createElement("canvas");
		const ctx = canvas.getContext("2d");
		canvas.width = 16;
		canvas.height = 16;

		if (!ctx) {
			setSelectedBlockTexture(constants.MISSING_TEXTURE);
			return;
		}

		const image = new Image();
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		image.src = (texture.baseTexture.resource as any).url;
		image.onload = () => {
			ctx.drawImage(
				image,
				texture.frame.x,
				texture.frame.y,
				texture.frame.width,
				texture.frame.height,
				0,
				0,
				texture.frame.width,
				texture.frame.height
			);

			setSelectedBlockTexture(canvas.toDataURL());
		};

		image.onerror = () => {
			setSelectedBlockTexture(constants.MISSING_TEXTURE);
		};
	}, [textures, selectedBlock]);

	return (
		<TooltipProvider>
			<Tooltip delayDuration={0}>
				<TooltipTrigger asChild>
					<img
						src={selectedBlockTexture}
						className="absolute bottom-1 w-8 h-8 cursor-pointer border border-zinc-800 dark:border-zinc-200 rounded"
						style={{ imageRendering: "pixelated" }}
					/>
				</TooltipTrigger>
				<TooltipContent side="right" sideOffset={10}>
					<p>{selectedBlockName}</p>
				</TooltipContent>
			</Tooltip>
		</TooltipProvider>
	);
}

export default SelectedBlock;
