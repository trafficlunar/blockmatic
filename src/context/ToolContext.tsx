import { createContext, ReactNode, useState } from "react";

interface Props {
	children: ReactNode;
}

export const ToolContext = createContext({
	tool: "hand" as Tool,
	selectedBlock: "stone",
	setTool: (tool: Tool) => {},
	setSelectedBlock: (block: string) => {},
});

export const ToolProvider = ({ children }: Props) => {
	const [tool, setTool] = useState<Tool>("hand");
	const [selectedBlock, setSelectedBlock] = useState("stone");

	return <ToolContext.Provider value={{ tool, selectedBlock, setTool, setSelectedBlock }}>{children}</ToolContext.Provider>;
};
