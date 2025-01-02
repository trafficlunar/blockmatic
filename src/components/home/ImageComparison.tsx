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
		<div onMouseMove={onMouseMove} className="mt-10 relative select-none w-1/2 h-[calc(50vw*217/270)] flex justify-center">
			<img
				src="/bliss_original.png"
				alt="original version of bliss"
				draggable={false}
				className="absolute w-full"
				style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)`, imageRendering: "pixelated" }}
			/>

			<img
				src="/bliss.png"
				alt="blockmatic version of bliss"
				draggable={false}
				className="absolute w-full"
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

			<span className="absolute -bottom-6 left-1 text-zinc-500 text-xs">Windows XP Background 'Bliss' image owned by Microsoft Corporation</span>

			<div className="absolute left-[105%] bottom-48 bg-zinc-200 w-48 h-48 flex justify-center items-center">
				<div className="relative w-[11.5rem] h-[11.5rem]">
					<img
						src="/bliss_original_zoomed.png"
						alt="zoomed in version of blockmatic version of bliss"
						draggable={false}
						className="absolute w-full"
						style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)`, imageRendering: "pixelated" }}
					/>

					<img
						src="/bliss_zoomed.png"
						alt="zoomed in version of blockmatic version of bliss"
						draggable={false}
						className="absolute w-full"
						style={{ clipPath: `inset(0 0 0 ${sliderPosition}%)` }}
					/>

					<span className="text-zinc-500 absolute -bottom-7 text-xs">Use the slider to see this</span>
				</div>
			</div>
		</div>
	);
}

export default ImageComparison;
