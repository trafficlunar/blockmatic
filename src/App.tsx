import { useEffect, useRef, useState } from "react";
import { Layer, Stage } from "react-konva";
import { Hand } from "lucide-react";

import {
	Menubar,
	MenubarContent,
	MenubarItem,
	MenubarMenu,
	MenubarSeparator,
	MenubarSub,
	MenubarSubContent,
	MenubarSubTrigger,
	MenubarTrigger,
} from "@/components/ui/menubar";
import { ToggleGroup, ToggleGroupItem } from "./components/ui/toggle-group";

import ThemeChanger from "./components/menubar/theme-changer";
import Blocks from "./components/blocks";
import Cursor from "./components/cursor";
import CursorInformation from "./components/cursor-information";

function App() {
	const stageContainerRef = useRef<HTMLDivElement>(null);
	const stageRef = useRef(null);

	const [stageSize, setStageSize] = useState({
		width: 0,
		height: 0,
	});

	const [stageScale, setStageScale] = useState(1);
	const [stageCoords, setStageCoords] = useState<Position>({ x: 0, y: 0 });
	const [mousePosition, setMousePosition] = useState<Position>({ x: 0, y: 0 });

	const [tool, setTool] = useState<Tool>("hand");
	const [blocks, setBlocks] = useState<Block[]>([]);

	const [cssCursor, setCssCursor] = useState("grab");

	const onMouseMove = (e) => {
		const stage = e.target.getStage();
		const oldScale = stage.scaleX();
		const pointer = stage.getPointerPosition();

		setMousePosition({
			x: (pointer.x - stage.x()) / oldScale,
			y: (pointer.y - stage.y()) / oldScale,
		});
	};

	const onMouseDown = (e) => {
		if (tool == "hand") {
			setCssCursor("grabbing");
		}
	};

	const onMouseUp = (e) => {
		if (tool == "hand") {
			setCssCursor("grab");
		}
	};

	const onWheel = (e) => {
		const stage = e.target.getStage();
		const oldScale = stage.scaleX();
		const pointer = stage.getPointerPosition();

		const newScale = e.evt.deltaY < 0 ? oldScale * 1.05 : oldScale / 1.05;

		setStageScale(newScale);
		setStageCoords({
			x: pointer.x - mousePosition.x * newScale,
			y: pointer.y - mousePosition.y * newScale,
		});
	};

	useEffect(() => {
		if (stageContainerRef.current && stageRef.current) {
			setStageSize({
				width: stageContainerRef.current.offsetWidth,
				height: stageContainerRef.current.offsetHeight,
			});
		}
	}, []);

	return (
		<main className="h-screen grid grid-rows-[2.5rem_1fr] grid-cols-[2.5rem_1fr]">
			<Menubar className="rounded-none border-t-0 border-x-0 col-span-2">
				<MenubarMenu>
					<a href="https://github.com/trafficlunar/blockmatic" className="ml-4 mr-2">
						blockmatic
					</a>

					<MenubarTrigger>File</MenubarTrigger>
					<MenubarContent>
						<MenubarItem>Open Schematic</MenubarItem>
						<MenubarItem>Open Image</MenubarItem>

						<MenubarSeparator />

						<MenubarSub>
							<MenubarSubTrigger>Export to...</MenubarSubTrigger>
							<MenubarSubContent>
								<MenubarItem>.schematic</MenubarItem>
								<MenubarItem>.litematic</MenubarItem>
								<MenubarItem>image</MenubarItem>
							</MenubarSubContent>
						</MenubarSub>
					</MenubarContent>
				</MenubarMenu>

				<MenubarMenu>
					<MenubarTrigger>More</MenubarTrigger>
					<MenubarContent>
						<ThemeChanger />
					</MenubarContent>
				</MenubarMenu>
			</Menubar>

			<ToggleGroup type="single" size={"sm"} value={tool} className="flex flex-col justify-start py-0.5 border-r border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950">
				<ToggleGroupItem value="hand">
					<Hand />
				</ToggleGroupItem>
			</ToggleGroup>

			<div ref={stageContainerRef} className="relative w-full h-full">
				<Stage
					width={stageSize.width}
					height={stageSize.height}
					draggable
					ref={stageRef}
					x={stageCoords.x}
					y={stageCoords.y}
					scaleX={stageScale}
					scaleY={stageScale}
					onMouseMove={onMouseMove}
					onMouseDown={onMouseDown}
					onMouseUp={onMouseUp}
					onWheel={onWheel}
					style={{ cursor: cssCursor }}
				>
					<Layer imageSmoothingEnabled={false}>
						<Blocks blocks={blocks} setBlocks={setBlocks} />
						<Cursor mousePosition={mousePosition} />
					</Layer>
				</Stage>

				<CursorInformation mousePosition={mousePosition} blocks={blocks} />
			</div>
		</main>
	);
}

export default App;
