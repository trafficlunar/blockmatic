import { createContext, ReactNode, useEffect, useState } from "react";

interface Props {
	children: ReactNode;
}

export const ToolContext = createContext({
	tool: "hand" as Tool,
	radius: 1,
	selectedBlock: "stone",
	cssCursor: "pointer",
	setTool: ((tool: Tool) => {}) as React.Dispatch<React.SetStateAction<Tool>>,
	setRadius: ((value: number) => {}) as React.Dispatch<React.SetStateAction<number>>,
	setSelectedBlock: ((block: string) => {}) as React.Dispatch<React.SetStateAction<string>>,
	setCssCursor: ((cursor: string) => {}) as React.Dispatch<React.SetStateAction<string>>,
});

export const ToolProvider = ({ children }: Props) => {
	const [tool, setTool] = useState<Tool>("hand");
	const [radius, setRadius] = useState(1);
	const [selectedBlock, setSelectedBlock] = useState("stone");
	const [cssCursor, setCssCursor] = useState("pointer");

	useEffect(() => {
		switch (tool) {
			case "hand":
				setCssCursor("grab");
				break;
			case "zoom":
				setCssCursor("zoom-in");
				break;

			default:
				setCssCursor("pointer");
				break;
		}
	}, [tool]);

	return (
		<ToolContext.Provider value={{ tool, radius, selectedBlock, cssCursor, setTool, setRadius, setSelectedBlock, setCssCursor }}>
			{children}
		</ToolContext.Provider>
	);
};
