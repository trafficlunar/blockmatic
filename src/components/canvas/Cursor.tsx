import { Graphics } from "@pixi/react";

interface Props {
	mouseCoords: Position;
	radius: number;
}

function Cursor({ mouseCoords, radius }: Props) {
	const isOddRadius = radius % 2 !== 0;
	const halfSize = Math.floor(radius / 2);

	const offset = isOddRadius ? -halfSize : 0;
	const size = radius * 16;

	return (
		<Graphics
			x={(mouseCoords.x + offset) * 16}
			y={(mouseCoords.y + offset) * 16}
			draw={(g) => {
				g.clear();
				g.lineStyle(1, 0xffffff, 1);
				g.drawRect(0, 0, size, size);
			}}
		/>
	);
}

export default Cursor;
