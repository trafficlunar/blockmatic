import { useEffect, useState } from "react";

function CursorInformation({ mousePosition, blocks }: { mousePosition: Position, blocks: Block[] }) {
    const [position, setPosition] = useState({ x: 0, y: 0 });
	const [block, setBlock] = useState<Block>();

	useEffect(() => {
		if (mousePosition) {
			const snappedX = Math.floor(mousePosition.x / 16);
			const snappedY = Math.floor(mousePosition.y / 16);

			setPosition({
				x: snappedX,
				y: snappedY,
			});

			setBlock(blocks.find(b => b.x === snappedX && b.y === snappedY));
		}
	}, [mousePosition]);

  return <div className="absolute left-4 bottom-4 flex flex-col gap-1">
	<div className="bg-zinc-900 px-2 py-1 rounded shadow-xl w-fit">{block?.name ?? "air"}</div>

	<div className="flex gap-4 bg-zinc-900 px-2 py-1 rounded shadow-xl w-fit">
        <span>X: {position.x}</span>
        <span>Y: {position.y}</span>
    </div>
  </div>
}

export default CursorInformation