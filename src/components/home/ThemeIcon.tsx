import { useContext } from "react";
import { ThemeContext } from "@/context/Theme";
import { MoonIcon, SunIcon, SunMoonIcon } from "lucide-react";

function ThemeIcon() {
	const { theme, setTheme } = useContext(ThemeContext);

	const onClick = () => {
		const nextTheme = theme === "light" ? "dark" : theme === "dark" ? "system" : "light";
		setTheme(nextTheme);
	};

	const getIcon = () => {
		switch (theme) {
			case "light":
				return <SunIcon size={30} />;
			case "dark":
				return <MoonIcon size={30} />;
			case "system":
				return <SunMoonIcon size={30} />;
		}
	};

	return (
		<button onClick={onClick} title={theme} className="text-white">
			{getIcon()}
		</button>
	);
}

export default ThemeIcon;
