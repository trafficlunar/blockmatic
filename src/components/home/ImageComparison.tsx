import { useState } from "react";
import { GripVerticalIcon } from "lucide-react";

function ImageComparison() {
	const [sliderPosition, setSliderPosition] = useState(50);

	const onPointerMove = (e: React.MouseEvent) => {
		if (e.buttons !== 1) return;

		const rect = e.currentTarget.getBoundingClientRect();
		const newSliderPosition = ((e.clientX - rect.left) / rect.width) * 100;
		setSliderPosition(Math.min(98, Math.max(2, newSliderPosition)));
	};

	return (
		<div
			onPointerMove={onPointerMove}
			className="relative select-none w-full aspect-[270/217] aspect flex justify-center rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-md"
		>
			<img
				src="/bliss/bliss_original.png"
				alt="original version of bliss"
				draggable={false}
				className="absolute w-full -z-20 rounded-xl"
				style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)`, imageRendering: "pixelated" }}
			/>

			<img
				src="/bliss/bliss.png"
				alt="blockmatic version of bliss"
				draggable={false}
				className="absolute w-full -z-20 rounded-xl"
				style={{ clipPath: `inset(0 0 0 ${sliderPosition}%)` }}
			/>

			<div
				className="absolute top-0 w-0.5 h-full bg-zinc-200 -translate-x-1/2 flex items-center"
				style={{
					left: `${sliderPosition}%`,
				}}
			>
				<button className="bg-zinc-200 rounded hover:scale-110 transition-all w-5 h-10 select-none -translate-y-1/2 absolute top-1/2 -ml-2 z-30 cursor-ew-resize flex justify-center items-center">
					<GripVerticalIcon color="black" className="w-4 h-4" />
				</button>
			</div>

			<span className="absolute top-[101.5%] left-1 text-zinc-500 text-xs">Windows XP Background 'Bliss' image owned by Microsoft Corporation</span>
		</div>
	);
}

export default ImageComparison;
