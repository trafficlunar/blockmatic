import { useContext } from "react";
import { EraserIcon, HandIcon, PencilIcon, ZoomInIcon } from "lucide-react";

import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { ToolContext } from "@/context/Tool";

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
				<HandIcon />
			</ToggleGroupItem>
			<ToggleGroupItem value="pencil" className="!p-0 !h-8 !min-w-8">
				<PencilIcon />
			</ToggleGroupItem>
			<ToggleGroupItem value="eraser" className="!p-0 !h-8 !min-w-8">
				<EraserIcon />
			</ToggleGroupItem>
			<ToggleGroupItem value="zoom" className="!p-0 !h-8 !min-w-8">
				<ZoomInIcon />
			</ToggleGroupItem>
		</ToggleGroup>
	);
}

export default Toolbar;
