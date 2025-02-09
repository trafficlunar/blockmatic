import { useContext, useEffect, useRef, useState } from "react";
import { GripVerticalIcon } from "lucide-react";

import { SettingsContext } from "@/context/Settings";

import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import History from "./History";
import ColorPicker from "./ColorPicker";
import Replace from "./Replace";
import ToolSettings from "./ToolSettings";
import BlockSelector from "./BlockSelector";

function Sidebar() {
	const { settings } = useContext(SettingsContext);

	const [width, setWidth] = useState(300);
	const [resizing, setResizing] = useState(false);

	const divRef = useRef<HTMLDivElement>(null);
	const [stageWidth, setStageWidth] = useState(0);
	const [searchInput, setSearchInput] = useState("");

	const enabledTabs = [settings.historyPanel, settings.colorPicker, settings.blockReplacer].filter(Boolean).length;
	const defaultTab = settings.historyPanel ? "history" : settings.colorPicker ? "color-picker" : settings.blockReplacer ? "replace" : undefined;

	const [activeTab, setActiveTab] = useState(defaultTab);

	const onMouseDown = () => {
		setResizing(true);
		document.body.style.cursor = "ew-resize";
	};

	const onMouseUp = () => {
		setResizing(false);
		document.body.style.cursor = "auto";
	};

	const onMouseMove = (e: MouseEvent) => {
		if (!resizing) return;
		setWidth(() => Math.min(Math.max(window.innerWidth - e.clientX, 200), 1000));
	};

	useEffect(() => {
		if (resizing) {
			document.addEventListener("mousemove", onMouseMove);
			document.addEventListener("mouseup", onMouseUp);
		} else {
			document.removeEventListener("mousemove", onMouseMove);
			document.removeEventListener("mouseup", onMouseUp);
		}

		return () => {
			document.removeEventListener("mousemove", onMouseMove);
			document.removeEventListener("mouseup", onMouseUp);
		};
	}, [resizing]);

	useEffect(() => {
		const div = divRef.current;
		if (!div) return;

		const set = () => setStageWidth(div.clientWidth);

		const resizeObserver = new ResizeObserver(set);
		resizeObserver.observe(div);

		set();

		return () => {
			resizeObserver.disconnect();
		};
	}, [divRef]);

	useEffect(() => {
		setActiveTab(settings.historyPanel ? "history" : settings.colorPicker ? "color-picker" : settings.blockReplacer ? "replace" : undefined);
	}, [settings]);

	return (
		<>
			{(settings.historyPanel || settings.colorPicker || settings.blockReplacer || settings.toolSettings || settings.blockSelector) && (
				<div
					style={{ width: `${width}px` }}
					className="w-72 border-l border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-2 pb-0 flex flex-col h-full gap-2 relative"
				>
					<div
						onMouseDown={onMouseDown}
						className="absolute top-0 -left-2 h-full w-4 bg-zinc-300 dark:bg-zinc-800 flex justify-center items-center cursor-e-resize opacity-0 transition-opacity duration-300 delay-100 hover:opacity-100"
					>
						<GripVerticalIcon />
					</div>

					{(settings.historyPanel || settings.colorPicker || settings.blockReplacer) && (
						<>
							<Tabs value={activeTab} onValueChange={setActiveTab} className="[&>*:first-child]:mt-0">
								{enabledTabs > 1 && (
									<TabsList className={`grid w-full grid-cols-${enabledTabs} h-8 *:p-0.5`}>
										{settings.historyPanel && <TabsTrigger value="history">History</TabsTrigger>}
										{settings.colorPicker && <TabsTrigger value="color-picker">Color</TabsTrigger>}
										{settings.blockReplacer && <TabsTrigger value="replace">Replace</TabsTrigger>}
									</TabsList>
								)}
								{settings.historyPanel && (
									<TabsContent value="history">
										<History />
									</TabsContent>
								)}
								{settings.colorPicker && (
									<TabsContent value="color-picker">
										<ColorPicker />
									</TabsContent>
								)}
								{settings.blockReplacer && (
									<TabsContent value="replace">
										<Replace />
									</TabsContent>
								)}
							</Tabs>

							<Separator />
						</>
					)}

					{settings.toolSettings && (
						<>
							<ToolSettings />
							<Separator />
						</>
					)}

					{settings.blockSelector && (
						<>
							<Input placeholder="Search for blocks..." value={searchInput} onChange={(e) => setSearchInput(e.target.value)} />
							<ScrollArea ref={divRef} className="w-full flex-1 pb-0">
								<BlockSelector stageWidth={stageWidth} searchInput={searchInput} />
							</ScrollArea>
						</>
					)}
				</div>
			)}
		</>
	);
}

export default Sidebar;
