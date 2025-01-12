import { useState } from "react";
import { ChevronsLeftRightIcon } from "lucide-react";

function ImageComparison() {
	const [sliderPosition, setSliderPosition] = useState(50);

	const onMouseMove = (e: React.MouseEvent) => {
		if (e.buttons !== 1) return;

		const rect = e.currentTarget.getBoundingClientRect();
		const newSliderPosition = ((e.clientX - rect.left) / rect.width) * 100;
		setSliderPosition(Math.min(100, Math.max(0, newSliderPosition)));
	};

	return (
		<div onMouseMove={onMouseMove} className="relative select-none w-full h-[calc(40vw*217/270)] flex justify-center">
			<img
				src="/bliss/bliss_original.png"
				alt="original version of bliss"
				draggable={false}
				className="absolute w-full -z-20"
				style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)`, imageRendering: "pixelated" }}
			/>

			<img
				src="/bliss/bliss.png"
				alt="blockmatic version of bliss"
				draggable={false}
				className="absolute w-full -z-20"
				style={{ clipPath: `inset(0 0 0 ${sliderPosition}%)` }}
			/>

			<div
				className="absolute top-0 w-0.5 h-full bg-zinc-200 -translate-x-1/2 flex items-center"
				style={{
					left: `${sliderPosition}%`,
				}}
			>
				<div className="bg-zinc-200 rounded-full absolute w-12 h-12 -translate-x-1/2 flex justify-center items-center cursor-pointer">
					<ChevronsLeftRightIcon color="black" size={30} />
				</div>
			</div>

			<span className="absolute top-[101.5%] left-1 text-zinc-500 text-xs">Windows XP Background 'Bliss' image owned by Microsoft Corporation</span>

			<div className="absolute right-2 top-1/2 w-1/5 h-1/5 flex justify-center items-center -z-10">
				<img
					src="/bliss/bliss_original_zoomed.png"
					alt="zoomed in version of blockmatic version of bliss"
					draggable={false}
					className="absolute w-full rounded-full"
					style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)`, imageRendering: "pixelated" }}
				/>

				<img
					src="/bliss/bliss_zoomed.png"
					alt="zoomed in version of blockmatic version of bliss"
					draggable={false}
					className="absolute w-full rounded-full"
					style={{ clipPath: `inset(0 0 0 ${sliderPosition}%)` }}
				/>
			</div>
		</div>
	);
}

export default ImageComparison;
