import React, { useEffect, useRef, useState } from "react";
import { Eraser, Hand, Pencil } from "lucide-react";

import * as PIXI from "pixi.js";
import { Container, Stage } from "@pixi/react";

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

// Set scale mode to NEAREST
PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;

function App() {
	const stageContainerRef = useRef<HTMLDivElement>(null);

	const [stageSize, setStageSize] = useState({ width: 0, height: 0 });
	const [coords, setCoords] = useState<Position>({ x: 0, y: 0 });
	const [mousePosition, setMousePosition] = useState<Position>({ x: 0, y: 0 });
	const [localMousePosition, setLocalMousePosition] = useState<Position>({ x: 0, y: 0 });
	const [dragging, setDragging] = useState(false);
	const [scale, setScale] = useState(1);
	const [blocks, setBlocks] = useState<Block[]>([]);

	const [cssCursor, setCssCursor] = useState("grab");
	const [tool, setTool] = useState<Tool>("hand");
	const [selectedBlock, setSelectedBlock] = useState("stone");

	const onToolChange = (value: Tool) => {
		setTool(value);
		setCssCursor(value === "hand" ? "grab" : "pointer");
	};

	const onMouseMove = (e: React.MouseEvent) => {
		if (dragging) {
			if (tool === "hand") {
				setCoords((prevCoords) => ({
					x: prevCoords.x + e.movementX,
					y: prevCoords.y + e.movementY,
				}));
			}

			onMouseDown();
		}

		const stageRect = stageContainerRef.current?.getBoundingClientRect();
		if (!stageRect) return;

		const mouseX = e.clientX - stageRect.left;
		const mouseY = e.clientY - stageRect.top;

		setMousePosition({
			x: mouseX,
			y: mouseY,
		});
		setLocalMousePosition({
			x: (mouseX - coords.x) / scale,
			y: (mouseY - coords.y) / scale,
		});
	};

	const onMouseDown = () => {
		setDragging(true);

		const blockX = Math.floor(localMousePosition.x / 16);
		const blockY = Math.floor(localMousePosition.y / 16);
		const updatedBlocks = blocks.filter((b) => !(b.x === blockX && b.y === blockY));

		switch (tool) {
			case "hand":
				setCssCursor("grabbing");
				break;
			case "pencil": {
				setBlocks([
					...updatedBlocks,
					{
						name: selectedBlock,
						x: blockX,
						y: blockY,
					},
				]);
				break;
			}
			case "eraser":
				setBlocks(updatedBlocks);
				break;
		}
	};

	const onMouseUp = () => {
		setDragging(false);
		setCssCursor(tool === "hand" ? "grab" : "pointer");
	};

	const onWheel = (e: React.WheelEvent) => {
		e.preventDefault();

		const scaleChange = e.deltaY > 0 ? -0.1 : 0.1;
		const newScale = Math.min(Math.max(scale + scaleChange, 0.25), 16);

		setScale(newScale);
		setCoords({
			x: mousePosition.x - localMousePosition.x * newScale,
			y: mousePosition.y - localMousePosition.y * newScale,
		});
	};

	useEffect(() => {
		const resizeCanvas = () => {
			if (stageContainerRef.current) {
				setStageSize({
					width: stageContainerRef.current.offsetWidth,
					height: stageContainerRef.current.offsetHeight,
				});
			}
		};

		resizeCanvas();
		window.addEventListener("resize", resizeCanvas);
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

			<ToggleGroup
				type="single"
				value={tool}
				onValueChange={onToolChange}
				className="flex flex-col justify-start py-1 border-r border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950"
			>
				<ToggleGroupItem value="hand">
					<Hand />
				</ToggleGroupItem>
				<ToggleGroupItem value="pencil">
					<Pencil />
				</ToggleGroupItem>
				<ToggleGroupItem value="eraser">
					<Eraser />
				</ToggleGroupItem>
			</ToggleGroup>

			<div ref={stageContainerRef} className="relative w-full h-full">
				<Stage
					width={stageSize.width}
					height={stageSize.height}
					onMouseMove={onMouseMove}
					onMouseDown={onMouseDown}
					onMouseUp={onMouseUp}
					onWheel={onWheel}
					style={{ cursor: cssCursor }}
				>
					<Container x={coords.x} y={coords.y} scale={scale}>
						<Blocks blocks={blocks} setBlocks={setBlocks} />
						<Cursor localMousePosition={localMousePosition} />
					</Container>
				</Stage>

				<CursorInformation localMousePosition={localMousePosition} blocks={blocks} />
			</div>
		</main>
	);
}

export default App;
