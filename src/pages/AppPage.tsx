import { ImageProvider } from "@/context/ImageContext";
import { SettingsProvider } from "../context/SettingsContext";
import { TexturesProvider } from "../context/TexturesContext";
import { ToolProvider } from "../context/ToolContext";

import Menubar from "../components/menubar";
import Toolbar from "../components/Toolbar";
import Canvas from "../components/Canvas";

function AppPage() {
	return (
		<ImageProvider>
			<SettingsProvider>
				<TexturesProvider>
					<ToolProvider>
						<main className="h-screen grid grid-rows-[2.5rem_1fr] grid-cols-[2.5rem_1fr]">
							<Menubar />
							<Toolbar />
							<Canvas />
						</main>
					</ToolProvider>
				</TexturesProvider>
			</SettingsProvider>
		</ImageProvider>
	);
}

export default AppPage;
