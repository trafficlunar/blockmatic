import { useEffect, useRef } from "react";
import { useApp } from "@pixi/react";
import { DashLineShader, SmoothGraphics } from "@pixi/graphics-smooth";

interface Props {
	selection: CoordinateArray;
	coords: Position;
	scale: number;
	isDark: boolean;
}

const shader = new DashLineShader({ dash: 8, gap: 5 });

function SelectionBox({ selection, coords, scale, isDark }: Props) {
	const app = useApp();
	const selectionRef = useRef<SmoothGraphics>();

	const drawSelection = () => {
		if (!selectionRef.current) return;
		const graphics = selectionRef.current;
		graphics.clear();
		graphics.lineStyle({ width: 1, color: isDark ? 0xffffff : 0x000000, shader });

		selection.forEach(([x, y]) => {
			const rectX = x * 16 * scale;
			const rectY = y * 16 * scale;

			graphics.drawRect(rectX, rectY, 16 * scale, 16 * scale);
			// todo: remove lines on adjacent rectangles
		});
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

	useEffect(drawSelection, [selection]);

	return null;
}

export default SelectionBox;
