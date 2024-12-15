import { useEffect, useState } from "react";

interface Props {
	mouseCoords: Position;
	blocks: Block[];
}

function CursorInformation({ mouseCoords, blocks }: Props) {
	const [position, setPosition] = useState<Position>({ x: 0, y: 0 });
	const [block, setBlock] = useState<Block>();

	useEffect(() => {
		setPosition({
			x: mouseCoords.x,
			y: mouseCoords.y,
		});

		setBlock(blocks.find((b) => b.x === mouseCoords.x && b.y === mouseCoords.y));
	}, [mouseCoords]);

	return (
		<div className="absolute left-4 bottom-4 flex flex-col gap-1">
			<div className="info-child">{block?.name ?? "air"}</div>
			<div className="info-child">
				<span>X: {position.x} </span>
				<span>Y: {position.y}</span>
			</div>
		</div>
	);
}

export default CursorInformation;
