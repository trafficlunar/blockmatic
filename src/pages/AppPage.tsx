import { CanvasProvider } from "@/context/Canvas";
import { ImageProvider } from "../context/Image";
import { LoadingProvider } from "@/context/Loading";
import { SettingsProvider } from "../context/Settings";
import { TexturesProvider } from "../context/Textures";
import { ToolProvider } from "../context/Tool";

import Menubar from "../components/menubar";
import Toolbar from "../components/toolbar";
import Canvas from "../components/canvas/Canvas";

function AppPage() {
	return (
		<CanvasProvider>
			<ImageProvider>
				<LoadingProvider>
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
				</LoadingProvider>
			</ImageProvider>
		</CanvasProvider>
	);
}

export default AppPage;
