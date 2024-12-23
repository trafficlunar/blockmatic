import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import * as PIXI from "pixi.js";

import { LoadingContext } from "./Loading";

import spritesheet from "@/data/blocks/programmer-art/spritesheet.json";
import _blockData from "@/data/blocks/programmer-art/data.json";
const blockData: BlockData = _blockData;

interface Props {
	children: ReactNode;
}

export const TexturesContext = createContext({
	textures: {} as Record<string, PIXI.Texture>,
	solidTextures: {} as Record<string, PIXI.Texture>,
});

export const TexturesProvider = ({ children }: Props) => {
	const { setLoading } = useContext(LoadingContext);

	const [textures, setTextures] = useState<Record<string, PIXI.Texture>>({});
	const [solidTextures, setSolidTextures] = useState<Record<string, PIXI.Texture>>({});

	useEffect(() => {
		const sheet = new PIXI.Spritesheet(PIXI.BaseTexture.from("/blocks/programmer-art/spritesheet.png"), spritesheet);
		sheet.parse().then((t) => {
			setTextures(t);
		});

		// Load solid textures
		const solidT: Record<string, PIXI.Texture> = {};

		const canvas = document.createElement("canvas");
		canvas.width = 16;
		canvas.height = 16;

		const ctx = canvas.getContext("2d");
		if (!ctx) return;

		Object.entries(blockData).forEach(([blockName, data]) => {
			ctx.fillStyle = `rgb(${data.color[0]}, ${data.color[1]}, ${data.color[2]}, ${data.color[3]})`;
			ctx.fillRect(0, 0, canvas.width, canvas.height);

			const image = new Image();
			image.src = canvas.toDataURL();

			const baseTexture = new PIXI.BaseTexture(image);
			const texture = new PIXI.Texture(baseTexture);
			solidT[blockName] = texture;
		});

		setSolidTextures(solidT);
		setLoading(false);
	}, []);

	return <TexturesContext.Provider value={{ textures, solidTextures }}>{children}</TexturesContext.Provider>;
};
