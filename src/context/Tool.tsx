import { createContext, ReactNode, useEffect, useState } from "react";

interface Context {
	tool: Tool;
	radius: number;
	selectedBlock: string;
	cssCursor: string;
	setTool: React.Dispatch<React.SetStateAction<Tool>>;
	setRadius: React.Dispatch<React.SetStateAction<number>>;
	setSelectedBlock: React.Dispatch<React.SetStateAction<string>>;
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
				cssCursor,
				setTool,
				setRadius,
				setSelectedBlock,
				setCssCursor,
			}}
		>
			{children}
		</ToolContext.Provider>
	);
};
