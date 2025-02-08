import { createContext, ReactNode, useContext, useState } from "react";
import { CanvasContext } from "./Canvas";

interface Context {
	selectionCoords: CoordinateArray;
	selectionLayerBlocks: Block[];
	setSelectionCoords: React.Dispatch<React.SetStateAction<CoordinateArray>>;
	setSelectionLayerBlocks: React.Dispatch<React.SetStateAction<Block[]>>;
	isInSelection: (x: number, y: number) => boolean;
	confirmSelection: () => void;
}

interface Props {
	children: ReactNode;
}

export const SelectionContext = createContext<Context>({} as Context);

export const SelectionProvider = ({ children }: Props) => {
	const { blocks, setBlocks } = useContext(CanvasContext);

	const [selectionCoords, setSelectionCoords] = useState<CoordinateArray>([]);
	const [selectionLayerBlocks, setSelectionLayerBlocks] = useState<Block[]>([]);

	const isInSelection = (x: number, y: number): boolean => {
		if (selectionCoords.length !== 0) {
			return selectionCoords.some(([x2, y2]) => x2 === x && y2 === y);
		}
		return true;
	};

	const confirmSelection = () => {
		const combinedBlocks = [...blocks, ...selectionLayerBlocks];
		const uniqueBlocks = Array.from(new Map(combinedBlocks.map((block) => [`${block.x},${block.y}`, block])).values());

		setBlocks(uniqueBlocks);
		setSelectionLayerBlocks([]);
	};

	return (
		<SelectionContext.Provider
			value={{
				selectionCoords,
				selectionLayerBlocks,
				setSelectionCoords,
				setSelectionLayerBlocks,
				isInSelection,
				confirmSelection,
			}}
		>
			{children}
		</SelectionContext.Provider>
	);
};
