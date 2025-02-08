import { useContext, useEffect, useRef } from "react";
import { HistoryContext } from "@/context/History";
import { ScrollArea } from "@/components/ui/scroll-area";
import { BombIcon, EraserIcon, PencilIcon, PresentationIcon, SquareDashedIcon, Trash2Icon, WandIcon } from "lucide-react";

const iconMap = {
	"New Canvas": PresentationIcon,
	Pencil: PencilIcon,
	Eraser: EraserIcon,
	"Rectangle Select": SquareDashedIcon,
	"Magic Wand": WandIcon,
	"Clear All": BombIcon,
	Delete: Trash2Icon,
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
