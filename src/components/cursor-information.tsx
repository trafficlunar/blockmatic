import { useEffect, useState } from "react";

function CursorInformation({ localMousePosition, blocks }: { localMousePosition: Position; blocks: Block[] }) {
	const [position, setPosition] = useState({ x: 0, y: 0 });
	const [block, setBlock] = useState<Block>();

	useEffect(() => {
		if (localMousePosition) {
			const x = Math.floor(localMousePosition.x / 16);
			const y = Math.floor(localMousePosition.y / 16);

			setPosition({
				x,
				y,
			});

			setBlock(blocks.find((b) => b.x === x && b.y === y));
		}
	}, [localMousePosition]);

	return (
		<div className="absolute left-4 bottom-4 flex flex-col gap-1">
			<div className="bg-white dark:bg-zinc-950 px-2 py-1 rounded shadow-xl w-fit  border border-zinc-200 dark:border-zinc-800">
				{block?.name ?? "air"}
			</div>

			<div className="flex gap-4 bg-white dark:bg-zinc-950 px-2 py-1 rounded shadow-xl w-fit border border-zinc-200 dark:border-zinc-800">
				<span>X: {position.x}</span>
				<span>Y: {position.y}</span>
			</div>
		</div>
	);
}

export default CursorInformation;
