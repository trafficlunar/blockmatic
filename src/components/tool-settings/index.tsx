import { useContext, useEffect, useRef, useState } from "react";

import { SettingsContext } from "@/context/Settings";

import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

import ColorPicker from "./ColorPicker";
import Replace from "./Replace";
import Radius from "./Radius";
import BlockSelector from "./BlockSelector";
import { ScrollArea } from "../ui/scroll-area";

function ToolSettings() {
	const { settings } = useContext(SettingsContext);

	const divRef = useRef<HTMLDivElement>(null);
	const [stageWidth, setStageWidth] = useState(0);
	const [searchInput, setSearchInput] = useState("");

	useEffect(() => {
		if (!divRef.current) return;
		setStageWidth(divRef.current.clientWidth);
	}, []);

	return (
		<>
			{(settings.colorPicker || settings.blockReplacer || settings.radiusChanger || settings.blockSelector) && (
				<div className="w-72 border-l border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-2 pb-0 flex flex-col h-full gap-2">
					{settings.colorPicker && (
						<>
							<ColorPicker />
							<Separator />
						</>
					)}

					{settings.blockReplacer && (
						<>
							<Replace />
							<Separator />
						</>
					)}

					{settings.radiusChanger && (
						<>
							<Radius />
							<Separator />
						</>
					)}

					{settings.blockSelector && (
						<>
							<Input placeholder="Search for blocks..." value={searchInput} onChange={(e) => setSearchInput(e.target.value)} />
							<ScrollArea ref={divRef} className="w-full flex-1 pb-2">
								<BlockSelector stageWidth={stageWidth} searchInput={searchInput} />
							</ScrollArea>
						</>
					)}
				</div>
			)}
		</>
	);
}

export default ToolSettings;
