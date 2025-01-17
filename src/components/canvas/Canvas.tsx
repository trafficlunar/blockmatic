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
	const { tool, radius, selectedBlock, cssCursor, setTool, setSelectedBlock, setCssCursor } = useContext(ToolContext);

	const textures = useTextures(version);
	const stageContainerRef = useRef<HTMLDivElement>(null);

	const [mousePosition, setMousePosition] = useState<Position>({ x: 0, y: 0 });
	const [mouseCoords, setMouseCoords] = useState<Position>({ x: 0, y: 0 });
	const mouseMovement = useRef<Position>();
	const [dragging, setDragging] = useState(false);

	const [holdingAlt, setHoldingAlt] = useState(false);
	const [oldTool, setOldTool] = useState<Tool>("hand");
	const [selectionBoxBounds, setSelectionBoxBounds] = useState<BoundingBox>({ minX: 0, minY: 0, maxX: 0, maxY: 0 });
	const selectionBoxBoundsRef = useRef<BoundingBox>();

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
		// Calculate the top-left position of the radius
		const getRadiusPosition = (): Position => {
			const halfSize = Math.floor(radius / 2);
			const x = mouseCoords.x - (radius % 2 === 0 ? 0 : halfSize);
			const y = mouseCoords.y - (radius % 2 === 0 ? 0 : halfSize);
			return { x, y };
		};

		// Check if a block is within the selection bounds
		const isInSelection = (x: number, y: number) => {
			return x >= selectionBoxBounds.minX && x < selectionBoxBounds.maxX && y >= selectionBoxBounds.minY && y < selectionBoxBounds.maxY;
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
				if (!mouseMovement.current) return;
				const { x: movementX, y: movementY } = mouseMovement.current;

				setSelectionBoxBounds((prev) => {
					const newBounds = {
						minX: prev.minX + movementX,
						minY: prev.minY + movementY,
						maxX: prev.maxX + movementX,
						maxY: prev.maxY + movementY,
					};

					selectionBoxBoundsRef.current = newBounds;
					return newBounds;
				});

				setBlocks((prev) => {
					return prev.map((block) => {
						if (
							block.x >= selectionBoxBounds.minX &&
							block.x < selectionBoxBounds.maxX &&
							block.y >= selectionBoxBounds.minY &&
							block.y < selectionBoxBounds.maxY
						) {
							return {
								...block,
								x: block.x + movementX,
								y: block.y + movementY,
							};
						}
						return block;
					});
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
	}, [tool, mouseCoords, selectedBlock, blocks, radius, selectionBoxBounds, setBlocks]);

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

			mouseMovement.current = {
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
					case "rectangle-select":
						setSelectionBoxBounds((prev) => {
							const newBounds = {
								...prev,
								maxX: mouseCoords.x + 1,
								maxY: mouseCoords.y + 1,
							};

							selectionBoxBoundsRef.current = newBounds;
							return newBounds;
						});
						break;
				}

				onToolUse();
			}
		},
		[dragging, coords, scale, tool, mouseCoords, onToolUse, setCoords, setSelectionBoxBounds]
	);

	const onMouseDown = useCallback(() => {
		setDragging(true);
		onToolUse();
		updateCssCursor();

		if (tool == "rectangle-select") {
			const newBounds = {
				minX: mouseCoords.x,
				minY: mouseCoords.y,
				maxX: mouseCoords.x,
				maxY: mouseCoords.y,
			};

			selectionBoxBoundsRef.current = newBounds;
			setSelectionBoxBounds(newBounds);
		}
	}, [onToolUse, updateCssCursor, tool, setSelectionBoxBounds, mouseCoords]);

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
		console.log(e.key);

		switch (e.key) {
			case " ": // Space
				setDragging(true);
				setOldTool(tool);
				setTool("hand");
				setCssCursor("grabbing");
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
				setTool("pencil");
				break;
			case "5":
				setTool("eraser");
				break;
			case "6":
				setTool("eyedropper");
				break;
			case "7":
				setTool("zoom");
				break;
			case "Alt":
				setHoldingAlt(true);
				setCssCursor("zoom-out");
				break;
			case "Delete": {
				if (!selectionBoxBoundsRef.current) return;
				const bounds = selectionBoxBoundsRef.current;

				setBlocks((prev) => prev.filter((b) => !(b.x >= bounds.minX && b.x < bounds.maxX && b.y >= bounds.minY && b.y < bounds.maxY)));
				break;
			}
		}
	};

	const onKeyUp = (e: KeyboardEvent) => {
		switch (e.key) {
			case " ": // Space
				setDragging(false);
				setCssCursor("grab");
				setTool(oldTool);
				break;
			case "Alt":
				setHoldingAlt(false);
				setCssCursor("zoom-in");
				break;
		}
	};

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
					<SelectionBox bounds={selectionBoxBounds} coords={coords} scale={scale} isDark={isDark} />
				</Container>

				{settings.grid && (
					<Container>
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
