import { CanvasProvider } from "@/context/Canvas";
import { ImageProvider } from "@/context/Image";
import { LoadingProvider } from "@/context/Loading";
import { SettingsProvider } from "@/context/Settings";
import { TexturesProvider } from "@/context/Textures";
import { ToolProvider } from "@/context/Tool";

import Menubar from "@/components/menubar";
import Toolbar from "@/components/toolbar";
import Canvas from "@/components/canvas/Canvas";
import ToolSettings from "@/components/tool-settings";

function AppPage() {
	return (
		<CanvasProvider>
			<ImageProvider>
				<LoadingProvider>
					<SettingsProvider>
						<TexturesProvider>
							<ToolProvider>
								<main className="h-screen grid grid-rows-[2.5rem_minmax(0,1fr)] grid-cols-[2.5rem_minmax(0,1fr)_auto]">
									<Menubar />
									<Toolbar />
									<Canvas />
									<ToolSettings />
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
