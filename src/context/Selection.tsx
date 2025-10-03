import React, { createContext, ReactNode, useRef, useState } from "react";

interface Context {
	selectionCoords: CoordinateArray;
	selectionLayerBlocks: Block[];
	confirmHistoryEntryNameRef: React.RefObject<string>;
	setSelectionCoords: React.Dispatch<React.SetStateAction<CoordinateArray>>;
	setSelectionLayerBlocks: React.Dispatch<React.SetStateAction<Block[]>>;
	isInSelection: (x: number, y: number) => boolean;
}

interface Props {
	children: ReactNode;
}

// eslint-disable-next-line react-refresh/only-export-components
export const SelectionContext = createContext<Context>({} as Context);

export const SelectionProvider = ({ children }: Props) => {
	const [selectionCoords, setSelectionCoords] = useState<CoordinateArray>([]);
	const [selectionLayerBlocks, setSelectionLayerBlocks] = useState<Block[]>([]);
	const confirmHistoryEntryNameRef = useRef("Move Selection");

	const isInSelection = (x: number, y: number): boolean => {
		if (selectionCoords.length !== 0) {
			return selectionCoords.some(([x2, y2]) => x2 === x && y2 === y);
		}
		return true;
	};

	return (
		<SelectionContext.Provider
			value={{
				selectionCoords,
				selectionLayerBlocks,
				confirmHistoryEntryNameRef,
				setSelectionCoords,
				setSelectionLayerBlocks,
				isInSelection,
			}}
		>
			{children}
		</SelectionContext.Provider>
	);
};
