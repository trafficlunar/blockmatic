import React, { useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";

import * as PIXI from "pixi.js";
import { Container, Stage } from "@pixi/react";

import { CanvasContext } from "@/context/Canvas";
import { SettingsContext } from "@/context/Settings";
import { TexturesContext } from "@/context/Textures";
import { ThemeContext } from "@/context/Theme";
import { ToolContext } from "@/context/Tool";

import { useTextures } from "@/hooks/useTextures";

import Blocks from "./Blocks";
import Cursor from "./Cursor";
import SelectionBox from "./SelectionBox";
import Grid from "./Grid";
import CanvasBorder from "./CanvasBorder";

import CursorInformation from "./information/Cursor";
import CanvasInformation from "./information/Canvas";

import welcomeBlocksData from "@/data/welcome.json";

// Set scale mode to NEAREST
PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;

function Canvas() {
	const { stageSize, canvasSize, blocks, coords, scale, version, setStageSize, setBlocks, setCoords, setScale } = useContext(CanvasContext);
	const { settings } = useContext(SettingsContext);
	const { missingTexture, solidTextures } = useContext(TexturesContext);
	const { isDark } = useContext(ThemeContext);
	const { tool, radius, selectedBlock, selectionCoords, cssCursor, setTool, setSelectedBlock, setSelectionCoords, setCssCursor } =
		useContext(ToolContext);

	const textures = useTextures(version);
	const stageContainerRef = useRef<HTMLDivElement>(null);

	const [mousePosition, setMousePosition] = useState<Position>({ x: 0, y: 0 });
	const [mouseCoords, setMouseCoords] = useState<Position>({ x: 0, y: 0 });
	const mouseMovementRef = useRef<Position>();
	const [dragging, setDragging] = useState(false);
	const dragStartCoordsRef = useRef<Position>();

	const [holdingAlt, setHoldingAlt] = useState(false);
	const oldToolRef = useRef<Tool>();
	const selectionCoordsRef = useRef<CoordinateArray>(selectionCoords);

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
			zoom: holdingAlt ? "zoom-out" : "zoom-in",
		};

		setCssCursor(cursorMapping[tool] || "crosshair");
	}, [dragging, holdingAlt, tool, setCssCursor]);

	const onToolUse = useCallback(() => {
		// If number is odd, cursor is in the center
		// if number is even, cursor is in the top-left corner
		const getRadiusPosition = (): Position => {
			const halfSize = Math.floor(radius / 2);
			const x = mouseCoords.x - (radius % 2 === 0 ? 0 : halfSize);
			const y = mouseCoords.y - (radius % 2 === 0 ? 0 : halfSize);
			return { x, y };
		};

		// Check if a block is within the selection
		const isInSelection = (x: number, y: number): boolean => {
			if (selectionCoords.length !== 0) {
				return selectionCoords.some(([x2, y2]) => x2 === x && y2 === y);
			}
			return false;
		};

		const eraseTool = () => {
			// Fixes Infinity and NaN errors when no blocks are present
			if (blocks.length == 1) return;

			const radiusPosition = getRadiusPosition();
			const updated = blocks.filter((block) => {
				const withinRadius =
					block.x >= radiusPosition.x && block.x < radiusPosition.x + radius && block.y >= radiusPosition.y && block.y < radiusPosition.y + radius;
				return !withinRadius || !isInSelection(block.x, block.y);
			});

			setBlocks(updated);
		};

		switch (tool) {
			case "move": {
				const mouseMovement = mouseMovementRef.current;
				if (!mouseMovement) return;

				// Increase each coordinate in the selection by the mouse movement
				setSelectionCoords((prev) => prev.map(([x, y]) => [x + mouseMovement.x, y + mouseMovement.y]));

				// Increase each block in the selection by the mouse movement
				setBlocks((prev) =>
					prev.map((block) => {
						if (isInSelection(block.x, block.y)) {
							return {
								...block,
								x: block.x + mouseMovement.x,
								y: block.y + mouseMovement.y,
							};
						}

						return block;
					})
				);
				break;
			}
			case "lasso": {
				setSelectionCoords((prev) => {
					const exists = prev.some(([x2, y2]) => x2 === mouseCoords.x && y2 === mouseCoords.y);
					return exists ? prev : [...prev, [mouseCoords.x, mouseCoords.y]];
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
						if (isInSelection(tileX, tileY)) {
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
	}, [tool, mouseCoords, selectedBlock, blocks, radius, selectionCoords, setSelectionCoords, setBlocks]);

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

							// todo: fix dragging from bottom to top
							for (let x = dragStartCoords.x; x < mouseCoords.x + 1; x++) {
								for (let y = dragStartCoords.y; y < mouseCoords.y + 1; y++) {
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
		[dragging, coords, scale, tool, mouseCoords, onToolUse, setCoords, setSelectionCoords]
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
			case "eyedropper": {
				const mouseBlock = blocks.find((block) => block.x === mouseCoords.x && block.y === mouseCoords.y);
				if (mouseBlock) setSelectedBlock(mouseBlock.name);
				break;
			}
			case "zoom": {
				const scaleChange = holdingAlt ? -0.1 : 0.1;
				const newScale = Math.min(Math.max(scale + scaleChange * scale, 0.1), 32);
				zoom(newScale);
				break;
			}

			default:
				break;
		}
	}, [tool, holdingAlt, scale, mouseCoords, blocks, setSelectedBlock, zoom]);

	const onKeyDown = (e: KeyboardEvent) => {
		switch (e.key) {
			case " ": // Space
				setDragging(true);
				oldToolRef.current = tool;
				setTool("hand");
				setCssCursor("grabbing");
				break;
			case "Alt":
				setHoldingAlt(true);
				setCssCursor("zoom-out");
				break;
			case "Delete": {
				setBlocks((prev) => prev.filter((b) => !selectionCoordsRef.current.some(([x2, y2]) => x2 === b.x && y2 === b.y)));
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
				setTool("pencil");
				break;
			case "6":
				setTool("eraser");
				break;
			case "7":
				setTool("eyedropper");
				break;
			case "8":
				setTool("zoom");
				break;
		}
	};

	const onKeyUp = (e: KeyboardEvent) => {
		switch (e.key) {
			case " ": // Space
				if (!oldToolRef.current) return;
				setDragging(false);
				setCssCursor("grab");
				setTool(oldToolRef.current);
				break;
			case "Alt":
				setHoldingAlt(false);
				setCssCursor("zoom-in");
				break;
		}
	};

	useEffect(() => {
		selectionCoordsRef.current = selectionCoords;
	}, [selectionCoords]);

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
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [stageContainerRef]);

	useEffect(() => {
		setBlocks(welcomeBlocksData);

		window.addEventListener("keydown", onKeyDown);
		window.addEventListener("keyup", onKeyUp);
		window.addEventListener("beforeunload", (e) => {
			e.preventDefault();
		});

		return () => {
			window.removeEventListener("keydown", onKeyDown);
			window.removeEventListener("keyup", onKeyUp);
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<div
			ref={stageContainerRef}
			onContextMenu={() => null}
			style={{ cursor: cssCursor }}
			className="relative w-full h-full bg-zinc-200 dark:bg-black"
		>
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
				<Blocks
					blocks={visibleBlocks}
					missingTexture={missingTexture}
					textures={textures}
					solidTextures={solidTextures}
					coords={coords}
					scale={scale}
					version={version}
				/>

				<Container x={coords.x} y={coords.y} scale={scale}>
					{settings.canvasBorder && <CanvasBorder canvasSize={canvasSize} isDark={isDark} />}
					<Cursor mouseCoords={mouseCoords} radius={radius} isDark={isDark} />
					<SelectionBox selection={selectionCoords} coords={coords} scale={scale} isDark={isDark} />
				</Container>

				{settings.grid && (
					<Container filters={[new PIXI.AlphaFilter(0.1)]}>
						<Grid stageSize={stageSize} coords={coords} scale={scale} isDark={isDark} />
					</Container>
				)}
			</Stage>

			<CursorInformation mouseCoords={mouseCoords} />
			<CanvasInformation />
		</div>
	);
}

export default Canvas;
