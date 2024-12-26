import React, { useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";

import * as PIXI from "pixi.js";
import { Container, Stage } from "@pixi/react";

import { CanvasContext } from "@/context/Canvas";
import { ImageContext } from "@/context/Image";
import { LoadingContext } from "@/context/Loading";
import { SettingsContext } from "@/context/Settings";
import { TexturesContext } from "@/context/Textures";
import { ToolContext } from "@/context/Tool";

import Blocks from "./Blocks";
import Cursor from "./Cursor";
import Grid from "./Grid";
import CanvasBorder from "./CanvasBorder";

import CursorInformation from "./information/Cursor";
import CanvasInformation from "./information/Canvas";

import welcomeBlocksData from "@/data/welcome.json";

// Set scale mode to NEAREST
PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;

function Canvas() {
	const { stageSize, canvasSize, blocks, coords, scale, setStageSize, setBlocks, setCoords, setScale } = useContext(CanvasContext);
	const { image, imageDimensions } = useContext(ImageContext);
	const { setLoading } = useContext(LoadingContext);
	const { settings } = useContext(SettingsContext);
	const { missingTexture, textures, solidTextures } = useContext(TexturesContext);
	const { tool, radius, selectedBlock, cssCursor, setTool, setSelectedBlock, setCssCursor } = useContext(ToolContext);

	const stageContainerRef = useRef<HTMLDivElement>(null);

	const [mousePosition, setMousePosition] = useState<Position>({ x: 0, y: 0 });
	const [mouseCoords, setMouseCoords] = useState<Position>({ x: 0, y: 0 });
	const [dragging, setDragging] = useState(false);

	const [holdingAlt, setHoldingAlt] = useState(false);
	const [oldTool, setOldTool] = useState<Tool>("hand");

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

	const zoomToMousePosition = useCallback(
		(newScale: number) => {
			setCoords({
				x: mousePosition.x - ((mousePosition.x - coords.x) / scale) * newScale,
				y: mousePosition.y - ((mousePosition.y - coords.y) / scale) * newScale,
			});
		},
		[coords, mousePosition, scale, setCoords]
	);

	const updateCssCursor = useCallback(() => {
		const cursorMapping: Partial<Record<Tool, string>> = {
			hand: dragging ? "grab" : "grabbing",
			zoom: holdingAlt ? "zoom-out" : "zoom-in",
		};

		setCssCursor(cursorMapping[tool] || "pointer");
	}, [dragging, holdingAlt, tool, setCssCursor]);

	const onToolUse = useCallback(() => {
		// Radius calculation - if odd number cursor is in center, if even cursor is in top-left corner
		const getBlocksWithinRadius = (centerX: number, centerY: number, radius: number, blockName: string): Block[] => {
			const radiusBlocks = [];
			const halfSize = Math.floor(radius / 2);

			const startX = centerX - (radius % 2 === 0 ? 0 : halfSize);
			const startY = centerY - (radius % 2 === 0 ? 0 : halfSize);

			for (let x = 0; x < radius; x++) {
				for (let y = 0; y < radius; y++) {
					const tileX = startX + x;
					const tileY = startY + y;

					radiusBlocks.push({
						name: blockName,
						x: tileX,
						y: tileY,
					});
				}
			}

			return radiusBlocks;
		};

		switch (tool) {
			case "pencil": {
				const newBlocks = getBlocksWithinRadius(mouseCoords.x, mouseCoords.y, radius, selectedBlock);
				const mergedBlocks = blocks.filter((block) => {
					return !newBlocks.some((newBlock) => block.x === newBlock.x && block.y === newBlock.y);
				});

				setBlocks([...mergedBlocks, ...newBlocks]);
				break;
			}
			case "eraser": {
				// Fixes Infinity and NaN errors
				if (blocks.length == 1) break;

				const halfSize = Math.floor(radius / 2);
				const startX = mouseCoords.x - (radius % 2 === 0 ? 0 : halfSize);
				const startY = mouseCoords.y - (radius % 2 === 0 ? 0 : halfSize);

				const updated = blocks.filter((block) => {
					const withinSquare = block.x >= startX && block.x < startX + radius && block.y >= startY && block.y < startY + radius;
					return !withinSquare;
				});

				setBlocks(updated);
				break;
			}
		}
	}, [tool, mouseCoords, selectedBlock, setBlocks, blocks, radius]);

	const onMouseMove = useCallback(
		(e: React.MouseEvent) => {
			if (dragging) {
				if (tool === "hand") {
					setCoords((prevCoords) => ({
						x: prevCoords.x + e.movementX,
						y: prevCoords.y + e.movementY,
					}));
				}
				onToolUse();
			}

			if (!stageContainerRef.current) return;

			const rect = stageContainerRef.current.getBoundingClientRect();
			const mouseX = e.clientX - rect.left;
			const mouseY = e.clientY - rect.top;

			setMousePosition({
				x: mouseX,
				y: mouseY,
			});
			setMouseCoords({
				x: Math.floor((mouseX - coords.x) / (16 * scale)),
				y: Math.floor((mouseY - coords.y) / (16 * scale)),
			});
		},
		[dragging, coords, scale, tool, onToolUse, setCoords]
	);

	const onMouseDown = useCallback(() => {
		setDragging(true);
		onToolUse();
		updateCssCursor();
	}, [onToolUse, updateCssCursor]);

	const onMouseUp = useCallback(() => {
		setDragging(false);
		updateCssCursor();
	}, [updateCssCursor]);

	const onWheel = useCallback(
		(e: React.WheelEvent) => {
			e.preventDefault();
			const scaleChange = e.deltaY > 0 ? -0.1 : 0.1;
			const newScale = Math.min(Math.max(scale + scaleChange * scale, 0.1), 32);
			setScale(newScale);
			zoomToMousePosition(newScale);
		},
		[scale, zoomToMousePosition, setScale]
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
				setScale(newScale);
				zoomToMousePosition(newScale);
				break;
			}

			default:
				break;
		}
	}, [tool, holdingAlt, scale, mouseCoords, blocks, zoomToMousePosition, setScale, setSelectedBlock]);

	const onKeyDown = (e: KeyboardEvent) => {
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
				setTool("pencil");
				break;
			case "3":
				setTool("eraser");
				break;
			case "4":
				setTool("eyedropper");
				break;
			case "5":
				setTool("zoom");
				break;
			case "Alt":
				setHoldingAlt(true);
				setCssCursor("zoom-out");
				break;
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
		const resizeCanvas = () => {
			if (stageContainerRef.current) {
				setStageSize({
					width: stageContainerRef.current.offsetWidth,
					height: stageContainerRef.current.offsetHeight,
				});
			}
		};

		resizeCanvas();
		setBlocks(welcomeBlocksData);

		window.addEventListener("resize", resizeCanvas);
		window.addEventListener("keydown", onKeyDown);
		window.addEventListener("keyup", onKeyUp);

		return () => {
			window.removeEventListener("resize", resizeCanvas);
			window.removeEventListener("keydown", onKeyDown);
			window.removeEventListener("keyup", onKeyUp);
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<div ref={stageContainerRef} className="relative w-full h-full" style={{ cursor: cssCursor }}>
			<Stage
				width={stageSize.width}
				height={stageSize.height}
				onMouseMove={onMouseMove}
				onMouseDown={onMouseDown}
				onMouseUp={onMouseUp}
				onWheel={onWheel}
				onClick={onClick}
			>
				<Blocks
					blocks={visibleBlocks}
					setBlocks={setBlocks}
					missingTexture={missingTexture}
					textures={textures}
					solidTextures={solidTextures}
					image={image}
					imageDimensions={imageDimensions}
					coords={coords}
					scale={scale}
					setLoading={setLoading}
				/>

				<Container x={coords.x} y={coords.y} scale={scale}>
					{settings.canvasBorder && <CanvasBorder canvasSize={canvasSize} />}
					<Cursor mouseCoords={mouseCoords} radius={radius} />
				</Container>

				{settings.grid && (
					<Container>
						<Grid stageSize={stageSize} coords={coords} scale={scale} />
					</Container>
				)}
			</Stage>

			<CursorInformation mouseCoords={mouseCoords} />
			<CanvasInformation />
		</div>
	);
}

export default Canvas;
