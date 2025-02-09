import React, { useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";

import * as PIXI from "pixi.js";
import { Container, Stage } from "@pixi/react";

import { CanvasContext } from "@/context/Canvas";
import { HistoryContext } from "@/context/History";
import { SelectionContext } from "@/context/Selection";
import { SettingsContext } from "@/context/Settings";
import { TexturesContext } from "@/context/Textures";
import { ThemeContext } from "@/context/Theme";
import { ToolContext } from "@/context/Tool";

import { useTextures } from "@/hooks/useTextures";
import { useBlockData } from "@/hooks/useBlockData";
import { useClipboard } from "@/hooks/useClipboard";

import { useMoveTool } from "@/hooks/tools/move";
import { useRectangleSelectTool } from "@/hooks/tools/rectangle-select";
import { useLassoTool } from "@/hooks/tools/lasso";
import { useMagicWandTool } from "@/hooks/tools/magic-wand";
import { usePencilTool } from "@/hooks/tools/pencil";
import { useEraserTool } from "@/hooks/tools/eraser";
import { usePaintBucketTool } from "@/hooks/tools/paint-bucket";
import { useEyedropperTool } from "@/hooks/tools/eyedropper";
import { useZoomTool } from "@/hooks/tools/zoom";

import Blocks from "./Blocks";
import Cursor from "./Cursor";
import Selection from "./Selection";
import Grid from "./Grid";
import CanvasBorder from "./CanvasBorder";

import CursorInformation from "./information/Cursor";
import CanvasInformation from "./information/Canvas";
import SelectionBar from "./SelectionBar";

// Set scale mode to NEAREST
PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;

function Canvas() {
	const { stageSize, canvasSize, blocks, coords, scale, version, setStageSize, setBlocks, setCoords, setScale } = useContext(CanvasContext);
	const { addHistory, undo, redo } = useContext(HistoryContext);
	const { selectionCoords, selectionLayerBlocks, setSelectionCoords, setSelectionLayerBlocks } = useContext(SelectionContext);
	const { settings } = useContext(SettingsContext);
	const { missingTexture } = useContext(TexturesContext);
	const { isDark } = useContext(ThemeContext);
	const { tool, radius, selectedBlock, setTool } = useContext(ToolContext);

	const textures = useTextures(version);
	const blockData = useBlockData(version);
	const stageContainerRef = useRef<HTMLDivElement>(null);

	const [mousePosition, setMousePosition] = useState<Position>({ x: 0, y: 0 });
	const [mouseCoords, setMouseCoords] = useState<Position>({ x: 0, y: 0 });
	const mouseMovementRef = useRef<Position>({ x: 0, y: 0 });
	const [dragging, setDragging] = useState(false);
	const dragStartCoordsRef = useRef<Position>({ x: 0, y: 0 });

	const holdingShiftRef = useRef(false);
	const holdingAltRef = useRef(false);
	const oldToolRef = useRef<Tool>();
	const [cssCursor, setCssCursor] = useState("crosshair");

	const startBlocksRef = useRef<Block[]>([]);
	const startSelectionCoordsRef = useRef<CoordinateArray>([]);

	const clipboard = useClipboard();

	const zoom = useCallback(
		(newScale: number) => {
			setScale(newScale);
			setCoords({
				x: mousePosition.x - ((mousePosition.x - coords.x) / scale) * newScale,
				y: mousePosition.y - ((mousePosition.y - coords.y) / scale) * newScale,
			});
		},
		[coords, mousePosition, scale, setCoords, setScale]
	);

	const moveTool = useMoveTool(mouseMovementRef.current);
	const rectangleSelectTool = useRectangleSelectTool(mouseCoords, dragStartCoordsRef.current, holdingShiftRef.current);
	const lassoTool = useLassoTool(mouseCoords, holdingAltRef.current);
	const magicWandTool = useMagicWandTool(mouseCoords, holdingShiftRef.current, holdingAltRef.current);
	const pencilTool = usePencilTool(mouseCoords);
	const eraserTool = useEraserTool(mouseCoords);
	const paintBucketTool = usePaintBucketTool(mouseCoords);
	const eyedropperTool = useEyedropperTool(mouseCoords);
	const zoomTool = useZoomTool(zoom, holdingAltRef.current);

	const visibleArea = useMemo(() => {
		const blockSize = 16 * scale;

		const visibleWidthBlocks = Math.ceil(stageSize.width / blockSize);
		const visibleHeightBlocks = Math.ceil(stageSize.height / blockSize);

		const startX = Math.floor(-coords.x / blockSize);
		const startY = Math.floor(-coords.y / blockSize);

		return {
			startX,
			startY,
			endX: startX + visibleWidthBlocks + 1,
			endY: startY + visibleHeightBlocks + 1,
		};
	}, [coords, scale, stageSize]);

	const visibleBlocks = useMemo(() => {
		return blocks.filter(
			(block) => block.x >= visibleArea.startX && block.x < visibleArea.endX && block.y >= visibleArea.startY && block.y < visibleArea.endY
		);
	}, [blocks, visibleArea]);

	const updateCssCursor = useCallback(() => {
		const cursorMapping: Partial<Record<Tool, string>> = {
			hand: dragging ? "grab" : "grabbing",
			move: "move",
			zoom: holdingAltRef.current ? "zoom-out" : "zoom-in",
		};

		setCssCursor(cursorMapping[tool] || "crosshair");
	}, [dragging, holdingAltRef, tool, setCssCursor]);

	const onToolUse = useCallback(() => {
		const tools: Partial<Record<Tool, { use: () => void }>> = {
			move: moveTool,
			"rectangle-select": rectangleSelectTool,
			lasso: lassoTool,
			pencil: pencilTool,
			eraser: eraserTool,
		};

		// Switch to eraser tool if selected block is air when using pencil
		if (tool === "pencil" && selectedBlock === "air") {
			eraserTool.use();
			return;
		}

		tools[tool]?.use();
	}, [tool, selectedBlock, moveTool, lassoTool, pencilTool, eraserTool, rectangleSelectTool]);

	const onMouseMove = useCallback(
		(e: React.MouseEvent) => {
			if (!stageContainerRef.current) return;

			const oldMouseCoords = mouseCoords;

			const rect = stageContainerRef.current.getBoundingClientRect();
			const mouseX = e.clientX - rect.left;
			const mouseY = e.clientY - rect.top;

			const newMouseCoords = {
				x: Math.floor((mouseX - coords.x) / (16 * scale)),
				y: Math.floor((mouseY - coords.y) / (16 * scale)),
			};

			setMousePosition({
				x: mouseX,
				y: mouseY,
			});
			setMouseCoords(newMouseCoords);

			mouseMovementRef.current = {
				x: newMouseCoords.x - oldMouseCoords.x,
				y: newMouseCoords.y - oldMouseCoords.y,
			};

			if (dragging) {
				if (tool === "hand") {
					setCoords((prevCoords) => ({
						x: prevCoords.x + e.movementX,
						y: prevCoords.y + e.movementY,
					}));
				}

				onToolUse();
			}
		},
		[dragging, coords, scale, tool, mouseCoords, onToolUse, setCoords]
	);

	const onMouseDown = useCallback(() => {
		setDragging(true);
		onToolUse();
		updateCssCursor();

		dragStartCoordsRef.current = mouseCoords;
		startBlocksRef.current = [...blocks];
		startSelectionCoordsRef.current = [...selectionCoords];

		// Clear selection on click
		if (tool === "rectangle-select") setSelectionCoords([]);
	}, [onToolUse, updateCssCursor, mouseCoords, blocks, selectionCoords, tool, setSelectionCoords]);

	const onMouseUp = useCallback(() => {
		setDragging(false);
		updateCssCursor();

		// History entries for pencil and eraser
		if (tool == "pencil" || tool == "eraser") {
			// startBlocksRef will mutate if we pass it directly
			const prevBlocks = [...startBlocksRef.current];

			addHistory(
				tool == "pencil" ? "Pencil" : "Eraser",
				() => setBlocks([...blocks]),
				() => setBlocks([...prevBlocks])
			);
		}

		if (tool == "rectangle-select" || tool == "magic-wand" || tool == "lasso") {
			// startSelectionCoordsRef will mutate if we pass it directly
			const prevSelection = [...startSelectionCoordsRef.current];

			addHistory(
				tool == "rectangle-select" ? "Rectangle Select" : tool == "lasso" ? "Lasso" : "Magic Wand",
				() => setSelectionCoords([...selectionCoords]),
				() => setSelectionCoords([...prevSelection])
			);
		}
	}, [updateCssCursor, blocks, tool, addHistory, setBlocks, selectionCoords, setSelectionCoords]);

	const onWheel = useCallback(
		(e: React.WheelEvent) => {
			e.preventDefault();
			const scaleChange = e.deltaY > 0 ? -0.1 : 0.1;
			const newScale = Math.min(Math.max(scale + scaleChange * scale, 0.1), 32);
			zoom(newScale);
		},
		[scale, zoom]
	);

	const onClick = useCallback(() => {
		const tools: Partial<Record<Tool, { use: () => void }>> = {
			"magic-wand": magicWandTool,
			"paint-bucket": paintBucketTool,
			eyedropper: eyedropperTool,
			zoom: zoomTool,
		};

		tools[tool]?.use();
	}, [tool, magicWandTool, paintBucketTool, eyedropperTool, zoomTool]);

	const onKeyDown = useCallback(
		async (e: React.KeyboardEvent) => {
			switch (e.key) {
				case "Escape":
					setBlocks(startBlocksRef.current);
					setSelectionLayerBlocks([]);
					break;
				case "Enter": {
					const combinedBlocks = [...blocks, ...selectionLayerBlocks];
					const uniqueBlocks = Array.from(new Map(combinedBlocks.map((block) => [`${block.x},${block.y}`, block])).values());

					setBlocks(uniqueBlocks);
					setSelectionLayerBlocks([]);

					addHistory(
						"Move Selection",
						() => setBlocks(uniqueBlocks),
						() => setBlocks(startBlocksRef.current)
					);
					break;
				}
				case " ": // Space
					setDragging(true);
					oldToolRef.current = tool;
					setTool("hand");
					setCssCursor("grabbing");
					break;
				case "Shift":
					holdingShiftRef.current = true;
					break;
				case "Alt":
					holdingAltRef.current = true;
					if (tool === "zoom") setCssCursor("zoom-out");
					break;
				case "Delete":
					setBlocks((prev) => {
						const deletedBlocks = prev.filter((b) => !selectionCoords.some(([x2, y2]) => x2 === b.x && y2 === b.y));
						addHistory(
							"Delete",
							() => setBlocks(deletedBlocks),
							() => setBlocks(prev)
						);

						return deletedBlocks;
					});
					break;
				case "a": {
					if (!e.ctrlKey) return;
					e.preventDefault();

					const newSelection: CoordinateArray = [];

					for (let x = canvasSize.minX; x < canvasSize.maxX; x++) {
						for (let y = canvasSize.minY; y < canvasSize.maxY; y++) {
							newSelection.push([x, y]);
						}
					}

					setSelectionCoords((prev) => {
						const prevSelection = [...prev];
						addHistory(
							"Select All",
							() => setSelectionCoords(newSelection),
							() => setSelectionCoords(prevSelection)
						);

						return newSelection;
					});
					break;
				}
				case "z":
					if (!e.ctrlKey) return;
					undo();
					break;
				case "y":
					if (!e.ctrlKey) return;
					redo();
					break;
				case "c":
					if (!e.ctrlKey) return;
					clipboard.copy();
					break;
				case "v":
					if (!e.ctrlKey) return;
					clipboard.paste();
					break;
				case "1":
					setTool("hand");
					break;
				case "2":
					setTool("move");
					break;
				case "3":
					setTool("rectangle-select");
					break;
				case "4":
					setTool("lasso");
					break;
				case "5":
					setTool("magic-wand");
					break;
				case "6":
					setTool("pencil");
					break;
				case "7":
					setTool("eraser");
					break;
				case "8":
					setTool("paint-bucket");
					break;
				case "9":
					setTool("eyedropper");
					break;
				case "0":
					setTool("zoom");
					break;
				case "ArrowRight": {
					// Debug key combination
					if (!e.altKey && !e.shiftKey) return;

					const newBlocks: Block[] = [];

					Object.keys(blockData).forEach((name, index) => {
						const x = index % 16;
						const y = Math.floor(index / 16);
						newBlocks.push({ name, x, y });
					});

					setBlocks(newBlocks);
					break;
				}
			}
		},
		[
			tool,
			selectionCoords,
			canvasSize,
			blockData,
			blocks,
			selectionLayerBlocks,
			clipboard,
			setBlocks,
			setSelectionCoords,
			setSelectionLayerBlocks,
			setTool,
			addHistory,
			redo,
			undo,
		]
	);

	const onKeyUp = useCallback(
		(e: React.KeyboardEvent) => {
			switch (e.key) {
				case " ": // Space
					setDragging(false);
					setCssCursor("grab");

					if (!oldToolRef.current) return;
					setTool(oldToolRef.current);
					break;
				case "Shift":
					holdingShiftRef.current = false;
					break;
				case "Alt":
					holdingAltRef.current = false;
					if (tool === "zoom") setCssCursor("zoom-in");
					break;
			}
		},
		[setCssCursor, setTool, tool]
	);

	// Tool cursor handler
	useEffect(() => {
		const cursorMapping: Partial<Record<Tool, string>> = {
			hand: "grab",
			move: "move",
			zoom: "zoom-in",
		};

		setCssCursor(cursorMapping[tool] || "crosshair");
	}, [tool]);

	// Resize canvas handler
	useEffect(() => {
		const container = stageContainerRef.current;
		if (!container) return;

		const resizeCanvas = () => {
			setStageSize({
				width: container.offsetWidth,
				height: container.offsetHeight,
			});
		};

		const resizeObserver = new ResizeObserver(resizeCanvas);
		resizeObserver.observe(container);

		resizeCanvas();
		return () => resizeObserver.disconnect();
	}, [stageContainerRef, setStageSize]);

	// Window events handler
	useEffect(() => {
		const onBeforeUnload = (e: BeforeUnloadEvent) => {
			e.preventDefault();
		};

		window.addEventListener("beforeunload", onBeforeUnload);
		return () => {
			window.removeEventListener("beforeunload", onBeforeUnload);
		};
	}, [onKeyDown, onKeyUp]);

	return (
		<div ref={stageContainerRef} style={{ cursor: cssCursor }} className="relative w-full h-full bg-zinc-200 dark:bg-black">
			<Stage
				width={stageSize.width}
				height={stageSize.height}
				tabIndex={0}
				onKeyDown={onKeyDown}
				onKeyUp={onKeyUp}
				onMouseMove={onMouseMove}
				onMouseDown={onMouseDown}
				onMouseUp={onMouseUp}
				onWheel={onWheel}
				onClick={onClick}
				options={{ backgroundAlpha: 0 }}
			>
				<Blocks blocks={visibleBlocks} missingTexture={missingTexture} textures={textures} coords={coords} scale={scale} version={version} />
				{/* Selection layer */}
				<Blocks
					isSelectionLayer
					blocks={selectionLayerBlocks}
					missingTexture={missingTexture}
					textures={textures}
					coords={coords}
					scale={scale}
					version={version}
				/>

				<Container x={coords.x} y={coords.y} scale={scale}>
					{settings.canvasBorder && <CanvasBorder canvasSize={canvasSize} isDark={isDark} />}
					<Cursor mouseCoords={mouseCoords} radius={radius} isDark={isDark} />
					<Selection selection={selectionCoords} coords={coords} scale={scale} isDark={isDark} />
				</Container>

				{settings.grid && (
					<Container filters={[new PIXI.AlphaFilter(0.1)]}>
						<Grid stageSize={stageSize} coords={coords} scale={scale} isDark={isDark} />
					</Container>
				)}
			</Stage>

			<CursorInformation mouseCoords={mouseCoords} />
			<CanvasInformation />

			<SelectionBar startBlocks={startBlocksRef.current} startSelectionCoords={startSelectionCoordsRef.current} />
		</div>
	);
}

export default Canvas;
