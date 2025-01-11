import { useContext } from "react";
import { useDropzone } from "react-dropzone";
import { UploadIcon } from "lucide-react";

import * as nbt from "nbtify";

import { CanvasContext } from "@/context/Canvas";
import { LoadingContext } from "@/context/Loading";

import { DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

import _blockData from "@/data/blocks/data.json";
const blockData: BlockData = _blockData;

interface LitematicaBlockPalette extends nbt.CompoundTagLike {
	Name: string;
	Properties?: Record<string, string>;
}

interface LitematicNBT extends nbt.ListTagLike {
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
			Data: Int8Array;
			Palette: Record<string, number>;
		};
		Width: number;
		Height: number;
	};
}

function OpenSchematic({ close }: DialogProps) {
	const { setBlocks } = useContext(CanvasContext);
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

			if (fileExtension == "litematic") {
				const litematicData = (data as nbt.NBTData<LitematicNBT>).data.Regions.Image;

				// todo: set version
				const requiredBits = Math.max(Math.ceil(Math.log2(litematicData.BlockStatePalette.length)), 2);

				const getPaletteIndex = (index: number): bigint => {
					const originalY = Math.floor(index / litematicData.Size.x);
					const originalX = index % litematicData.Size.x;
					const reversedY = litematicData.Size.y - 1 - originalY;
					const reversedIndex = reversedY * litematicData.Size.x + originalX;

					// getAt() implementation - LitematicaBitArray.java
					const startOffset = reversedIndex * requiredBits;
					const startArrayIndex = Math.floor(startOffset / 64);
					const endArrayIndex = ((reversedIndex + 1) * requiredBits - 1) >> 6;
					const bitOffset = startOffset % 64;
					const mask = (1 << requiredBits) - 1;

					if (startArrayIndex === endArrayIndex) {
						return (litematicData.BlockStates[startArrayIndex] >> BigInt(bitOffset)) & BigInt(mask);
					} else {
						const endOffset = 64 - bitOffset;
						return (
							((litematicData.BlockStates[startArrayIndex] >> BigInt(bitOffset)) | (litematicData.BlockStates[endArrayIndex] << BigInt(endOffset))) &
							BigInt(mask)
						);
					}
				};

				// Add every block to the canvas
				const blocks: Block[] = [];
				let index = 0;

				for (let y = 0; y < litematicData.Size.y; y++) {
					for (let x = 0; x < litematicData.Size.x; x++) {
						const paletteIndex = Number(getPaletteIndex(index));
						console.log(paletteIndex);
						const paletteBlock = litematicData.BlockStatePalette[paletteIndex];

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
			} else if (fileExtension == "schem") {
				const spongeData = (data as nbt.NBTData<SpongeNBT>).data.Schematic;
				// todo: set version

				// Add every block to the canvas
				const blocks: Block[] = [];
				let index = 0;

				for (let y = spongeData.Height; y > 0; y--) {
					for (let x = 0; x < spongeData.Width; x++) {
						const paletteValue = spongeData.Blocks.Data[index];
						const paletteBlock = Object.keys(spongeData.Blocks.Palette).find((key) => spongeData.Blocks.Palette[key] == paletteValue);

						index++;
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
