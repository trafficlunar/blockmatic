import { useContext } from "react";
import {
	CircleIcon,
	EraserIcon,
	HandIcon,
	LassoIcon,
	MousePointer2Icon,
	PaintBucketIcon,
	PencilIcon,
	PipetteIcon,
	RectangleHorizontalIcon,
	SplineIcon,
	SquareDashedIcon,
	WandIcon,
	ZoomInIcon,
} from "lucide-react";

import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

import { ToolContext } from "@/context/Tool";

import SelectedBlock from "./SelectedBlock";

const shapeIconMap = {
	line: SplineIcon,
	rectangle: RectangleHorizontalIcon,
	circle: CircleIcon,
};

function Toolbar() {
	const { tool, shape, setTool } = useContext(ToolContext);

	const onToolChange = (value: string) => setTool(value as Tool);

	const ShapeIconComponent = shapeIconMap[shape as keyof typeof shapeIconMap];

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
						<p>Hand (H)</p>
					</TooltipContent>
				</Tooltip>

				{/* Move */}
				<Tooltip delayDuration={0}>
					<TooltipTrigger>
						<ToggleGroupItem value="move" className="!p-0 !h-8 !min-w-8">
							<MousePointer2Icon />
						</ToggleGroupItem>
					</TooltipTrigger>
					<TooltipContent side="right" sideOffset={10}>
						<p>Move (V)</p>
					</TooltipContent>
				</Tooltip>

				{/* Rectangle Select */}
				<Tooltip delayDuration={0}>
					<TooltipTrigger>
						<ToggleGroupItem value="rectangle-select" className="!p-0 !h-8 !min-w-8">
							<SquareDashedIcon />
						</ToggleGroupItem>
					</TooltipTrigger>
					<TooltipContent side="right" sideOffset={10}>
						<p>Rectangle Select (M)</p>
					</TooltipContent>
				</Tooltip>

				{/* Lasso */}
				<Tooltip delayDuration={0}>
					<TooltipTrigger>
						<ToggleGroupItem value="lasso" className="!p-0 !h-8 !min-w-8">
							<LassoIcon />
						</ToggleGroupItem>
					</TooltipTrigger>
					<TooltipContent side="right" sideOffset={10}>
						<p>Lasso (L)</p>
					</TooltipContent>
				</Tooltip>

				{/* Magic Wand */}
				<Tooltip delayDuration={0}>
					<TooltipTrigger>
						<ToggleGroupItem value="magic-wand" className="!p-0 !h-8 !min-w-8">
							<WandIcon />
						</ToggleGroupItem>
					</TooltipTrigger>
					<TooltipContent side="right" sideOffset={10}>
						<p>Magic Wand (W)</p>
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
						<p>Pencil (B)</p>
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
						<p>Eraser (E)</p>
					</TooltipContent>
				</Tooltip>

				{/* Paint Bucket */}
				<Tooltip delayDuration={0}>
					<TooltipTrigger>
						<ToggleGroupItem value="paint-bucket" className="!p-0 !h-8 !min-w-8">
							<PaintBucketIcon />
						</ToggleGroupItem>
					</TooltipTrigger>
					<TooltipContent side="right" sideOffset={10}>
						<p>Paint Bucket (G)</p>
					</TooltipContent>
				</Tooltip>

				{/* Shape */}
				<Tooltip delayDuration={0}>
					<TooltipTrigger>
						<ToggleGroupItem value="shape" className="!p-0 !h-8 !min-w-8">
							{ShapeIconComponent && <ShapeIconComponent />}
						</ToggleGroupItem>
					</TooltipTrigger>
					<TooltipContent side="right" sideOffset={10}>
						<p>Shape (U)</p>
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
						<p>Eyedropper (I)</p>
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
						<p>Zoom (Z)</p>
					</TooltipContent>
				</Tooltip>

				<SelectedBlock />
			</ToggleGroup>
		</TooltipProvider>
	);
}

export default Toolbar;
