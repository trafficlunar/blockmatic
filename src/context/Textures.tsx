import { createContext, ReactNode, useContext, useEffect, useRef } from "react";
import * as PIXI from "pixi.js";

import { LoadingContext } from "./Loading";

import spritesheet from "@/data/blocks/spritesheet.json";
import programmerArtSpritesheet from "@/data/blocks/programmer-art/spritesheet.json";

import _blockData from "@/data/blocks/data.json";
const blockData: BlockData = _blockData;

interface Context {
	missingTexture: PIXI.Texture;
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

	// Load missing texture through data string just incase of network errors
	const missingTextureRef = useRef<PIXI.Texture>(
		new PIXI.Texture(
			new PIXI.BaseTexture(
				"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAIAAACQkWg2AAAAGUlEQVR42mPABX4w/MCKaKJhVMPgcOuoBgDZRfgBVl5QdQAAAABJRU5ErkJggg=="
			)
		)
	);
	const texturesRef = useRef<Record<string, PIXI.Texture>>({});
	const programmerArtTexturesRef = useRef<Record<string, PIXI.Texture>>({});
	const solidTexturesRef = useRef<Record<string, PIXI.Texture>>({});

	// Load textures
	useEffect(() => {
		// Add air texture
		const airBaseTexture = new PIXI.BaseTexture("/blocks/air.png");
		const airTexture = new PIXI.Texture(airBaseTexture);

		const sheet = new PIXI.Spritesheet(PIXI.BaseTexture.from("/blocks/spritesheet.png"), spritesheet);
		sheet.parse().then((t) => {
			texturesRef.current = { ...t, "air.png": airTexture };
		});

		const programmerArtSheet = new PIXI.Spritesheet(PIXI.BaseTexture.from("/blocks/programmer-art/spritesheet.png"), programmerArtSpritesheet);
		programmerArtSheet.parse().then((t) => {
			programmerArtTexturesRef.current = { ...t, "air.png": airTexture };
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

		solidTexturesRef.current = solidTexturesCollection;
		setLoading(false);
	}, []);

	return (
		<TexturesContext.Provider
			value={{
				missingTexture: missingTextureRef.current,
				textures: texturesRef.current,
				programmerArtTextures: programmerArtTexturesRef.current,
				solidTextures: solidTexturesRef.current,
			}}
		>
			{children}
		</TexturesContext.Provider>
	);
};
