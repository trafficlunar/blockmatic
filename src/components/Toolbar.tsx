import { useContext } from "react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Eraser, Hand, Pencil } from "lucide-react";

import { ToolContext } from "@/context/ToolContext";

function Toolbar() {
	const { tool, setTool } = useContext(ToolContext);

	const onToolChange = (value: string) => setTool(value as Tool);

	return (
		<ToggleGroup
			type="single"
			value={tool}
			onValueChange={onToolChange}
			className="flex flex-col justify-start py-1 border-r border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950"
		>
			<ToggleGroupItem value="hand" className="!p-0 !h-8 !min-w-8">
				<Hand />
			</ToggleGroupItem>
			<ToggleGroupItem value="pencil" className="!p-0 !h-8 !min-w-8">
				<Pencil />
			</ToggleGroupItem>
			<ToggleGroupItem value="eraser" className="!p-0 !h-8 !min-w-8">
				<Eraser />
			</ToggleGroupItem>
		</ToggleGroup>
	);
}

export default Toolbar;
