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

interface BlockPalette extends nbt.CompoundTagLike {
	Name: string;
	Properties?: Record<string, string>;
}

interface LitematicNBT extends nbt.ListTagLike {
	Regions: {
		Image: {
			BlockStatePalette: BlockPalette[];
			BlockStates: BigInt64Array;
			Size: { x: number; y: number; z: number };
		};
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
				const litematicData = (data as nbt.NBTData<LitematicNBT>).data;
				const imageRegion = litematicData.Regions.Image;

				// todo: set version
				const requiredBits = Math.max(Math.ceil(Math.log2(imageRegion.BlockStatePalette.length)), 2);

				const getPaletteIndex = (index: number): bigint => {
					const originalY = Math.floor(index / imageRegion.Size.x);
					const originalX = index % imageRegion.Size.x;
					const reversedY = imageRegion.Size.y - 1 - originalY;
					const reversedIndex = reversedY * imageRegion.Size.x + originalX;

					// getAt() implementation - LitematicaBitArray.java
					const startOffset = reversedIndex * requiredBits;
					const startArrayIndex = Math.floor(startOffset / 64);
					const endArrayIndex = ((reversedIndex + 1) * requiredBits - 1) >> 6;
					const bitOffset = startOffset % 64;
					const mask = (1 << requiredBits) - 1;

					if (startArrayIndex === endArrayIndex) {
						return (imageRegion.BlockStates[startArrayIndex] >> BigInt(bitOffset)) & BigInt(mask);
					} else {
						const endOffset = 64 - bitOffset;
						return (
							((imageRegion.BlockStates[startArrayIndex] >> BigInt(bitOffset)) | (imageRegion.BlockStates[endArrayIndex] << BigInt(endOffset))) &
							BigInt(mask)
						);
					}
				};

				// Add every block to the canvas
				const blocks: Block[] = [];
				let index = 0;

				for (let y = 0; y < imageRegion.Size.y; y++) {
					for (let x = 0; x < imageRegion.Size.x; x++) {
						const paletteIndex = Number(getPaletteIndex(index));
						const paletteBlock = imageRegion.BlockStatePalette.at(paletteIndex);

						index++;
						if (!paletteBlock) continue;

						const blockId = paletteBlock.Name.replace("minecraft:", "");
						if (blockId == "air") continue;

						for (const name in blockData) {
							const dataId = blockData[name].id[0];
							if (dataId !== blockId) continue;

							const paletteProperties = paletteBlock.Properties;
							const dataProperties = blockData[name].properties;

							if (paletteProperties) {
								if (!dataProperties) continue;

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
