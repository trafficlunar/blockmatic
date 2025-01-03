import { useContext } from "react";
import { EraserIcon, HandIcon, PencilIcon, PipetteIcon, ZoomInIcon } from "lucide-react";

import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

import { ToolContext } from "@/context/Tool";

import SelectedBlock from "./SelectedBlock";

function Toolbar() {
	const { tool, setTool } = useContext(ToolContext);

	const onToolChange = (value: string) => setTool(value as Tool);

	return (
		<TooltipProvider>
			<ToggleGroup
				type="single"
				value={tool}
				onValueChange={onToolChange}
				className="flex flex-col justify-start py-1 border-r border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950"
			>
				{/* Hand */}
				<Tooltip delayDuration={0}>
					<TooltipTrigger>
						<ToggleGroupItem value="hand" className="!p-0 !h-8 !min-w-8">
							<HandIcon />
						</ToggleGroupItem>
					</TooltipTrigger>
					<TooltipContent side="right" sideOffset={10}>
						<p>Hand (1)</p>
					</TooltipContent>
				</Tooltip>

				{/* Pencil */}
				<Tooltip delayDuration={0}>
					<TooltipTrigger>
						<ToggleGroupItem value="pencil" className="!p-0 !h-8 !min-w-8">
							<PencilIcon />
						</ToggleGroupItem>
					</TooltipTrigger>
					<TooltipContent side="right" sideOffset={10}>
						<p>Pencil (2)</p>
					</TooltipContent>
				</Tooltip>

				{/* Eraser */}
				<Tooltip delayDuration={0}>
					<TooltipTrigger>
						<ToggleGroupItem value="eraser" className="!p-0 !h-8 !min-w-8">
							<EraserIcon />
						</ToggleGroupItem>
					</TooltipTrigger>
					<TooltipContent side="right" sideOffset={10}>
						<p>Eraser (3)</p>
					</TooltipContent>
				</Tooltip>

				{/* Eyedropper */}
				<Tooltip delayDuration={0}>
					<TooltipTrigger>
						<ToggleGroupItem value="eyedropper" className="!p-0 !h-8 !min-w-8">
							<PipetteIcon />
						</ToggleGroupItem>
					</TooltipTrigger>
					<TooltipContent side="right" sideOffset={10}>
						<p>Eyedropper (4)</p>
					</TooltipContent>
				</Tooltip>

				{/* Zoom */}
				<Tooltip delayDuration={0}>
					<TooltipTrigger>
						<ToggleGroupItem value="zoom" className="!p-0 !h-8 !min-w-8">
							<ZoomInIcon />
						</ToggleGroupItem>
					</TooltipTrigger>
					<TooltipContent side="right" sideOffset={10}>
						<p>Zoom (5)</p>
					</TooltipContent>
				</Tooltip>

				<SelectedBlock />
			</ToggleGroup>
		</TooltipProvider>
	);
}

export default Toolbar;
