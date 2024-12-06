import { useEffect, useState } from "react";
import { Graphics } from "@pixi/react";

function Cursor({ localMousePosition }: { localMousePosition: Position }) {
	const [position, setPosition] = useState({ x: 0, y: 0 });

	useEffect(() => {
		if (localMousePosition) {
			const x = Math.floor(localMousePosition.x / 16) * 16;
			const y = Math.floor(localMousePosition.y / 16) * 16;

			setPosition({ x, y });
		}
	}, [localMousePosition]);

	return (
		<Graphics
			x={position.x}
			y={position.y}
			draw={(g) => {
				g.clear();
				g.lineStyle(1, 0xffffff, 1);
				g.drawRect(0, 0, 16, 16);
			}}
		/>
	);
}

export default Cursor;
