import React, { useEffect, useMemo, useState } from "react";
import { Slider } from "@/components/ui/slider";

interface Props {
	scale: number;
	setScale: React.Dispatch<React.SetStateAction<number>>;
	blocks: Block[];
}

function CanvasInformation({ scale, setScale, blocks }: Props) {
	const canvasSize = useMemo(() => {
		let minX = Infinity,
			maxX = -Infinity;
		let minY = Infinity,
			maxY = -Infinity;

		blocks.forEach((coord) => {
			if (coord.x < minX) minX = coord.x;
			if (coord.x > maxX) maxX = coord.x;
			if (coord.y < minY) minY = coord.y;
			if (coord.y > maxY) maxY = coord.y;
		});

		return {
			x: maxX - minX,
			y: maxY - minY,
		};
	}, [blocks]);

	const onValueChange = (value: number[]) => {
		setScale(value[0]);
	};

	return (
		<div className="absolute right-4 bottom-4 flex items-end gap-1">
			<div className="flex flex-col items-end gap-1">
				<div className="info-child">{Math.floor(scale * 100)}%</div>
				<div className="info-child">
					<span>W: {canvasSize.x} </span>
					<span>H: {canvasSize.y}</span>
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
