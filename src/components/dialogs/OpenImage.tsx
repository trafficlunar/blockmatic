import { useContext, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";

import { CircleAlertIcon, UploadIcon } from "lucide-react";

import { DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { ImageContext } from "@/context/Image";

function OpenImage({ close }: DialogProps) {
	const { setImage: setContextImage, setImageDimensions: setContextImageDimensions } = useContext(ImageContext);

	const { acceptedFiles, getRootProps, getInputProps } = useDropzone({
		accept: {
			"image/*": [".png", ".jpg", ".jpeg", ".gif", ".bmp", ".webp", ".tiff", ".svg"],
		},
	});

	const [image, setImage] = useState<HTMLImageElement>();
	const [imageDimensions, setImageDimensions] = useState<Dimension>({ width: 0, height: 0 });
	const [aspectRatio, setAspectRatio] = useState(1);

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

		setImageDimensions(() => {
			if (isWidth) {
				return { width: newDimension, height: Math.round(newDimension / aspectRatio) };
			} else {
				return { width: Math.round(newDimension / aspectRatio), height: newDimension };
			}
		});
	};

	const onSubmit = () => {
		if (image) {
			setContextImage(image);
			setContextImageDimensions(imageDimensions);
			close();
		}
	};

	return (
		<DialogContent>
			<DialogHeader>
				<DialogTitle>Open Image</DialogTitle>
				<DialogDescription>Open your image to load as blocks into the canvas</DialogDescription>
			</DialogHeader>

			<div className="flex flex-col gap-2">
				<div
					{...getRootProps({
						className: "flex flex-col justify-center items-center gap-2 p-4 rounded border border-2 border-dashed select-none",
					})}
				>
					<input {...getInputProps({ multiple: false })} />
					<UploadIcon />
					<p>Drag and drop your image here</p>
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
									<Label>File name</Label>
									<p>{acceptedFiles[0].name}</p>
								</div>

								<div>
									<Label htmlFor="width">Width (blocks)</Label>
									<Input type="number" id="width" placeholder="Width" value={imageDimensions.width} onChange={(e) => onDimensionChange(e, true)} />
								</div>

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
						</>
					)}
				</div>
			</div>

			<DialogFooter className="items-center">
				{imageDimensions.height > 384 && (
					<div className="flex items-center gap-1 h-min mr-auto">
						<CircleAlertIcon className="text-red-400" size={22} />
						<span className="text-red-400 text-sm">The height is above 384 blocks!</span>
					</div>
				)}

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

export default OpenImage;
