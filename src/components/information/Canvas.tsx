import React from "react";
import { Slider } from "@/components/ui/slider";

interface Props {
	scale: number;
	setScale: React.Dispatch<React.SetStateAction<number>>;
	canvasSize: CanvasSize;
}

function CanvasInformation({ scale, setScale, canvasSize }: Props) {
	const onValueChange = (value: number[]) => {
		setScale(value[0]);
	};

	return (
		<div className="absolute right-4 bottom-4 flex items-end gap-1">
			<div className="flex flex-col items-end gap-1">
				<div className="info-child">{Math.floor(scale * 100)}%</div>
				<div className="info-child">
					<span>W: {canvasSize.maxX - canvasSize.minX} </span>
					<span>H: {canvasSize.maxY - canvasSize.minY}</span>
				</div>
			</div>

			<div className="info-child">
				<Slider
					defaultValue={[1]}
					min={0.25}
					max={32}
					step={0.1}
					value={[scale]}
					onValueChange={onValueChange}
					orientation="vertical"
					className="!h-32"
				/>
			</div>
		</div>
	);
}

export default CanvasInformation;
