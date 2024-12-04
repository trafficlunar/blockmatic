import { useEffect, useState } from "react";
import { Rect } from "react-konva";

function Cursor({ mousePosition }: { mousePosition: Position }) {
	const [position, setPosition] = useState({ x: 0, y: 0 });

	useEffect(() => {
		if (mousePosition) {
			const snappedX = Math.floor(mousePosition.x / 16) * 16;
			const snappedY = Math.floor(mousePosition.y / 16) * 16;

			setPosition({
				x: snappedX,
				y: snappedY,
			});
		}
	}, [mousePosition]);

	return <Rect x={position.x} y={position.y} width={16} height={16} stroke={"white"} strokeWidth={0.5} dash={[2.5]} />;
}

export default Cursor;
