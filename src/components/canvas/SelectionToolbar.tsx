import { useContext, useEffect, useState } from "react";
import { CheckIcon, XIcon } from "lucide-react";

import { CanvasContext } from "@/context/Canvas";
import { SelectionContext } from "@/context/Selection";

import { Button } from "@/components/ui/button";

function SelectionToolbar() {
	const { blocks, setBlocks } = useContext(CanvasContext);
	const { layerBlocks, setLayerBlocks } = useContext(SelectionContext);

	const [isVisible, setIsVisible] = useState(false);

	const confirmSelection = () => {
		const combinedBlocks = [...blocks, ...layerBlocks];
		const uniqueBlocks = Array.from(new Map(combinedBlocks.map((block) => [`${block.x},${block.y}`, block])).values());

		setBlocks(uniqueBlocks);
		setLayerBlocks([]);
	};

	useEffect(() => {
		setIsVisible(layerBlocks.length !== 0);
	}, [layerBlocks]);

	return (
		<div
			className={`absolute left-1/2 -translate-x-1/2 bottom-4 flex items-center bg-white dark:bg-zinc-900 rounded-lg shadow-xl border border-zinc-200 dark:border-zinc-800 transition-all duration-300
				${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6 pointer-events-none"}
			`}
		>
			{/* todo: place back blocks removed */}
			<Button variant="ghost" className="w-8 h-8" onClick={() => setLayerBlocks([])}>
				<XIcon />
			</Button>
			<span className="mx-2 text-[0.85rem]">Confirm selection?</span>
			<Button variant="ghost" className="w-8 h-8" onClick={confirmSelection}>
				<CheckIcon />
			</Button>
		</div>
	);
}

export default SelectionToolbar;
