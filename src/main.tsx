import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router";
import { Analytics } from "@vercel/analytics/react";

import { ThemeProvider } from "@/context/Theme.tsx";

import IndexPage from "./pages/IndexPage.tsx";
import AppPage from "./pages/AppPage.tsx";

import "./index.css";

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<ThemeProvider>
			<BrowserRouter>
				<Routes>
					<Route path="/" element={<IndexPage />} />
					<Route path="/app" element={<AppPage />} />
				</Routes>

				<Analytics />
			</BrowserRouter>
		</ThemeProvider>
	</StrictMode>
);
