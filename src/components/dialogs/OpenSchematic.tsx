import { useContext } from "react";
import { useDropzone } from "react-dropzone";
import { UploadIcon } from "lucide-react";

import * as nbt from "nbtify";

import { CanvasContext } from "@/context/Canvas";
import { HistoryContext } from "@/context/History";
import { LoadingContext } from "@/context/Loading";

import * as varint from "@/utils/varint";

import { DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

import _blockData from "@/data/blocks/data.json";
const blockData: BlockData = _blockData;

import _versionData from "@/data/versions.json";
const versionData: Record<string, number> = _versionData;

interface LitematicaBlockPalette extends nbt.CompoundTagLike {
	Name: string;
	Properties?: Record<string, string>;
}

interface LitematicNBT extends nbt.ListTagLike {
	MinecraftDataVersion: number;
	Regions: {
		Image: {
			BlockStatePalette: LitematicaBlockPalette[];
			BlockStates: BigInt64Array;
			Size: { x: number; y: number; z: number };
		};
	};
}

interface SpongeNBT extends nbt.ListTagLike {
	Schematic: {
		Blocks: {
			Data: Uint8Array;
			Palette: Record<string, number>;
		};
		DataVersion: number;
		Width: number;
		Height: number;
	};
}

function OpenSchematic({ close }: DialogProps) {
	const { blocks, setBlocks, setVersion } = useContext(CanvasContext);
	const { addHistory } = useContext(HistoryContext);
	const { setLoading } = useContext(LoadingContext);

	const { acceptedFiles, getRootProps, getInputProps } = useDropzone({
		accept: {
			"application/x-gzip-compressed": [".litematic", ".schem"],
		},
	});

	const onSubmit = async () => {
		const file = acceptedFiles[0];
		if (file) {
			setLoading(true);
			// Wait for loading indicator to appear
			await new Promise((resolve) => setTimeout(resolve, 100));

			const fileExtension = file.name.split(".").pop();
			const bytes = await file.arrayBuffer();
			const data = await nbt.read(bytes);

			const oldBlocks = [...blocks];

			if (fileExtension == "litematic") {
				const litematicData = (data as nbt.NBTData<LitematicNBT>).data;
				const litematicRegionData = litematicData.Regions.Image;
				const litematicVersion = Object.keys(versionData).find((key) => versionData[key] == litematicData.MinecraftDataVersion);

				// Set version to schematic version. If it doesn't find it in the data, return the latest version
				setVersion(parseInt(litematicVersion || Object.keys(versionData)[0]));

				const requiredBits = Math.max(Math.ceil(Math.log2(litematicRegionData.BlockStatePalette.length)), 2);

				const getPaletteIndex = (index: number): bigint => {
					const originalY = Math.floor(index / litematicRegionData.Size.x);
					const originalX = index % litematicRegionData.Size.x;
					const reversedY = litematicRegionData.Size.y - 1 - originalY;
					const reversedIndex = reversedY * litematicRegionData.Size.x + originalX;

					// getAt() implementation - LitematicaBitArray.java
					const startOffset = reversedIndex * requiredBits;
					const startArrayIndex = Math.floor(startOffset / 64);
					const endArrayIndex = ((reversedIndex + 1) * requiredBits - 1) >> 6;
					const bitOffset = startOffset % 64;
					const mask = (1 << requiredBits) - 1;

					if (startArrayIndex === endArrayIndex) {
						return (litematicRegionData.BlockStates[startArrayIndex] >> BigInt(bitOffset)) & BigInt(mask);
					} else {
						const endOffset = 64 - bitOffset;
						return (
							((litematicRegionData.BlockStates[startArrayIndex] >> BigInt(bitOffset)) |
								(litematicRegionData.BlockStates[endArrayIndex] << BigInt(endOffset))) &
							BigInt(mask)
						);
					}
				};

				// Add every block to the canvas
				const blocks: Block[] = [];
				let index = 0;

				for (let y = 0; y < litematicRegionData.Size.y; y++) {
					for (let x = 0; x < litematicRegionData.Size.x; x++) {
						const paletteIndex = Number(getPaletteIndex(index));
						console.log(paletteIndex);
						const paletteBlock = litematicRegionData.BlockStatePalette[paletteIndex];

						index++;
						if (!paletteBlock) continue;

						const blockId = paletteBlock.Name.replace("minecraft:", "");
						if (blockId == "air") continue;

						for (const name in blockData) {
							if (blockData[name].id !== blockId) continue;

							const paletteProperties = paletteBlock.Properties;
							const dataProperties = blockData[name].properties;

							// The schematic doesn't explicitly provide the texture name, thus we have to figure it out by checking the block's properties
							if (paletteProperties) {
								// Check if the properties in the block data exist
								// If not, that means the block we're looking for has an extra word
								// For example, pale_oak_log can have no properties but pale_oak_log_top does
								if (!dataProperties) continue;

								// Check if the schematic and data properties are the same
								if (!Object.keys(paletteProperties).every((key) => paletteProperties[key] === dataProperties[key])) {
									continue;
								}
							}

							blocks.push({ x, y, name });
							break;
						}
					}
				}

				setBlocks(blocks);
				addHistory(
					"Open Schematic",
					() => setBlocks(blocks),
					() => setBlocks(oldBlocks)
				);
			} else if (fileExtension == "schem") {
				const spongeData = (data as nbt.NBTData<SpongeNBT>).data.Schematic;
				const schematicVersion = Object.keys(versionData).find((key) => versionData[key] == spongeData.DataVersion);

				// Set version to schematic version. If it doesn't find it in the data, return the latest version
				setVersion(parseInt(schematicVersion || Object.keys(versionData)[0]));

				// Add every block to the canvas
				const blocks: Block[] = [];
				let offset = 0;

				for (let y = spongeData.Height; y > 0; y--) {
					for (let x = 0; x < spongeData.Width; x++) {
						// Decode varint to get the palette value
						const { value: paletteValue, bytesRead } = varint.decode(spongeData.Blocks.Data, offset);
						const paletteBlock = Object.keys(spongeData.Blocks.Palette).find((key) => spongeData.Blocks.Palette[key] == paletteValue);

						offset += bytesRead;
						if (!paletteBlock) continue;

						const blockIdWithProperties = paletteBlock.replace("minecraft:", "");
						if (blockIdWithProperties == "air") continue;

						// Split up block ID and properties
						const [blockId, propertiesString] = blockIdWithProperties.split(/\[(.+)\]/);
						const properties = propertiesString ? Object.fromEntries(propertiesString.split(",").map((pair) => pair.split("="))) : null;

						for (const name in blockData) {
							if (blockData[name].id !== blockId) continue;

							const dataProperties = blockData[name].properties;

							// See .litematic function above for how this works
							if (properties) {
								if (!dataProperties) continue;

								if (!Object.keys(properties).every((key) => properties[key] === dataProperties[key])) {
									continue;
								}
							}

							blocks.push({ x, y, name });
							break;
						}
					}
				}

				setBlocks(blocks);
				addHistory(
					"Open Schematic",
					() => setBlocks(blocks),
					() => setBlocks(oldBlocks)
				);
			}
		}

		setLoading(false);
		close();
	};

	return (
		<DialogContent>
			<DialogHeader>
				<DialogTitle>Open Schematic</DialogTitle>
				<DialogDescription>Open your schematic file to load into the canvas</DialogDescription>
			</DialogHeader>

			<div
				{...getRootProps({
					className: "flex flex-col justify-center items-center gap-2 p-4 rounded border border-2 border-dashed select-none",
				})}
			>
				<input {...getInputProps({ multiple: false })} />
				<UploadIcon size={30} />
				<p className="text-center">
					Drag and drop your schematic file here
					<br />
					or click to open
				</p>
			</div>

			<DialogFooter>
				<Button variant="outline" onClick={close}>
					Cancel
				</Button>
				<Button type="submit" onClick={onSubmit}>
					Submit
				</Button>
			</DialogFooter>
		</DialogContent>
	);
}

export default OpenSchematic;
