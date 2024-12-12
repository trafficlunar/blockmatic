import { Graphics } from "@pixi/react";

interface Props {
	mouseCoords: Position
}

function Cursor({ mouseCoords }: Props) {
	return (
		<Graphics
			x={mouseCoords.x * 16}
			y={mouseCoords.y * 16}
			draw={(g) => {
				g.clear();
				g.lineStyle(1, 0xffffff, 1);
				g.drawRect(0, 0, 16, 16);
			}}
		/>
	);
}

export default Cursor;
