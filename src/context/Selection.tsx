import { createContext, ReactNode, useState } from "react";

interface Context {
	coords: CoordinateArray;
	layerBlocks: Block[];
	setCoords: React.Dispatch<React.SetStateAction<CoordinateArray>>;
	setLayerBlocks: React.Dispatch<React.SetStateAction<Block[]>>;
}

interface Props {
	children: ReactNode;
}

export const SelectionContext = createContext<Context>({} as Context);

export const SelectionProvider = ({ children }: Props) => {
	const [coords, setCoords] = useState<CoordinateArray>([]);
	const [layerBlocks, setLayerBlocks] = useState<Block[]>([]);

	return (
		<SelectionContext.Provider
			value={{
				coords,
				layerBlocks,
				setCoords,
				setLayerBlocks,
			}}
		>
			{children}
		</SelectionContext.Provider>
	);
};
