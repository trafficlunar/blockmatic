interface Props {
	selection: CoordinateArray;
	isDark: boolean;
	scale: number;
}

const DASH_LENGTH = 8;
const GAP_LENGTH = 5;

function Selection({ selection, isDark, scale }: Props) {
	return (
		<pixiGraphics
			draw={(g) => {
				g.clear();

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

				// Draw each remaining edge
				edges.forEach((edge) => {
					const [x1, y1, x2, y2] = JSON.parse(edge) as [number, number, number, number];

					// Draw dashed line
					const startX = x1 * 16;
					const startY = y1 * 16;
					const endX = x2 * 16;
					const endY = y2 * 16;

					const dx = endX - startX;
					const dy = endY - startY;
					const lineLength = Math.hypot(dx, dy);
					const angle = Math.atan2(dy, dx);

					let drawn = 0;
					while (drawn < lineLength) {
						const segmentLength = Math.min(DASH_LENGTH, lineLength - drawn);
						const sx = startX + Math.cos(angle) * drawn;
						const sy = startY + Math.sin(angle) * drawn;
						const ex = sx + Math.cos(angle) * segmentLength;
						const ey = sy + Math.sin(angle) * segmentLength;

						g.moveTo(sx, sy);
						g.lineTo(ex, ey);

						drawn += DASH_LENGTH + GAP_LENGTH;
					}
				});

				// Render the lines
				g.stroke({ width: 2 / scale, color: isDark ? 0xffffff : 0x000000, alignment: 0 });
			}}
		/>
	);
}

export default Selection;
