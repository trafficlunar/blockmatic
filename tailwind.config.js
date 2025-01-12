import tailwindcssAnimate from "tailwindcss-animate";

/** @type {import('tailwindcss').Config} */
export default {
	darkMode: ["class"],
	content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
	theme: {
		extend: {
			borderRadius: {
				lg: "var(--radius)",
				md: "calc(var(--radius) - 2px)",
				sm: "calc(var(--radius) - 4px)",
			},
			colors: {},
			fontFamily: {
				minecraft: ["Minecraft", "sans-serif"],
				inter: ["Inter", "sans-serif"],
			},
		},
	},
	plugins: [tailwindcssAnimate],
};
