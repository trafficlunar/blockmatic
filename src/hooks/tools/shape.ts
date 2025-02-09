import { useContext } from "react";

import { SelectionContext } from "@/context/Selection";
import { ToolContext } from "@/context/Tool";

export function useShapeTool(mouseCoords: Position, dragStartCoords: Position, holdingShift: boolean) {
	const { confirmHistoryEntryNameRef, setSelectionLayerBlocks } = useContext(SelectionContext);
	const { selectedBlock, radius, shape, filled } = useContext(ToolContext);

	const isRadiusEven = radius == 1 || radius % 2 == 0;

	const use = () => {
		switch (shape) {
			case "line": {
				// Bresenham line algorithm
				const result: Block[] = [];
				const dx = Math.abs(mouseCoords.x - dragStartCoords.x);
				const dy = Math.abs(mouseCoords.y - dragStartCoords.y);
				const sx = Math.sign(mouseCoords.x - dragStartCoords.x);
				const sy = Math.sign(mouseCoords.y - dragStartCoords.y);

				let err = dx - dy;
				const currentStart = { ...dragStartCoords };

				const offsetStart = isRadiusEven ? 0 : -Math.floor(radius / 2);
				const offsetEnd = isRadiusEven ? radius : Math.floor(radius / 2) + (isRadiusEven ? 0 : 1);

				while (true) {
					// For loop increases the height/width of the line
					for (let offset = offsetStart; offset < offsetEnd; offset++) {
						result.push({ name: selectedBlock, x: currentStart.x, y: currentStart.y + offset });
					}

					if (currentStart.x === mouseCoords.x && currentStart.y === mouseCoords.y) break;

					const e2 = 2 * err;
					if (e2 > -dy) {
						err -= dy;
						currentStart.x += sx;
					}
					if (e2 < dx) {
						err += dx;
						currentStart.y += sy;
					}
				}

				setSelectionLayerBlocks([...result]);
				confirmHistoryEntryNameRef.current = "Line";
				break;
			}
			case "rectangle": {
				const result: Block[] = [];

				const startX = Math.min(dragStartCoords.x, mouseCoords.x);
				let endX = Math.max(dragStartCoords.x, mouseCoords.x);
				const startY = Math.min(dragStartCoords.y, mouseCoords.y);
				let endY = Math.max(dragStartCoords.y, mouseCoords.y);

				const radiusOffset = isRadiusEven ? radius : radius - 1;
				const borderOffset = isRadiusEven ? 0 : 1;

				// If holding shift, create a square
				if (holdingShift) {
					const width = Math.abs(endX - startX);
					const height = Math.abs(endY - startY);
					const size = Math.max(width, height);

					endX = startX + (endX < startX ? -size : size);
					endY = startY + (endY < startY ? -size : size);
				}

				for (let x = startX; x < endX + radiusOffset; x++) {
					for (let y = startY; y < endY + radiusOffset; y++) {
						// If not filled, only add border blocks
						if (
							filled ||
							(x > startX - radius && x < startX + radius) || // Left
							(x >= endX - borderOffset && x < endX + radius) || // Right
							(y > startY - radius && y < startY + radius) || // Top
							(y >= endY - borderOffset && y < endY + radius) // Bottom
						) {
							result.push({ name: selectedBlock, x, y });
						}
					}
				}

				setSelectionLayerBlocks(result);
				confirmHistoryEntryNameRef.current = "Rectangle";
				break;
			}
			case "circle": {
				const result: Block[] = [];

				const dx = Math.abs(mouseCoords.x - dragStartCoords.x);
				const dy = Math.abs(mouseCoords.y - dragStartCoords.y);
				const calculatedRadius = Math.floor(Math.sqrt(dx * dx + dy * dy) / 2);

				const originX = dragStartCoords.x + calculatedRadius;
				const originY = dragStartCoords.y + calculatedRadius;

				// Bresenham circle algorithm
				let x = 0;
				let y = calculatedRadius;
				let d = 3 - 2 * calculatedRadius;

				if (filled) {
					while (x <= y) {
						for (let fillY = originY - y; fillY <= originY + y; fillY++) {
							result.push({ name: selectedBlock, x: originX + x, y: fillY });
							result.push({ name: selectedBlock, x: originX - x, y: fillY });
						}
						for (let fillY = originY - x; fillY <= originY + x; fillY++) {
							result.push({ name: selectedBlock, x: originX + y, y: fillY });
							result.push({ name: selectedBlock, x: originX - y, y: fillY });
						}

						if (d < 0) {
							d = d + 4 * x + 6;
						} else {
							d = d + 4 * (x - y) + 10;
							y--;
						}
						x++;
					}
				} else {
					while (x <= y) {
						result.push({ name: selectedBlock, x: originX + x, y: originY + y });
						result.push({ name: selectedBlock, x: originX - x, y: originY + y });
						result.push({ name: selectedBlock, x: originX + x, y: originY - y });
						result.push({ name: selectedBlock, x: originX - x, y: originY - y });
						result.push({ name: selectedBlock, x: originX + y, y: originY + x });
						result.push({ name: selectedBlock, x: originX - y, y: originY + x });
						result.push({ name: selectedBlock, x: originX + y, y: originY - x });
						result.push({ name: selectedBlock, x: originX - y, y: originY - x });

						if (d < 0) {
							d = d + 4 * x + 6;
						} else {
							d = d + 4 * (x - y) + 10;
							y--;
						}
						x++;
					}
				}

				setSelectionLayerBlocks(result);
				confirmHistoryEntryNameRef.current = "Circle";
				break;
			}
		}
	};

	return { use };
}
