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
				className="rounded-none w-full flex flex-col items-center border-r border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 *:py-0.5"
			>
				{/* Hand */}
				<Tooltip delayDuration={0}>
					<TooltipTrigger asChild>
						<span>
							<ToggleGroupItem value="hand" className="p-0! h-8! min-w-8! rounded-xl">
								<HandIcon />
							</ToggleGroupItem>
						</span>
					</TooltipTrigger>
					<TooltipContent side="right" sideOffset={10}>
						<p>Hand (H)</p>
					</TooltipContent>
				</Tooltip>

				{/* Move */}
				<Tooltip delayDuration={0}>
					<TooltipTrigger asChild>
						<span>
							<ToggleGroupItem value="move" className="p-0! h-8! min-w-8! rounded-xl">
								<MousePointer2Icon />
							</ToggleGroupItem>
						</span>
					</TooltipTrigger>
					<TooltipContent side="right" sideOffset={10}>
						<p>Move (V)</p>
					</TooltipContent>
				</Tooltip>

				{/* Rectangle Select */}
				<Tooltip delayDuration={0}>
					<TooltipTrigger asChild>
						<span>
							<ToggleGroupItem value="rectangle-select" className="p-0! h-8! min-w-8! rounded-xl">
								<SquareDashedIcon />
							</ToggleGroupItem>
						</span>
					</TooltipTrigger>
					<TooltipContent side="right" sideOffset={10}>
						<p>Rectangle Select (M)</p>
					</TooltipContent>
				</Tooltip>

				{/* Lasso */}
				<Tooltip delayDuration={0}>
					<TooltipTrigger asChild>
						<span>
							<ToggleGroupItem value="lasso" className="p-0! h-8! min-w-8! rounded-xl">
								<LassoIcon />
							</ToggleGroupItem>
						</span>
					</TooltipTrigger>
					<TooltipContent side="right" sideOffset={10}>
						<p>Lasso (L)</p>
					</TooltipContent>
				</Tooltip>

				{/* Magic Wand */}
				<Tooltip delayDuration={0}>
					<TooltipTrigger asChild>
						<span>
							<ToggleGroupItem value="magic-wand" className="p-0! h-8! min-w-8! rounded-xl">
								<WandIcon />
							</ToggleGroupItem>
						</span>
					</TooltipTrigger>
					<TooltipContent side="right" sideOffset={10}>
						<p>Magic Wand (W)</p>
					</TooltipContent>
				</Tooltip>

				{/* Pencil */}
				<Tooltip delayDuration={0}>
					<TooltipTrigger asChild>
						<span>
							<ToggleGroupItem value="pencil" className="p-0! h-8! min-w-8! rounded-xl">
								<PencilIcon />
							</ToggleGroupItem>
						</span>
					</TooltipTrigger>
					<TooltipContent side="right" sideOffset={10}>
						<p>Pencil (B)</p>
					</TooltipContent>
				</Tooltip>

				{/* Eraser */}
				<Tooltip delayDuration={0}>
					<TooltipTrigger asChild>
						<span>
							<ToggleGroupItem value="eraser" className="p-0! h-8! min-w-8! rounded-xl">
								<EraserIcon />
							</ToggleGroupItem>
						</span>
					</TooltipTrigger>
					<TooltipContent side="right" sideOffset={10}>
						<p>Eraser (E)</p>
					</TooltipContent>
				</Tooltip>

				{/* Paint Bucket */}
				<Tooltip delayDuration={0}>
					<TooltipTrigger asChild>
						<span>
							<ToggleGroupItem value="paint-bucket" className="p-0! h-8! min-w-8! rounded-xl">
								<PaintBucketIcon />
							</ToggleGroupItem>
						</span>
					</TooltipTrigger>
					<TooltipContent side="right" sideOffset={10}>
						<p>Paint Bucket (G)</p>
					</TooltipContent>
				</Tooltip>

				{/* Shape */}
				<Tooltip delayDuration={0}>
					<TooltipTrigger asChild>
						<span>
							<ToggleGroupItem value="shape" className="p-0! h-8! min-w-8! rounded-xl">
								{ShapeIconComponent && <ShapeIconComponent />}
							</ToggleGroupItem>
						</span>
					</TooltipTrigger>
					<TooltipContent side="right" sideOffset={10}>
						<p>Shape (U)</p>
					</TooltipContent>
				</Tooltip>

				{/* Eyedropper */}
				<Tooltip delayDuration={0}>
					<TooltipTrigger asChild>
						<span>
							<ToggleGroupItem value="eyedropper" className="p-0! h-8! min-w-8! rounded-xl">
								<PipetteIcon />
							</ToggleGroupItem>
						</span>
					</TooltipTrigger>
					<TooltipContent side="right" sideOffset={10}>
						<p>Eyedropper (I)</p>
					</TooltipContent>
				</Tooltip>

				{/* Zoom */}
				<Tooltip delayDuration={0}>
					<TooltipTrigger asChild>
						<span>
							<ToggleGroupItem value="zoom" className="p-0! h-8! min-w-8! rounded-xl">
								<ZoomInIcon />
							</ToggleGroupItem>
						</span>
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
