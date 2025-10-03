import { createContext, ReactNode, useContext, useEffect, useRef } from "react";
import { Assets, Spritesheet, Texture } from "pixi.js";

import { LoadingContext } from "./Loading";

import spritesheet from "@/data/blocks/spritesheet.json";
import programmerArtSpritesheet from "@/data/blocks/programmer-art/spritesheet.json";

interface Context {
	missingTexture: Texture;
	textures: Record<string, Texture>;
	programmerArtTextures: Record<string, Texture>;
}

interface Props {
	children: ReactNode;
}

// eslint-disable-next-line react-refresh/only-export-components
export const TexturesContext = createContext<Context>({} as Context);

export const TexturesProvider = ({ children }: Props) => {
	const { setLoading } = useContext(LoadingContext);

	// Load missing texture through data string just in case of network errors
	const missingTextureRef = useRef<Texture>(Texture.EMPTY);
	const texturesRef = useRef<Record<string, Texture>>({});
	const programmerArtTexturesRef = useRef<Record<string, Texture>>({});

	// Load textures
	useEffect(() => {
		const loadTextures = async () => {
			try {
				// Load base textures
				missingTextureRef.current = await Assets.load(
					"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAIAAACQkWg2AAAAGUlEQVR42mPABX4w/MCKaKJhVMPgcOuoBgDZRfgBVl5QdQAAAABJRU5ErkJggg=="
				);
				const airBaseTexture = await Assets.load("/blocks/air.png");
				const sheetTexture = await Assets.load("/blocks/spritesheet.png");
				const programmerArtSheetTexture = await Assets.load("/blocks/programmer-art/spritesheet.png");

				// Create and parse main spritesheet
				const sheet = new Spritesheet(sheetTexture, spritesheet);
				await sheet.parse();
				texturesRef.current = { ...sheet.textures, "air.png": airBaseTexture };

				// Create and parse programmer art spritesheet
				const programmerArtSheet = new Spritesheet(programmerArtSheetTexture, programmerArtSpritesheet);
				await programmerArtSheet.parse();
				programmerArtTexturesRef.current = { ...programmerArtSheet.textures, "air.png": airBaseTexture };

				setLoading(false);
			} catch (error) {
				console.error("Failed to load textures:", error);
				setLoading(false);
			}
		};

		loadTextures();
	}, [setLoading]);

	return (
		<TexturesContext.Provider
			value={{
				missingTexture: missingTextureRef.current,
				textures: texturesRef.current,
				programmerArtTextures: programmerArtTexturesRef.current,
			}}
		>
			{children}
		</TexturesContext.Provider>
	);
};
