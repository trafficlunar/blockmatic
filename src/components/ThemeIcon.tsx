import { useContext } from "react";
import { ThemeContext } from "@/context/Theme";
import { MoonIcon, SunIcon, SunMoonIcon } from "lucide-react";

interface Props {
	inApp?: boolean;
}

function ThemeIcon({ inApp }: Props) {
	const { theme, setTheme } = useContext(ThemeContext);

	const onClick = () => {
		const nextTheme = theme === "light" ? "dark" : theme === "dark" ? "system" : "light";
		setTheme(nextTheme);
	};

	const getIcon = () => {
		const size = inApp ? 24 : 30;

		switch (theme) {
			case "light":
				return <SunIcon size={size} />;
			case "dark":
				return <MoonIcon size={size} />;
			case "system":
				return <SunMoonIcon size={size} />;
		}
	};

	return (
		<button onClick={onClick} title={theme} className={`text-white ${inApp ? "text-black" : ""}`}>
			{getIcon()}
		</button>
	);
}

export default ThemeIcon;
