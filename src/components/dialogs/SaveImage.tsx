import { useContext, useState } from "react";
import * as PIXI from "pixi.js";

import { CanvasContext } from "@/context/Canvas";
import { TexturesContext } from "@/context/Textures";

import { Button } from "@/components/ui/button";
import { DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

import { useTextures } from "@/hooks/useTextures";

function SaveImage({ close }: DialogProps) {
	const { blocks, canvasSize, version } = useContext(CanvasContext);
	const { missingTexture } = useContext(TexturesContext);

	const [fileName, setFileName] = useState("blockmatic");
	const textures = useTextures(version);

	const onSubmit = () => {
		const width = canvasSize.maxX - canvasSize.minX;
		const height = canvasSize.maxY - canvasSize.minY;

		const renderer = new PIXI.Renderer({
			width: 16 * width,
			height: 16 * height,
			backgroundAlpha: 1,
		});

		const container = new PIXI.Container();
		blocks.forEach((block) => {
			const sprite = new PIXI.Sprite(textures[block.name] ?? missingTexture);
			sprite.x = block.x * 16;
			sprite.y = block.y * 16;
			container.addChild(sprite);
		});

		const renderTexture = PIXI.RenderTexture.create({
			width: 16 * width,
			height: 16 * height,
		});

		renderer.render(container, { renderTexture });

		const canvas = renderer.extract.canvas(renderTexture);
		canvas.toBlob!((blob) => {
			if (!blob) return;

			const link = document.createElement("a");
			link.href = URL.createObjectURL(blob);
			link.download = `${fileName}.png`;
			link.click();

			URL.revokeObjectURL(link.href);
		});

		renderer.destroy();

		close();
	};

	return (
		<DialogContent>
			<DialogHeader>
				<DialogTitle>Save as image (.png)</DialogTitle>
				<DialogDescription>Save your canvas as a full size image</DialogDescription>
			</DialogHeader>

			<div className="flex items-center gap-2">
				<Input value={fileName} onChange={(e) => setFileName(e.target.value)} />
				<span>.png</span>
			</div>

			<DialogFooter>
				<Button variant="outline" onClick={close}>
					Cancel
				</Button>
				<Button type="submit" onClick={onSubmit}>
					Download
				</Button>
			</DialogFooter>
		</DialogContent>
	);
}

export default SaveImage;
