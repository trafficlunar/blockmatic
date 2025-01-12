import { useContext, useEffect, useRef, useState } from "react";
import { useDropzone } from "react-dropzone";

import { CircleAlertIcon, LinkIcon, UploadIcon } from "lucide-react";

import { CanvasContext } from "@/context/Canvas";
import { LoadingContext } from "@/context/Loading";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { CheckedState } from "@radix-ui/react-checkbox";
import { DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Toggle } from "@/components/ui/toggle";

import { useBlockData } from "@/hooks/useBlockData";

import BlockSelector from "./open-image/BlockSelector";
import VersionCombobox from "../VersionCombobox";
import { findBlockFromRgb } from "@/utils/findBlockFromRgb";

function OpenImage({ close }: DialogProps) {
	const { version, setVersion, setBlocks } = useContext(CanvasContext);
	const { setLoading } = useContext(LoadingContext);

	const { acceptedFiles, getRootProps, getInputProps } = useDropzone({
		accept: {
			"image/*": [".png", ".jpg", ".jpeg", ".gif", ".bmp", ".webp", ".tiff", ".svg"],
		},
	});

	const blockData = useBlockData(version);
	const divRef = useRef<HTMLDivElement>(null);
	const userModifiedBlocks = useRef(false);

	const [image, setImage] = useState<HTMLImageElement>();
	const [imageDimensions, setImageDimensions] = useState<Dimension>({ width: 0, height: 0 });
	const [aspectRatio, setAspectRatio] = useState(1);
	const [linkAspectRatio, setLinkAspectRatio] = useState(true);

	const [searchInput, setSearchInput] = useState("");
	const [stageWidth, setStageWidth] = useState(0);

	const [selectedBlocks, setSelectedBlocks] = useState<string[]>(Object.keys(blockData));
	const [blockTypeCheckboxesChecked, setBlockTypeCheckboxesChecked] = useState({
		creative: false,
		tile_entity: false,
		fallable: false,
	});

	useEffect(() => {
		if (acceptedFiles[0]) {
			const img = new Image();
			img.onload = () => {
				setImage(img);
				setImageDimensions({ width: img.width, height: img.height });
				setAspectRatio(img.width / img.height);
			};
			img.src = URL.createObjectURL(acceptedFiles[0]);
		}
	}, [acceptedFiles]);

	const onDimensionChange = (e: React.ChangeEvent<HTMLInputElement>, isWidth: boolean) => {
		const newDimension = Number(e.target.value);
		if (newDimension < 1 || newDimension > 10000) return;

		setImageDimensions((prev) => {
			if (isWidth)
				return linkAspectRatio ? { width: newDimension, height: Math.round(newDimension / aspectRatio) } : { ...prev, width: newDimension };
			return linkAspectRatio ? { width: Math.round(newDimension * aspectRatio), height: newDimension } : { ...prev, height: newDimension };
		});
	};

	const onBlockTypeCheckedChange = (checked: CheckedState, property: keyof BlockData[string]) => {
		const blocksWithProperty = Object.entries(blockData)
			.filter(([, data]) => data[property] === true)
			.map(([blockName]) => blockName);

		if (checked) {
			setSelectedBlocks((prev) => [...prev, ...blocksWithProperty]);
		} else {
			setSelectedBlocks((prev) => prev.filter((block) => !blocksWithProperty.includes(block)));
		}

		setBlockTypeCheckboxesChecked((prev) => ({ ...prev, [property]: checked }));
	};

	const onBlockSelectionChange = (newValue: string[]) => {
		userModifiedBlocks.current = true;
		setSelectedBlocks(newValue);
	};

	const onSubmit = async () => {
		if (image) {
			setLoading(true);
			// Wait for loading indicator to appear
			await new Promise((resolve) => setTimeout(resolve, 100));

			// Load image through JS canvas
			const canvas = document.createElement("canvas");
			const ctx = canvas.getContext("2d");

			if (ctx) {
				canvas.width = imageDimensions.width;
				canvas.height = imageDimensions.height;
				ctx.drawImage(image, 0, 0, imageDimensions.width, imageDimensions.height);

				const imageData = ctx.getImageData(0, 0, imageDimensions.width, imageDimensions.height);
				const newBlocks: Block[] = [];

				// Go through each pixel in the image and find block by checking closest RGB to the average color of the texture
				for (let i = 0; i < imageData.data.length; i += 4) {
					const block = findBlockFromRgb(selectedBlocks, imageData.data[i], imageData.data[i + 1], imageData.data[i + 2], imageData.data[i + 3]);
					if (block == "air") continue;

					const x = Math.floor((i / 4) % imageData.width);
					const y = Math.floor(i / 4 / imageData.width);

					newBlocks.push({
						name: block,
						x,
						y,
					});
				}

				setBlocks(newBlocks);
			}

			setLoading(false);
			close();
		}
	};

	useEffect(() => {
		Object.keys(blockTypeCheckboxesChecked).forEach((property) => {
			const blocksWithProperty = Object.entries(blockData)
				.filter(([, data]) => data[property as keyof BlockData[string]] === true)
				.map(([blockName]) => blockName);

			const propertyChecked = blocksWithProperty.every((block) => selectedBlocks.includes(block));
			setBlockTypeCheckboxesChecked((prev) => ({ ...prev, [property]: propertyChecked }));
		});
	}, [selectedBlocks]);

	useEffect(() => {
		if (!userModifiedBlocks.current) {
			setSelectedBlocks(Object.keys(blockData));
		}
	}, [version]);

	useEffect(() => {
		if (!divRef.current) return;
		setStageWidth(divRef.current.clientWidth);
	}, [divRef.current?.clientWidth]);

	return (
		<DialogContent>
			<DialogHeader>
				<DialogTitle>Open Image</DialogTitle>
				<DialogDescription>Open your image to load as blocks into the canvas</DialogDescription>
			</DialogHeader>

			<div ref={divRef}>
				<Tabs defaultValue="image">
					<TabsList className="grid w-full grid-cols-2">
						<TabsTrigger value="image">Image</TabsTrigger>
						<TabsTrigger value="blocks">Blocks</TabsTrigger>
					</TabsList>

					<TabsContent value="image" className="flex flex-col gap-2">
						<div
							{...getRootProps({
								className: "flex flex-col justify-center items-center gap-2 p-4 rounded border border-2 border-dashed select-none",
							})}
						>
							<input {...getInputProps({ multiple: false })} />
							<UploadIcon size={30} />
							<p className="text-center">
								Drag and drop your image here
								<br />
								or click to open
							</p>
						</div>

						<div className="grid grid-cols-[auto,1fr] gap-2">
							{image && acceptedFiles[0] && (
								<>
									<img
										src={image.src}
										alt="your image"
										className="w-48 h-48 object-contain border rounded-lg"
										style={{ background: "repeating-conic-gradient(#fff 0 90deg, #bbb 0 180deg) 0 0/25% 25%" }}
									/>

									<div className="flex flex-col gap-2">
										<div>
											<Label htmlFor="file-name">File name</Label>
											<p id="file-name" className="text-wrap">
												{acceptedFiles[0].name}
											</p>
										</div>

										<div className="grid grid-cols-[1fr_auto_1fr] gap-1">
											<div>
												<Label htmlFor="width">Width (blocks)</Label>
												<Input
													type="number"
													id="width"
													placeholder="Width"
													value={imageDimensions.width}
													onChange={(e) => onDimensionChange(e, true)}
												/>
											</div>

											<Toggle
												aria-label="Link aspect ratio"
												variant="outline"
												pressed={linkAspectRatio}
												onPressedChange={() => setLinkAspectRatio(!linkAspectRatio)}
												className="h-8 !min-w-8 p-0 mt-auto mb-1"
											>
												<LinkIcon />
											</Toggle>

											<div>
												<Label htmlFor="height">Height (blocks)</Label>
												<Input
													type="number"
													id="height"
													placeholder="Height"
													value={imageDimensions.height}
													onChange={(e) => onDimensionChange(e, false)}
												/>
											</div>
										</div>

										{imageDimensions.height > (version >= 1180 ? 384 : 256) && (
											<div className="flex items-center gap-1 mt-auto mb-1">
												<CircleAlertIcon className="text-red-400" size={22} />
												<span className="text-red-400 text-sm">The height is above {version >= 1180 ? 384 : 256} blocks!</span>
											</div>
										)}
									</div>
								</>
							)}
						</div>
					</TabsContent>

					<TabsContent value="blocks" className="flex flex-col gap-2">
						<div className="grid grid-cols-2">
							<div className="grid grid-rows-3 gap-2 *:flex *:items-center *:gap-1">
								<div>
									<Checkbox
										id="creative"
										checked={blockTypeCheckboxesChecked.creative}
										onCheckedChange={(value) => onBlockTypeCheckedChange(value, "creative")}
									/>
									<Label htmlFor="creative">Creative only</Label>
								</div>
								<div>
									<Checkbox
										id="tile_entity"
										checked={blockTypeCheckboxesChecked.tile_entity}
										onCheckedChange={(value) => onBlockTypeCheckedChange(value, "tile_entity")}
									/>
									<Label htmlFor="tile_entity">Tile entities</Label>
								</div>
								<div>
									<Checkbox
										id="fallable"
										checked={blockTypeCheckboxesChecked.fallable}
										onCheckedChange={(value) => onBlockTypeCheckedChange(value, "fallable")}
									/>
									<Label htmlFor="fallable">Fallable</Label>
								</div>
							</div>

							<div className="grid grid-rows-2 gap-1">
								<Button className="h-8" onClick={() => onBlockSelectionChange(Object.keys(blockData))}>
									Check all blocks
								</Button>
								<Button className="h-8" onClick={() => onBlockSelectionChange([])}>
									Uncheck all blocks
								</Button>
							</div>
						</div>

						<Separator />

						<Input placeholder="Search for blocks..." value={searchInput} onChange={(e) => setSearchInput(e.target.value)} />

						<ScrollArea className="h-60">
							<BlockSelector
								stageWidth={stageWidth}
								searchInput={searchInput}
								selectedBlocks={selectedBlocks}
								setSelectedBlocks={setSelectedBlocks}
								userModifiedBlocks={userModifiedBlocks}
							/>
						</ScrollArea>
					</TabsContent>
				</Tabs>
			</div>

			<DialogFooter className="!justify-between">
				<VersionCombobox version={version} setVersion={setVersion} />

				<div className="flex gap-2">
					<Button variant="outline" onClick={close}>
						Cancel
					</Button>
					<Button type="submit" onClick={onSubmit}>
						Open
					</Button>
				</div>
			</DialogFooter>
		</DialogContent>
	);
}

export default OpenImage;
