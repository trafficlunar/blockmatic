import { useContext } from "react";

import { CanvasContext } from "@/context/Canvas";

export function useZoomTool(zoom: (newScale: number) => void, holdingAlt: boolean) {
	const { scale } = useContext(CanvasContext);

	const use = () => {
		const scaleChange = holdingAlt ? -0.1 : 0.1;
		const newScale = Math.min(Math.max(scale + scaleChange * scale, 0.1), 32);
		zoom(newScale);
	};

	return { use };
}
