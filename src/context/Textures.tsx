import { createContext, ReactNode, useEffect, useState } from "react";
import { BaseTexture, Spritesheet, Texture } from "pixi.js";

import spritesheet from "@/data/blocks/programmer-art/spritesheet.json";

interface Props {
	children: ReactNode;
}

export const TexturesContext = createContext({} as Record<string, Texture>);

export const TexturesProvider = ({ children }: Props) => {
	const [textures, setTextures] = useState<Record<string, Texture>>({});
	const [loaded, setLoaded] = useState(false);

	useEffect(() => {
		const sheet = new Spritesheet(BaseTexture.from("/blocks/programmer-art/spritesheet.png"), spritesheet);
		sheet.parse().then((t) => {
			setTextures(t);
			setLoaded(true);
		});
	}, []);

	if (!loaded) {
		return <h1>Loading...</h1>;
	}

	return <TexturesContext.Provider value={textures}>{children}</TexturesContext.Provider>;
};
