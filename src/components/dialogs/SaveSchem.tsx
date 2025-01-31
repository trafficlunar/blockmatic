import { useContext, useState } from "react";
import * as nbt from "nbtify";

import { CanvasContext } from "@/context/Canvas";
import { LoadingContext } from "@/context/Loading";

import * as varint from "@/utils/varint";

import { DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import _blockData from "@/data/blocks/data.json";
const blockData: BlockData = _blockData;

import _versionData from "@/data/versions.json";
const versionData: Record<string, number> = _versionData;

interface BlockEntity {
	Id: string;
	Pos: Int32Array;
}

const blockEntitiesWhitelist = [
	"barrel",
	"beacon",
	"bee",
	"chiseled_bookshelf",
	"command_block",
	"crafter",
	"creaking_heart",
	"dispenser",
	"dropper",
	"furnace",
	"jigsaw",
	"spawner",
	"piston",
	"sculk",
	"smoker",
	"shulker",
	"structure",
	"suspicious",
	"vault",
];

function SaveSchem({ close, registerSubmit, dialogKeyHandler }: DialogProps) {
	const { canvasSize, blocks, version } = useContext(CanvasContext);
	const { setLoading } = useContext(LoadingContext);

	const [fileName, setFileName] = useState("blockmatic");

	const onSubmit = async () => {
		setLoading(true);
		// Wait for loading indicator to appear
		await new Promise((resolve) => setTimeout(resolve, 100));

		const width = canvasSize.maxX - canvasSize.minX;
		const height = canvasSize.maxY - canvasSize.minY;

		const blockEntities: BlockEntity[] = [];

		// Fill in empty blocks with "air"
		const filledBlocks: Block[] = [];

		for (let x = canvasSize.minX; x < canvasSize.maxX; x++) {
			for (let y = canvasSize.minY; y < canvasSize.maxY; y++) {
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

					if (blockEntitiesWhitelist.some((i) => blockInfo.id.includes(i))) {
						blockEntities.push({
							Id: `minecraft:${blockInfo.id}`,
							Pos: new Int32Array([block.x, block.y, 0]),
						});
					}
					return `minecraft:${blockInfo.id}${properties}`;
				})
			)
		).reduce<Record<string, nbt.Int32<number>>>((acc, blockName, index) => {
			acc[blockName] = new nbt.Int32(index);
			return acc;
		}, {});

		// Get the block data
		const ids: number[] = [];

		filledBlocks.forEach((block) => {
			const blockInfo = blockData[block.name.replace("minecraft:", "")];
			const blockName = blockInfo ? blockInfo.id : block.name;
			const properties = blockInfo.properties
				? `[${Object.entries(blockInfo.properties)
						.map(([key, value]) => `${key}=${value}`)
						.join(",")}]`
				: "";
			const blockId = blockPalette[`minecraft:${blockName}${properties}`];

			// Parse blockId to number then encode as varint
			const id = varint.encode(parseInt(blockId.toString()));
			// Push to separate array to make array buffer
			ids.push(...id);
		});

		const buffer = new ArrayBuffer(ids.length);
		const blockPlaceData = new Uint8Array(buffer);
		blockPlaceData.set(ids);

		// Generate NBT data
		const data = {
			Schematic: {
				DataVersion: new nbt.Int32(versionData[version]),
				Version: new nbt.Int32(3),
				Width: new nbt.Int16(width),
				Height: new nbt.Int16(height),
				Length: new nbt.Int16(1),
				Metadata: {
					Date: BigInt(new Date().getTime()),
				},
				Blocks: {
					BlockEntities: blockEntities,
					Data: blockPlaceData,
					Palette: blockPalette,
				},
			},
		};

		// Write to file
		const bytes = await nbt.write(data, { compression: "gzip" });
		const blob = new Blob([bytes], { type: "application/x-gzip" });
		const url = URL.createObjectURL(blob);

		setLoading(false);

		const link = document.createElement("a");
		link.href = url;
		link.download = `${fileName}.schem`;
		link.click();

		URL.revokeObjectURL(url);

		close();
	};

	registerSubmit(onSubmit);

	return (
		<DialogContent onKeyDown={dialogKeyHandler}>
			<DialogHeader>
				<DialogTitle>Save as .schem</DialogTitle>
				<DialogDescription>Save your image as a .schem (Sponge Version 3)</DialogDescription>
			</DialogHeader>

			<div className="flex items-center gap-2">
				<Input
					value={fileName}
					onChange={(e) => {
						if (e.target.value !== "") setFileName(e.target.value);
					}}
					autoFocus
				/>
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

export default SaveSchem;
