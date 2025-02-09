import { createContext, ReactNode, useState } from "react";

interface Context {
	tool: Tool;
	radius: number;
	selectedBlock: string;
	shape: Shape;
	filled: boolean;
	setTool: React.Dispatch<React.SetStateAction<Tool>>;
	setRadius: React.Dispatch<React.SetStateAction<number>>;
	setSelectedBlock: React.Dispatch<React.SetStateAction<string>>;
	setShape: React.Dispatch<React.SetStateAction<Shape>>;
	setFilled: React.Dispatch<React.SetStateAction<boolean>>;
}

interface Props {
	children: ReactNode;
}

export const ToolContext = createContext<Context>({} as Context);

export const ToolProvider = ({ children }: Props) => {
	const [tool, setTool] = useState<Tool>("hand");
	const [radius, setRadius] = useState(1);
	const [selectedBlock, setSelectedBlock] = useState("stone");

	const [shape, setShape] = useState<Shape>("line");
	const [filled, setFilled] = useState(false);

	return (
		<ToolContext.Provider
			value={{
				tool,
				radius,
				selectedBlock,
				shape,
				filled,
				setTool,
				setRadius,
				setSelectedBlock,
				setShape,
				setFilled,
			}}
		>
			{children}
		</ToolContext.Provider>
	);
};
