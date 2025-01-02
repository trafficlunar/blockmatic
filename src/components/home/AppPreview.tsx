import { useContext, useState } from "react";
import { ThemeContext } from "@/context/Theme";

function AppPreview() {
	const { isDark } = useContext(ThemeContext);

	const [leaving, setLeaving] = useState(true);
	const [transform, setTransform] = useState("");

	const onMouseEnter = () => {
		setLeaving(false);
	};

	const onMouseLeave = () => {
		setLeaving(true);
		setTransform("rotateX(0deg) rotateY(0deg)");
	};

	const onMouseMove = (e: React.MouseEvent) => {
		const rect = e.currentTarget.getBoundingClientRect();

		const x = e.clientX - rect.left;
		const y = e.clientY - rect.top;

		const centerX = rect.width / 2;
		const centerY = rect.height / 2;

		const rotateX = ((y - centerY) / centerY) * 10;
		const rotateY = ((centerX - x) / centerX) * 10;

		setTransform(`rotateX(${rotateX}deg) rotateY(${rotateY}deg)`);
	};

	return (
		<img
			src={isDark ? "/blockmatic_screenshot_dark.png" : "/blockmatic_screenshot_light.png"}
			alt="app preview"
			onMouseEnter={onMouseEnter}
			onMouseLeave={onMouseLeave}
			onMouseMove={onMouseMove}
			className={`w-[90%] rounded-xl mt-32 border border-zinc-700 ${
				leaving ? "transition-transform duration-500 ease-in-out" : "duration-100 ease-out"
			}`}
			style={{ transform }}
		/>
	);
}

export default AppPreview;
