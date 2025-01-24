import { useContext } from "react";
import { CheckIcon, XIcon } from "lucide-react";

import { CanvasContext } from "@/context/Canvas";
import { SelectionContext } from "@/context/Selection";

import { Button } from "@/components/ui/button";

function SelectionToolbar() {
	const { blocks, setBlocks } = useContext(CanvasContext);
	const { layerBlocks, setLayerBlocks } = useContext(SelectionContext);

	const confirmSelection = () => {
		const combinedBlocks = [...blocks, ...layerBlocks];
		const uniqueBlocks = Array.from(new Map(combinedBlocks.map((block) => [`${block.x},${block.y}`, block])).values());

		setBlocks(uniqueBlocks);
		setLayerBlocks([]);
	};

	return (
		layerBlocks.length != 0 && (
			<div className="absolute left-1/2 -translate-x-1/2 bottom-4 flex items-center bg-white dark:bg-zinc-950 rounded shadow-xl border border-zinc-200 dark:border-zinc-800">
				<span className="mr-4 ml-2">Selection</span>

				{/* todo: place back blocks removed */}
				<Button variant="ghost" className="w-8 h-8" onClick={() => setLayerBlocks([])}>
					<XIcon />
				</Button>
				<Button variant="ghost" className="w-8 h-8" onClick={confirmSelection}>
					<CheckIcon />
				</Button>
			</div>
		)
	);
}

export default SelectionToolbar;
