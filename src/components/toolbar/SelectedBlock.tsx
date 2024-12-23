import { useContext } from "react";

import constants from "@/constants";

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

import { TexturesContext } from "@/context/Textures";
import { ToolContext } from "@/context/Tool";

function SelectedBlock() {
	const textures = useContext(TexturesContext);
	const { selectedBlock } = useContext(ToolContext);

	const convertToDataUrl = (textureName: string): string => {
		// Show missing texture if fail
		const texture = textures[textureName];
		if (!texture) return constants.MISSING_TEXTURE;

		const canvas = document.createElement("canvas");
		const context = canvas.getContext("2d");

		canvas.width = texture.frame.width;
		canvas.height = texture.frame.height;

		if (!context) return "";

		const image = new Image();
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		image.src = (texture.baseTexture.resource as any).url;

		context.drawImage(
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

		return canvas.toDataURL();
	};

	return (
		<TooltipProvider>
			<Tooltip delayDuration={0}>
				<TooltipTrigger asChild>
					<img
						src={convertToDataUrl("stone")}
						className="absolute bottom-1 w-8 h-8 cursor-pointer border border-zinc-800 dark:border-zinc-200 rounded"
						style={{ imageRendering: "pixelated" }}
					/>
				</TooltipTrigger>
				<TooltipContent side="right" sideOffset={10}>
					<p>{selectedBlock}</p>
				</TooltipContent>
			</Tooltip>
		</TooltipProvider>
	);
}

export default SelectedBlock;
