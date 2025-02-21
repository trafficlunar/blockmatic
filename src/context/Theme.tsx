import { createContext, useEffect, useState } from "react";

interface Props {
	children: React.ReactNode;
	defaultTheme?: Theme;
	storageKey?: string;
}

interface Context {
	theme: Theme;
	isDark: boolean;
	setTheme: (theme: Theme) => void;
}

export const ThemeContext = createContext<Context>({} as Context);

export function ThemeProvider({ children, defaultTheme = "system", storageKey = "vite-ui-theme", ...props }: Props) {
	const [theme, setTheme] = useState<Theme>(() => (localStorage.getItem(storageKey) as Theme) || defaultTheme);
	const [isDark, setIsDark] = useState(true);

	useEffect(() => {
		const root = window.document.documentElement;

		root.classList.remove("light", "dark");

		if (theme === "system") {
			const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches;

			root.classList.add(systemTheme ? "dark" : "light");
			setIsDark(systemTheme);
			return;
		}

		root.classList.add(theme);
		setIsDark(theme == "dark");
	}, [theme]);

	const value = {
		theme,
		isDark,
		setTheme: (theme: Theme) => {
			localStorage.setItem(storageKey, theme);
			setTheme(theme);
		},
	};

	return (
		<ThemeContext.Provider {...props} value={value}>
			{children}
		</ThemeContext.Provider>
	);
}
