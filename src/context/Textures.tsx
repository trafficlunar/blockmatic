import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { BaseTexture, Spritesheet, Texture } from "pixi.js";

import { LoadingContext } from "./Loading";

import spritesheet from "@/data/blocks/programmer-art/spritesheet.json";

interface Props {
	children: ReactNode;
}

export const TexturesContext = createContext({} as Record<string, Texture>);

export const TexturesProvider = ({ children }: Props) => {
	const [textures, setTextures] = useState<Record<string, Texture>>({});
	const { setLoading } = useContext(LoadingContext);

	useEffect(() => {
		const sheet = new Spritesheet(BaseTexture.from("/blocks/programmer-art/spritesheet.png"), spritesheet);
		sheet.parse().then((t) => {
			setTextures(t);
			setLoading(false);
		});
	}, []);

	return <TexturesContext.Provider value={textures}>{children}</TexturesContext.Provider>;
};
