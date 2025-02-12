import { useContext } from "react";

import { CanvasContext } from "@/context/Canvas";

export function useZoomTool(mousePosition: Position, holdingAlt: boolean) {
	const { coords, scale, setScale, setCoords } = useContext(CanvasContext);

	const use = () => {
		const zoomFactor = holdingAlt ? -0.1 : 0.1;
		const newScale = Math.min(Math.max(scale + zoomFactor * scale, 0.1), 32);

		setScale(newScale);
		setCoords({
			x: mousePosition.x - ((mousePosition.x - coords.x) / scale) * newScale,
			y: mousePosition.y - ((mousePosition.y - coords.y) / scale) * newScale,
		});
	};

	return { use };
}
