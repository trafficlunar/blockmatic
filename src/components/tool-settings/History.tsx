import { useContext } from "react";
import { HistoryContext } from "@/context/History";
import { ScrollArea } from "@/components/ui/scroll-area";

function History() {
	const { history, currentIndex, jumpTo } = useContext(HistoryContext);

	return (
		<ScrollArea key={history.length} className="h-48 border border-zinc-200 dark:border-zinc-800 rounded-md">
			<div className="flex flex-col">
				{history.map(({ name }, index) => (
					<button
						key={index}
						onClick={() => jumpTo(index)}
						className={`w-full border-b border-zinc-200 dark:border-zinc-800
							// Current entry
							${index == currentIndex ? "bg-zinc-200 dark:bg-zinc-800 cursor-auto" : "bg-zinc-100 dark:bg-zinc-900"}
							// Ghost entries
							${index > currentIndex ? "bg-zinc-300 dark:bg-zinc-950 text-zinc-500 dark:text-zinc-600" : ""}
						`}
					>
						<span>{name}</span>
					</button>
				))}
			</div>
		</ScrollArea>
	);
}

export default History;
