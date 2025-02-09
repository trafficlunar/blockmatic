import { useContext, useEffect, useRef } from "react";
import {
	BombIcon,
	CircleIcon,
	EraserIcon,
	FileIcon,
	ImageIcon,
	LassoIcon,
	MoveIcon,
	PaintBucketIcon,
	PencilIcon,
	PresentationIcon,
	RectangleHorizontalIcon,
	ReplaceIcon,
	SlidersHorizontalIcon,
	SplineIcon,
	SquareDashedIcon,
	Trash2Icon,
	WandIcon,
} from "lucide-react";

import { HistoryContext } from "@/context/History";
import { ScrollArea } from "@/components/ui/scroll-area";

const iconMap = {
	Circle: CircleIcon,
	Delete: Trash2Icon,
	Eraser: EraserIcon,
	"Clear All": BombIcon,
	Lasso: LassoIcon,
	Line: SplineIcon,
	"Magic Wand": WandIcon,
	"Move Selection": MoveIcon,
	"New Canvas": PresentationIcon,
	"Open Image": ImageIcon,
	"Open Schematic": FileIcon,
	"Paint Bucket": PaintBucketIcon,
	Pencil: PencilIcon,
	Rectangle: RectangleHorizontalIcon,
	"Rectangle Select": SquareDashedIcon,
	Replace: ReplaceIcon,
	"Select All": SquareDashedIcon,
	"Set Version": SlidersHorizontalIcon,
};

function History() {
	const { history, currentIndex, jumpTo } = useContext(HistoryContext);

	const divRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		divRef.current?.scrollIntoView(false);
	}, [history]);

	return (
		<ScrollArea key={history.length} className="h-48 border border-zinc-200 dark:border-zinc-800 rounded-md">
			<div ref={divRef} className="flex flex-col">
				{history.map(({ name }, index) => {
					const IconComponent = iconMap[name as keyof typeof iconMap];

					return (
						<button
							key={index}
							onClick={() => jumpTo(index)}
							className={`w-full border-b border-zinc-200 dark:border-zinc-800 px-3 py-0.5 text-sm flex items-center gap-2
							// Current entry
							${index == currentIndex ? "bg-zinc-200 dark:bg-zinc-800 cursor-auto" : "bg-zinc-100 dark:bg-zinc-900"}
							// Ghost entries
							${index > currentIndex ? "bg-zinc-300 dark:bg-zinc-950 text-zinc-500 dark:text-zinc-600" : ""}
						`}
						>
							{IconComponent && <IconComponent size={16} />}
							<span>{name}</span>
						</button>
					);
				})}
			</div>
		</ScrollArea>
	);
}

export default History;
