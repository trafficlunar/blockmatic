import { useContext, useEffect, useState } from "react";
import { CheckIcon, XIcon } from "lucide-react";

import { CanvasContext } from "@/context/Canvas";
import { SelectionContext } from "@/context/Selection";

import * as selection from "@/utils/selection";

import { Button } from "@/components/ui/button";

function SelectionBar() {
	const { blocks, setBlocks } = useContext(CanvasContext);
	const { selectionLayerBlocks, setSelectionLayerBlocks } = useContext(SelectionContext);

	const [isVisible, setIsVisible] = useState(false);

	useEffect(() => {
		setIsVisible(selectionLayerBlocks.length !== 0);
	}, [selectionLayerBlocks]);

	return (
		<div
			className={`absolute left-1/2 -translate-x-1/2 bottom-4 flex items-center bg-white dark:bg-zinc-900 rounded-lg shadow-xl border border-zinc-200 dark:border-zinc-800 transition-all duration-300
				${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6 pointer-events-none"}
			`}
		>
			{/* todo: place back blocks removed */}
			<Button variant="ghost" className="w-8 h-8" onClick={() => setSelectionLayerBlocks([])}>
				<XIcon />
			</Button>
			<span className="mx-2 text-[0.85rem]">Confirm selection?</span>
			<Button variant="ghost" className="w-8 h-8" onClick={() => selection.confirm(blocks, selectionLayerBlocks, setBlocks, setSelectionLayerBlocks)}>
				<CheckIcon />
			</Button>
		</div>
	);
}

export default SelectionBar;
