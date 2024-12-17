import { createContext, ReactNode, useEffect, useState } from "react";

interface Props {
	children: ReactNode;
}

export const ToolContext = createContext({
	tool: "hand" as Tool,
	selectedBlock: "stone",
	cssCursor: "pointer",
	setTool: (tool: Tool) => {},
	setSelectedBlock: (block: string) => {},
	setCssCursor: (cursor: string) => {},
});

export const ToolProvider = ({ children }: Props) => {
	const [tool, setTool] = useState<Tool>("hand");
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

	return <ToolContext.Provider value={{ tool, selectedBlock, cssCursor, setTool, setSelectedBlock, setCssCursor }}>{children}</ToolContext.Provider>;
};
