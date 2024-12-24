import { useEffect, useRef, useState } from "react";

import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

import SelectorBlocks from "./SelectorBlocks";
import Radius from "./Radius";

function ToolSettings() {
	const divRef = useRef<HTMLDivElement>(null);
	const [stageWidth, setStageWidth] = useState(0);
	const [searchInput, setSearchInput] = useState("");

	useEffect(() => {
		if (divRef.current) {
			setStageWidth(divRef.current.clientWidth);
		}
	}, []);

	return (
		<div className="w-72 border-l border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-2 pb-0 flex flex-col h-full gap-2">
			<Radius />
			<Separator />

			<Input placeholder="Search for blocks..." value={searchInput} onChange={(e) => setSearchInput(e.target.value)} />
			<div ref={divRef} className="w-full flex-1 overflow-y-auto pb-2">
				<SelectorBlocks stageWidth={stageWidth} searchInput={searchInput} />
			</div>
		</div>
	);
}

export default ToolSettings;
