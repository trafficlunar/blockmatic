import { createContext, ReactNode, useState } from "react";

interface Context {
	tool: Tool;
	radius: number;
	selectedBlock: string;
	setTool: React.Dispatch<React.SetStateAction<Tool>>;
	setRadius: React.Dispatch<React.SetStateAction<number>>;
	setSelectedBlock: React.Dispatch<React.SetStateAction<string>>;
}

interface Props {
	children: ReactNode;
}

export const ToolContext = createContext<Context>({} as Context);

export const ToolProvider = ({ children }: Props) => {
	const [tool, setTool] = useState<Tool>("hand");
	const [radius, setRadius] = useState(1);
	const [selectedBlock, setSelectedBlock] = useState("stone");

	return (
		<ToolContext.Provider
			value={{
				tool,
				radius,
				selectedBlock,
				setTool,
				setRadius,
				setSelectedBlock,
			}}
		>
			{children}
		</ToolContext.Provider>
	);
};
