/* eslint-disable react-hooks/exhaustive-deps */
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

function Selection({ selection, coords, scale, isDark }: Props) {
	const app = useApp();
	const selectionRef = useRef<SmoothGraphics>();

	const drawSelection = () => {
		if (!selectionRef.current) return;
		const graphics = selectionRef.current;
		graphics.clear();
		graphics.lineStyle({ width: 1, color: isDark ? 0xffffff : 0x000000, shader });

		const edges = new Set<string>();

		selection.forEach(([x, y]) => {
			const top = [x, y, x + 1, y];
			const bottom = [x, y + 1, x + 1, y + 1];
			const left = [x, y, x, y + 1];
			const right = [x + 1, y, x + 1, y + 1];

			// Add edges, or remove them if they already exist (shared edges)
			[top, bottom, left, right].forEach((edge) => {
				const stringified = JSON.stringify(edge);
				if (edges.has(stringified)) {
					edges.delete(stringified); // Shared edge, remove it
				} else {
					edges.add(stringified); // Unique edge, add it
				}
			});
		});

		// Draw the remaining edges
		edges.forEach((edge) => {
			const [x1, y1, x2, y2] = JSON.parse(edge);
			graphics.moveTo(x1 * 16 * scale, y1 * 16 * scale);
			graphics.lineTo(x2 * 16 * scale, y2 * 16 * scale);
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

export default Selection;
