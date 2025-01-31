import React, { useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";

import * as PIXI from "pixi.js";
import { Container, Stage } from "@pixi/react";

import { CanvasContext } from "@/context/Canvas";
import { SelectionContext } from "@/context/Selection";
import { SettingsContext } from "@/context/Settings";
import { TexturesContext } from "@/context/Textures";
import { ThemeContext } from "@/context/Theme";
import { ToolContext } from "@/context/Tool";

import { useTextures } from "@/hooks/useTextures";
import { useBlockData } from "@/hooks/useBlockData";

import * as selection from "@/utils/selection";
import * as clipboard from "@/utils/clipboard";

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
	const {
		coords: selectionCoords,
		layerBlocks: selectionLayerBlocks,
		setCoords: setSelectionCoords,
		setLayerBlocks: setSelectionLayerBlocks,
	} = useContext(SelectionContext);
	const { settings } = useContext(SettingsContext);
	const { missingTexture } = useContext(TexturesContext);
	const { isDark } = useContext(ThemeContext);
	const { tool, radius, selectedBlock, setTool, setSelectedBlock } = useContext(ToolContext);

	const textures = useTextures(version);
	const blockData = useBlockData(version);
	const stageContainerRef = useRef<HTMLDivElement>(null);

	const [mousePosition, setMousePosition] = useState<Position>({ x: 0, y: 0 });
	const [mouseCoords, setMouseCoords] = useState<Position>({ x: 0, y: 0 });
	const mouseMovementRef = useRef<Position>();
	const [dragging, setDragging] = useState(false);
	const dragStartCoordsRef = useRef<Position>();

	const holdingShiftRef = useRef(false);
	const holdingAltRef = useRef(false);
	const oldToolRef = useRef<Tool>();
	const [cssCursor, setCssCursor] = useState("crosshair");

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

	const updateCssCursor = useCallback(() => {
		const cursorMapping: Partial<Record<Tool, string>> = {
			hand: dragging ? "grab" : "grabbing",
			move: "move",
			zoom: holdingAltRef.current ? "zoom-out" : "zoom-in",
		};

		setCssCursor(cursorMapping[tool] || "crosshair");
	}, [dragging, holdingAltRef, tool, setCssCursor]);

	const onToolUse = useCallback(() => {
		// If number is odd, cursor is in the center
		// if number is even, cursor is in the top-left corner
		const getRadiusPosition = (): Position => {
			const halfSize = Math.floor(radius / 2);
			const x = mouseCoords.x - (radius % 2 === 0 ? 0 : halfSize);
			const y = mouseCoords.y - (radius % 2 === 0 ? 0 : halfSize);
			return { x, y };
		};

		const eraseTool = () => {
			const radiusPosition = getRadiusPosition();
			const updated = blocks.filter((block) => {
				const withinRadius =
					block.x >= radiusPosition.x && block.x < radiusPosition.x + radius && block.y >= radiusPosition.y && block.y < radiusPosition.y + radius;
				return !withinRadius || !selection.isIn(selectionCoords, block.x, block.y);
			});

			setBlocks(updated);
		};

		switch (tool) {
			case "move": {
				const mouseMovement = mouseMovementRef.current;
				if (!mouseMovement) return; // Get all blocks within selection
				const selectorBlocks = selectionCoords
					.map((coord) => {
						const [x, y] = coord;
						return blocks.find((block) => block.x === x && block.y === y);
					})
					.filter((block) => block !== undefined);

				// Write to clipboard
				navigator.clipboard.writeText(JSON.stringify(selectorBlocks));

				// If there is no selection currently being moved...
				if (selectionLayerBlocks.length == 0) {
					const result: Block[] = [];

					setBlocks((prev) =>
						prev.filter((b) => {
							const isSelected = selection.isIn(selectionCoords, b.x, b.y);

							// Add blocks in the selection coords to the selection layer
							if (isSelected) result.push(b);

							// Remove blocks originally there
							return !isSelected;
						})
					);
					setSelectionLayerBlocks(result);
				}

				// Increase each coordinate in the selection by the mouse movement
				setSelectionCoords((prev) => prev.map(([x, y]) => [x + mouseMovement.x, y + mouseMovement.y]));
				setSelectionLayerBlocks((prev) => prev.map((b) => ({ ...b, x: b.x + mouseMovement.x, y: b.y + mouseMovement.y })));
				break;
			}
			case "lasso": {
				setSelectionCoords((prev) => {
					const radiusPosition = getRadiusPosition();
					const radiusCoords: CoordinateArray = [];

					for (let x = 0; x < radius; x++) {
						for (let y = 0; y < radius; y++) {
							const tileX = radiusPosition.x + x;
							const tileY = radiusPosition.y + y;

							const exists = prev.some(([x2, y2]) => x2 === tileX && y2 === tileY);
							if ((holdingAltRef.current && exists) || !exists) radiusCoords.push([tileX, tileY]);
						}
					}

					if (holdingAltRef.current) {
						return prev.filter(([x, y]) => !radiusCoords.some(([x2, y2]) => x2 === x && y2 === y));
					} else {
						return [...prev, ...radiusCoords];
					}
				});
				break;
			}
			case "pencil": {
				if (selectedBlock == "air") {
					eraseTool();
					break;
				}

				const radiusPosition = getRadiusPosition();
				const radiusBlocks: Block[] = [];

				for (let x = 0; x < radius; x++) {
					for (let y = 0; y < radius; y++) {
						const tileX = radiusPosition.x + x;
						const tileY = radiusPosition.y + y;

						// Only add blocks within the selection
						if (selection.isIn(selectionCoords, tileX, tileY)) {
							radiusBlocks.push({
								name: selectedBlock,
								x: tileX,
								y: tileY,
							});
						}
					}
				}

				const mergedBlocks = blocks.filter((block) => {
					return !radiusBlocks.some((newBlock) => block.x === newBlock.x && block.y === newBlock.y);
				});

				setBlocks([...mergedBlocks, ...radiusBlocks]);
				break;
			}
			case "eraser": {
				eraseTool();
				break;
			}
		}
	}, [
		tool,
		mouseCoords,
		selectedBlock,
		blocks,
		radius,
		selectionCoords,
		selectionLayerBlocks,
		setSelectionCoords,
		setSelectionLayerBlocks,
		setBlocks,
	]);

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
				switch (tool) {
					case "hand":
						setCoords((prevCoords) => ({
							x: prevCoords.x + e.movementX,
							y: prevCoords.y + e.movementY,
						}));
						break;
					case "rectangle-select": {
						const dragStartCoords = dragStartCoordsRef.current;
						if (!dragStartCoords) return;

						setSelectionCoords(() => {
							const newSelection: CoordinateArray = [];

							const startX = Math.min(dragStartCoords.x, mouseCoords.x);
							let endX = Math.max(dragStartCoords.x, mouseCoords.x);
							const startY = Math.min(dragStartCoords.y, mouseCoords.y);
							let endY = Math.max(dragStartCoords.y, mouseCoords.y);

							const isRadiusEven = radius == 1 || radius % 2 == 0;
							const radiusOffset = isRadiusEven ? radius : radius - 1;

							// If holding shift, create a square selection
							if (holdingShiftRef.current) {
								const width = Math.abs(endX - startX);
								const height = Math.abs(endY - startY);
								const size = Math.max(width, height);

								endX = startX + (endX < startX ? -size : size);
								endY = startY + (endY < startY ? -size : size);
							}

							for (let x = startX; x < endX + radiusOffset; x++) {
								for (let y = startY; y < endY + radiusOffset; y++) {
									newSelection.push([x, y]);
								}
							}

							return newSelection;
						});
						break;
					}
				}

				onToolUse();
			}
		},
		[dragging, coords, scale, tool, mouseCoords, onToolUse, setCoords, setSelectionCoords, radius]
	);

	const onMouseDown = useCallback(() => {
		setDragging(true);
		onToolUse();
		updateCssCursor();

		dragStartCoordsRef.current = mouseCoords;

		// Clear selection on click
		if (tool === "rectangle-select") setSelectionCoords([]);
	}, [onToolUse, updateCssCursor, mouseCoords, tool, setSelectionCoords]);

	const onMouseUp = useCallback(() => {
		setDragging(false);
		updateCssCursor();
	}, [updateCssCursor]);

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
		switch (tool) {
			case "magic-wand": {
				const visited = new Set<string>();
				const result: CoordinateArray = [];
				const startBlock = blocks.find((block) => block.x === mouseCoords.x && block.y === mouseCoords.y);
				const startName = startBlock ? startBlock.name : "air";

				function depthFirstSearch(x: number, y: number) {
					const key = `${x},${y}`;
					if (visited.has(key)) return;
					visited.add(key);

					const withinCanvas = x >= canvasSize.minX && x < canvasSize.maxX && y >= canvasSize.minY && y < canvasSize.maxY;
					if (!withinCanvas) return;

					result.push([x, y]);

					// Directions for adjacent blocks (up, down, left, right)
					const directions = [
						{ dx: 0, dy: 1 },
						{ dx: 0, dy: -1 },
						{ dx: 1, dy: 0 },
						{ dx: -1, dy: 0 },
					];

					for (const { dx, dy } of directions) {
						const newX = x + dx;
						const newY = y + dy;
						const adjacentBlock = blocks.find((b) => b.x === newX && b.y === newY);
						const adjacentName = adjacentBlock ? adjacentBlock.name : "air";

						if (adjacentName === startName) {
							depthFirstSearch(newX, newY);
						}
					}
				}

				depthFirstSearch(mouseCoords.x, mouseCoords.y);
				setSelectionCoords((prev) => {
					if (holdingAltRef.current) {
						// If holding alt, remove new magic wand selection
						return prev.filter(([x, y]) => !result.some(([x2, y2]) => x2 === x && y2 === y));
					} else if (holdingShiftRef.current) {
						// If holding shift, add magic wand selection to existing selection
						const existing = new Set(prev.map(([x, y]) => `${x},${y}`));
						const newCoords = result.filter(([x, y]) => !existing.has(`${x},${y}`));
						return [...prev, ...newCoords];
					}

					// If not holding alt or shift, replace the existing selection with the magic wand selection
					return result;
				});
				break;
			}
			case "eyedropper": {
				const mouseBlock = blocks.find((block) => block.x === mouseCoords.x && block.y === mouseCoords.y);
				if (mouseBlock) setSelectedBlock(mouseBlock.name);
				break;
			}
			case "zoom": {
				const scaleChange = holdingAltRef.current ? -0.1 : 0.1;
				const newScale = Math.min(Math.max(scale + scaleChange * scale, 0.1), 32);
				zoom(newScale);
				break;
			}

			default:
				break;
		}
	}, [tool, holdingAltRef, scale, mouseCoords, blocks, canvasSize, setSelectionCoords, setSelectedBlock, zoom]);

	const onKeyDown = useCallback(
		async (e: KeyboardEvent) => {
			switch (e.key) {
				case "Escape":
					setSelectionLayerBlocks([]);
					break;
				case "Enter":
					selection.confirm(blocks, selectionLayerBlocks, setBlocks, setSelectionLayerBlocks);
					break;
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
				case "Delete": {
					setBlocks((prev) => prev.filter((b) => !selectionCoords.some(([x2, y2]) => x2 === b.x && y2 === b.y)));
					break;
				}
				case "c": {
					if (!e.ctrlKey) return;
					clipboard.copy(selectionCoords, blocks);
					break;
				}
				case "v": {
					if (!e.ctrlKey) return;
					clipboard.paste(setSelectionLayerBlocks, setSelectionCoords, setTool);
					break;
				}
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
					setTool("eyedropper");
					break;
				case "9":
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
		[tool, blocks, selectionCoords, selectionLayerBlocks, blockData, setBlocks, setCssCursor, setSelectionLayerBlocks, setTool]
	);

	const onKeyUp = useCallback(
		(e: KeyboardEvent) => {
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
		window.addEventListener("keydown", onKeyDown);
		window.addEventListener("keyup", onKeyUp);
		window.addEventListener("beforeunload", (e) => {
			e.preventDefault();
		});

		return () => {
			window.removeEventListener("keydown", onKeyDown);
			window.removeEventListener("keyup", onKeyUp);
		};
	}, [onKeyDown, onKeyUp]);

	return (
		<div ref={stageContainerRef} style={{ cursor: cssCursor }} className="relative w-full h-full bg-zinc-200 dark:bg-black">
			<Stage
				width={stageSize.width}
				height={stageSize.height}
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

			<SelectionBar />
		</div>
	);
}

export default Canvas;
