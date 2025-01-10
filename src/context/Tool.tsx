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
		switch (tool) {
			case "hand":
				setCssCursor("grab");
				break;
			case "zoom":
				setCssCursor("zoom-in");
				break;

			default:
				setCssCursor("crosshair");
				break;
		}
	}, [tool]);

	return (
		<ToolContext.Provider value={{ tool, radius, selectedBlock, cssCursor, setTool, setRadius, setSelectedBlock, setCssCursor }}>
			{children}
		</ToolContext.Provider>
	);
};
