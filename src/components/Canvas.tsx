import React, { useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { Container, Stage } from "@pixi/react";
import * as PIXI from "pixi.js";

import { SettingsContext } from "@/context/SettingsContext";
import { ToolContext } from "@/context/ToolContext";
import { TexturesContext } from "@/context/TexturesContext";

import Blocks from "./Blocks";
import Grid from "./Grid";
import Cursor from "./Cursor";
import CursorInformation from "./information/Cursor";
import CanvasInformation from "./information/Canvas";
import CanvasBorder from "./CanvasBorder";

// Set scale mode to NEAREST
PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;

function Canvas() {
	const { settings } = useContext(SettingsContext);
	const { tool, selectedBlock } = useContext(ToolContext);
	const textures = useContext(TexturesContext);

	const stageContainerRef = useRef<HTMLDivElement>(null);
	const [stageSize, setStageSize] = useState<Dimension>({ width: 0, height: 0 });

	const [coords, setCoords] = useState<Position>({ x: 0, y: 0 });
	const [scale, setScale] = useState(1);

	const [mousePosition, setMousePosition] = useState<Position>({ x: 0, y: 0 });
	const [mouseCoords, setMouseCoords] = useState<Position>({ x: 0, y: 0 });
	const [dragging, setDragging] = useState(false);

	const [blocks, setBlocks] = useState<Block[]>([]);

	const updatedBlocks = useMemo(() => {
		return blocks.filter((b) => !(b.x === mouseCoords.x && b.y === mouseCoords.y));
	}, [blocks, mouseCoords]);

	const canvasSize = useMemo(() => {
		let minX = Infinity,
			maxX = -Infinity;
		let minY = Infinity,
			maxY = -Infinity;

		blocks.forEach((coord) => {
			if (coord.x < minX) minX = coord.x;
			if (coord.x > maxX) maxX = coord.x;
			if (coord.y < minY) minY = coord.y;
			if (coord.y > maxY) maxY = coord.y;
		});

		return {
			minX,
			minY,
			maxX: maxX + 1,
			maxY: maxY + 1,
		};
	}, [blocks]);

	const onToolUse = useCallback(() => {
		switch (tool) {
			case "pencil": {
				setBlocks([
					...updatedBlocks,
					{
						name: selectedBlock,
						x: mouseCoords.x,
						y: mouseCoords.y,
					},
				]);
				break;
			}
			case "eraser":
				setBlocks(updatedBlocks);
				break;
		}
	}, [tool, mouseCoords, selectedBlock, updatedBlocks]);

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
		[dragging, coords, scale, tool, onToolUse]
	);

	const onMouseDown = useCallback(() => {
		setDragging(true);
		onToolUse();
	}, [onToolUse]);

	const onMouseUp = () => {
		setDragging(false);
	};

	const onWheel = useCallback(
		(e: React.WheelEvent) => {
			e.preventDefault();

			const scaleChange = e.deltaY > 0 ? -0.1 : 0.1;
			const newScale = Math.min(Math.max(scale + scaleChange * scale, 0.25), 32);

			setScale(newScale);
			setCoords({
				x: mousePosition.x - ((mousePosition.x - coords.x) / scale) * newScale,
				y: mousePosition.y - ((mousePosition.y - coords.y) / scale) * newScale,
			});
		},
		[scale, coords, mousePosition]
	);

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
		return () => window.removeEventListener("resize", resizeCanvas);
	}, []);

	return (
		<div ref={stageContainerRef} className="relative w-full h-full">
			<Stage
				width={stageSize.width}
				height={stageSize.height}
				onMouseMove={onMouseMove}
				onMouseDown={onMouseDown}
				onMouseUp={onMouseUp}
				onWheel={onWheel}
			>
				<Container x={coords.x} y={coords.y} scale={scale}>
					<Blocks blocks={blocks} setBlocks={setBlocks} textures={textures} />
					{settings.canvasBorder && <CanvasBorder canvasSize={canvasSize} />}
					<Cursor mouseCoords={mouseCoords} />
				</Container>

				{settings.grid && (
					<Container>
						<Grid stageSize={stageSize} coords={coords} scale={scale} />
					</Container>
				)}
			</Stage>

			<CursorInformation mouseCoords={mouseCoords} blocks={blocks} />
			<CanvasInformation scale={scale} setScale={setScale} setCoords={setCoords} canvasSize={canvasSize} stageSize={stageSize} />
		</div>
	);
}

export default Canvas;
