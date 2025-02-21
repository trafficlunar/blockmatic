import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router";

import { ThemeProvider } from "@/context/Theme.tsx";

import IndexPage from "./pages/IndexPage.tsx";
import AppPage from "./pages/AppPage.tsx";
import PrivacyPolicy from "./pages/PrivacyPolicy.tsx";
import NotFound from "./pages/NotFound.tsx";

import "./index.css";

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<ThemeProvider>
			<BrowserRouter>
				<Routes>
					<Route path="/" element={<IndexPage />} />
					<Route path="/app" element={<AppPage />} />
					<Route path="/privacy-policy" element={<PrivacyPolicy />} />
					<Route path="*" element={<NotFound />} />
				</Routes>
			</BrowserRouter>
		</ThemeProvider>
	</StrictMode>
);
