import path from "path";
import { defineConfig } from "vite";

import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";
import { imagetools } from "vite-imagetools";

// https://vite.dev/config/
export default defineConfig({
	plugins: [react(), svgr(), imagetools()],
	resolve: {
		alias: {
			"@": path.resolve(__dirname, "./src"),
		},
	},
});
