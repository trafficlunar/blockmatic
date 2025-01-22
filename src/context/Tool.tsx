import { createContext, ReactNode, useEffect, useState } from "react";

interface Context {
	tool: Tool;
	radius: number;
	selectedBlock: string;
	selectionCoords: CoordinateArray;
	cssCursor: string;
	setTool: React.Dispatch<React.SetStateAction<Tool>>;
	setRadius: React.Dispatch<React.SetStateAction<number>>;
	setSelectedBlock: React.Dispatch<React.SetStateAction<string>>;
	setSelectionCoords: React.Dispatch<React.SetStateAction<CoordinateArray>>;
	setCssCursor: React.Dispatch<React.SetStateAction<string>>;
}

interface Props {
	children: ReactNode;
}

export const ToolContext = createContext<Context>({} as Context);

export const ToolProvider = ({ children }: Props) => {
	const [tool, setTool] = useState<Tool>("hand");
	const [radius, setRadius] = useState(1);
	const [selectedBlock, setSelectedBlock] = useState("stone");
	const [selectionCoords, setSelectionCoords] = useState<CoordinateArray>([]);
	const [cssCursor, setCssCursor] = useState("crosshair");

	useEffect(() => {
		const cursorMapping: Partial<Record<Tool, string>> = {
			hand: "grab",
			move: "move",
			zoom: "zoom-in",
		};

		setCssCursor(cursorMapping[tool] || "crosshair");
	}, [tool]);

	return (
		<ToolContext.Provider
			value={{
				tool,
				radius,
				selectedBlock,
				selectionCoords,
				cssCursor,
				setTool,
				setRadius,
				setSelectedBlock,
				setSelectionCoords,
				setCssCursor,
			}}
		>
			{children}
		</ToolContext.Provider>
	);
};
