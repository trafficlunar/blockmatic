import { useContext, useState } from "react";
import * as nbt from "nbtify";

import { CanvasContext } from "@/context/Canvas";
import { LoadingContext } from "@/context/Loading";

import { DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import _blockData from "@/data/blocks/data.json";
const blockData: BlockData = _blockData;

function SaveLitematic({ close }: DialogProps) {
	const { canvasSize, blocks } = useContext(CanvasContext);
	const { setLoading } = useContext(LoadingContext);

	const [fileName, setFileName] = useState("blockmatic");

	const onSubmit = async () => {
		setLoading(true);
		// Wait for loading indicator to appear
		await new Promise((resolve) => setTimeout(resolve, 100));

		// todo: check if file name input is empty/valid
		const width = canvasSize.maxX - canvasSize.minX;
		const height = canvasSize.maxY - canvasSize.minY;

		// Fill in empty blocks with "air"
		const filledBlocks: Block[] = [];

		for (let x = canvasSize.minX; x <= canvasSize.maxX - 1; x++) {
			for (let y = canvasSize.minY; y <= canvasSize.maxY - 1; y++) {
				const existingBlock = blocks.find((block) => block.x === x && block.y === y);
				if (existingBlock) {
					filledBlocks.push(existingBlock);
				} else {
					filledBlocks.push({ name: "air", x, y });
				}
			}
		}

		// Sort array
		filledBlocks.sort((a, b) => {
			if (a.y !== b.y) {
				return b.y - a.y;
			}
			return a.x - b.x;
		});

		// Generate the block palette
		const blockPalette = Array.from(
			new Set(
				filledBlocks.map((block) => {
					const blockInfo = blockData[block.name.replace("minecraft:", "")];
					const properties = blockInfo.properties
						? `[${Object.entries(blockInfo.properties)
								.map(([key, value]) => `${key}=${value}`)
								.join(",")}]`
						: "";
					return `minecraft:${blockInfo.id[0]}${properties}`;
				})
			)
		).reduce<Record<string, nbt.Int32<number>>>((acc, blockName, index) => {
			acc[blockName] = new nbt.Int32(index);
			return acc;
		}, {});

		// Get the block data
		const buffer = new ArrayBuffer(filledBlocks.length);
		const blockPlaceData = new Int8Array(buffer);

		filledBlocks.forEach((block, index) => {
			const blockInfo = blockData[block.name.replace("minecraft:", "")];
			const blockName = blockInfo ? blockInfo.id[0].toString() : block.name;
			const properties = blockInfo.properties
				? `[${Object.entries(blockInfo.properties)
						.map(([key, value]) => `${key}=${value}`)
						.join(",")}]`
				: "";
			const blockId = blockPalette[`minecraft:${blockName}${properties}`];

			blockPlaceData[index] = parseInt(blockId.toString());
		});

		// Generate NBT data
		const data = {
			Schematic: {
				DataVersion: new nbt.Int32(4189),
				Version: new nbt.Int32(3),
				Width: new nbt.Int16(width),
				Height: new nbt.Int16(height),
				Length: new nbt.Int16(1),
				Metadata: {
					Date: new Date().getTime(),
				},
				Blocks: {
					Data: blockPlaceData,
					Palette: blockPalette,
				},
			},
		};

		// Write to file
		const bytes = await nbt.write(data);
		const compressed = await nbt.compress(bytes, "gzip");

		const blob = new Blob([compressed], { type: "application/x-gzip" });
		const url = URL.createObjectURL(blob);

		setLoading(false);

		const link = document.createElement("a");
		link.href = url;
		link.download = `${fileName}.schem`;
		link.click();

		URL.revokeObjectURL(url);

		close();
	};

	return (
		<DialogContent>
			<DialogHeader>
				<DialogTitle>Save as .schem</DialogTitle>
				<DialogDescription>Save your image as a .schem (Sponge)</DialogDescription>
			</DialogHeader>

			<div className="flex items-center gap-2">
				<Input value={fileName} onChange={(e) => setFileName(e.target.value)} />
				<span>.schem</span>
			</div>

			<DialogFooter>
				<Button variant="outline" onClick={close}>
					Cancel
				</Button>
				<Button type="submit" onClick={onSubmit}>
					Download
				</Button>
			</DialogFooter>
		</DialogContent>
	);
}

export default SaveLitematic;
