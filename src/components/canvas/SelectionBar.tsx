import { useContext, useEffect, useState } from "react";
import { CheckIcon, XIcon } from "lucide-react";

import { HistoryContext } from "@/context/History";
import { SelectionContext } from "@/context/Selection";

import { Button } from "@/components/ui/button";
import { CanvasContext } from "@/context/Canvas";

interface Props {
	startBlocks: Block[];
	startSelectionCoords: CoordinateArray;
}

function SelectionBar({ startBlocks, startSelectionCoords }: Props) {
	const { blocks, setBlocks } = useContext(CanvasContext);
	const { addHistory } = useContext(HistoryContext);
	const { selectionCoords, selectionLayerBlocks, setSelectionCoords, setSelectionLayerBlocks } = useContext(SelectionContext);

	const [isVisible, setIsVisible] = useState(false);

	const confirm = () => {
		const oldSelectionCoords = [...selectionCoords];

		const combinedBlocks = [...blocks, ...selectionLayerBlocks];
		const uniqueBlocks = Array.from(new Map(combinedBlocks.map((block) => [`${block.x},${block.y}`, block])).values());

		setBlocks(uniqueBlocks);
		setSelectionLayerBlocks([]);

		addHistory(
			"Move Selection",
			() => {
				setBlocks(uniqueBlocks);
				setSelectionCoords(oldSelectionCoords);
			},
			() => {
				setBlocks(startBlocks);
				setSelectionCoords(startSelectionCoords);
			}
		);
	};

	const cancel = () => {
		setBlocks(startBlocks);
		setSelectionLayerBlocks([]);
		setSelectionCoords(startSelectionCoords);
	};

	useEffect(() => {
		setIsVisible(selectionLayerBlocks.length !== 0);
	}, [selectionLayerBlocks]);

	return (
		<div
			className={`absolute left-1/2 -translate-x-1/2 bottom-4 flex items-center bg-white dark:bg-zinc-900 rounded-lg shadow-xl border border-zinc-200 dark:border-zinc-800 transition-all duration-300
				${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6 pointer-events-none"}
			`}
		>
			<Button variant="ghost" className="w-8 h-8" onClick={cancel}>
				<XIcon />
			</Button>
			<span className="mx-2 text-[0.85rem]">Confirm selection?</span>
			<Button variant="ghost" className="w-8 h-8" onClick={confirm}>
				<CheckIcon />
			</Button>
		</div>
	);
}

export default SelectionBar;
