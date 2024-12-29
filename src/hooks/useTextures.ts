import { useContext, useMemo } from "react";
import { BaseTexture, Texture } from "pixi.js";

import { TexturesContext } from "@/context/Textures";
import { useBlockData } from "./useBlockData";

export function useTextures(version: number, blocks?: string[]): Record<string, Texture> {
	const { missingTexture, textures, programmerArtTextures } = useContext(TexturesContext);

	const blockData = useBlockData(version);
	const blocksToUse = blocks || Object.keys(blockData);

	return useMemo(() => {
		return blocksToUse.reduce<Record<string, Texture>>((textureMap, block) => {
			if (version <= 1130) {
				textureMap[block] = programmerArtTextures[`${block}.png`] ?? missingTexture;
			} else {
				textureMap[block] = textures[`${block}.png`] ?? missingTexture;
			}
			return textureMap;
		}, {});
	}, [blocksToUse, version, missingTexture, textures, programmerArtTextures]);
}
