import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import * as PIXI from "pixi.js";

import { LoadingContext } from "./Loading";

import spritesheet from "@/data/blocks/spritesheet.json";
import programmerArtSpritesheet from "@/data/blocks/programmer-art/spritesheet.json";

import _blockData from "@/data/blocks/data.json";
const blockData: BlockData = _blockData;

interface Context {
	missingTexture: PIXI.Texture | undefined;
	textures: Record<string, PIXI.Texture>;
	programmerArtTextures: Record<string, PIXI.Texture>;
	solidTextures: Record<string, PIXI.Texture>;
}

interface Props {
	children: ReactNode;
}

export const TexturesContext = createContext<Context>({} as Context);

export const TexturesProvider = ({ children }: Props) => {
	const { setLoading } = useContext(LoadingContext);

	const [missingTexture, setMissingTexture] = useState<PIXI.Texture>();
	const [textures, setTextures] = useState<Record<string, PIXI.Texture>>({});
	const [programmerArtTextures, setProgrammerArtTextures] = useState<Record<string, PIXI.Texture>>({});
	const [solidTextures, setSolidTextures] = useState<Record<string, PIXI.Texture>>({});

	useEffect(() => {
		// Load missing texture through data string just incase of network errors
		const missingBaseTexture = new PIXI.BaseTexture(
			"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAIAAACQkWg2AAAAGUlEQVR42mPABX4w/MCKaKJhVMPgcOuoBgDZRfgBVl5QdQAAAABJRU5ErkJggg=="
		);
		setMissingTexture(new PIXI.Texture(missingBaseTexture));

		// Load textures
		// Add air texture
		const airBaseTexture = new PIXI.BaseTexture("/blocks/air.png");
		const airTexture = new PIXI.Texture(airBaseTexture);

		const sheet = new PIXI.Spritesheet(PIXI.BaseTexture.from("/blocks/spritesheet.png"), spritesheet);
		sheet.parse().then((t) => {
			setTextures({ ...t, "air.png": airTexture });
		});

		const programmerArtSheet = new PIXI.Spritesheet(PIXI.BaseTexture.from("/blocks/programmer-art/spritesheet.png"), programmerArtSpritesheet);
		programmerArtSheet.parse().then((t) => {
			setProgrammerArtTextures({ ...t, "air.png": airTexture });
		});

		// Load solid textures
		const solidTexturesCollection: Record<string, PIXI.Texture> = {};

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
			solidTexturesCollection[blockName] = texture;
		});

		setSolidTextures(solidTexturesCollection);
		setLoading(false);
	}, []);

	return <TexturesContext.Provider value={{ missingTexture, textures, programmerArtTextures, solidTextures }}>{children}</TexturesContext.Provider>;
};
