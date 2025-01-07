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

		// Generate the block palette
		const blockStatePalette = [
			{ Name: "minecraft:air" },
			...Array.from(
				new Set(
					blocks.map((block) => {
						const blockInfo = blockData[block.name.replace("minecraft:", "")];

						const returnData: { Name: string; Properties?: Record<string, string> } = {
							Name: `minecraft:${blockInfo.id[0]}`,
							...(blockInfo.properties ? { Properties: blockInfo.properties } : {}),
						};

						// Stringify to remove duplicates
						return JSON.stringify(returnData);
					})
				)
			).map((serialized) => JSON.parse(serialized)),
		];

		// Get the block states
		const requiredBits = Math.max(Math.ceil(Math.log2(blockStatePalette.length)), 2);
		const blockStates = new BigInt64Array(Math.ceil((filledBlocks.length * requiredBits) / 64));

		filledBlocks.forEach((block) => {
			const blockInfo = blockData[block.name.replace("minecraft:", "")];
			const blockName = blockInfo ? blockInfo.id[0].toString() : block.name;

			const blockId = blockStatePalette.findIndex((entry) => entry.Name === `minecraft:${blockName}`);

			const reversedY = height - 1 - block.y;
			const index = reversedY * width + block.x;
			const startOffset = index * requiredBits;
			const startArrayIndex = Math.floor(startOffset / 64);
			const endArrayIndex = ((index + 1) * requiredBits - 1) >> 6;
			const bitOffset = startOffset % 64;
			const mask = (1 << requiredBits) - 1;

			blockStates[startArrayIndex] =
				(blockStates[startArrayIndex] & ~(BigInt(mask) << BigInt(bitOffset))) | (BigInt(blockId & mask) << BigInt(bitOffset));

			if (startArrayIndex !== endArrayIndex) {
				const endOffset = 64 - bitOffset;
				const j1 = requiredBits - endOffset;

				blockStates[endArrayIndex] = ((blockStates[endArrayIndex] >> BigInt(j1)) << BigInt(j1)) | (BigInt(blockId & mask) >> BigInt(endOffset));
			}
		});

		// Generate NBT data
		const data = {
			MinecraftDataVersion: new nbt.Int32(4189),
			Version: new nbt.Int32(7),
			SubVersion: new nbt.Int32(1),
			Metadata: {
				Name: fileName,
				Author: "blockmatic",
				Description: "Created with blockmatic",
				TimeCreated: new Date().getTime(),
				TimeModified: new Date().getTime(),
				EnclosingSize: {
					x: new nbt.Int32(width),
					y: new nbt.Int32(height),
					z: new nbt.Int32(1),
				},
				RegionCount: new nbt.Int32(1),
				TotalBlocks: new nbt.Int32(blocks.length),
				TotalVolume: new nbt.Int32(width * height),
			},
			Regions: {
				Image: {
					Position: {
						x: new nbt.Int32(0),
						y: new nbt.Int32(0),
						z: new nbt.Int32(0),
					},
					Size: {
						x: new nbt.Int32(width),
						y: new nbt.Int32(height),
						z: new nbt.Int32(1),
					},
					BlockStates: blockStates,
					BlockStatePalette: blockStatePalette,
					TileEntities: [],
					Entities: [],
					PendingBlockTicks: [],
					PendingFluidTicks: [],
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
		link.download = `${fileName}.litematic`;
		link.click();

		URL.revokeObjectURL(url);

		close();
	};

	return (
		<DialogContent>
			<DialogHeader>
				<DialogTitle>Save as .litematic</DialogTitle>
				<DialogDescription>Save your image as a litematic</DialogDescription>
			</DialogHeader>

			<div className="flex items-center gap-2">
				<Input value={fileName} onChange={(e) => setFileName(e.target.value)} />
				<span>.litematic</span>
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
