interface Props {
	mouseCoords: Position;
	radius: number;
	isDark: boolean;
}

function Cursor({ mouseCoords, radius, isDark }: Props) {
	const isOddRadius = radius % 2 !== 0;
	const halfSize = Math.floor(radius / 2);

	const offset = isOddRadius ? -halfSize : 0;
	const size = radius * 16;

	return (
		<pixiGraphics
			x={(mouseCoords.x + offset) * 16}
			y={(mouseCoords.y + offset) * 16}
			draw={(g) => {
				g.clear();
				g.rect(0, 0, size, size);
				g.stroke({ width: 1, color: isDark ? 0xffffff : 0x000000, alignment: 1 });
			}}
		/>
	);
}

export default Cursor;
