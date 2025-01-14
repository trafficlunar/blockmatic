import { useEffect, useRef } from "react";
import { useApp } from "@pixi/react";
import { DashLineShader, SmoothGraphics } from "@pixi/graphics-smooth";

interface Props {
	bounds: BoundingBox;
	coords: Position;
	scale: number;
	isDark: boolean;
}

const shader = new DashLineShader({ dash: 8, gap: 5 });

function SelectionBox({ bounds, coords, scale, isDark }: Props) {
	const app = useApp();
	const selectionRef = useRef<SmoothGraphics>();

	const drawSelection = () => {
		if (!selectionRef.current) return;
		const graphics = selectionRef.current;
		graphics.clear();
		graphics.lineStyle({ width: 1, color: isDark ? 0xffffff : 0x000000, shader });
		graphics.drawRect(
			bounds.minX * 16 * scale,
			bounds.minY * 16 * scale,
			(bounds.maxX - bounds.minX) * 16 * scale,
			(bounds.maxY - bounds.minY) * 16 * scale
		);
	};

	useEffect(() => {
		const graphics = new SmoothGraphics();
		selectionRef.current = graphics;
		drawSelection();
		app.stage.addChild(graphics);
	}, []);

	useEffect(() => {
		if (!selectionRef.current) return;
		const graphics = selectionRef.current;

		graphics.x = coords.x;
		graphics.y = coords.y;
		drawSelection();
	}, [coords]);

	useEffect(drawSelection, [bounds]);

	return null;
}

export default SelectionBox;
