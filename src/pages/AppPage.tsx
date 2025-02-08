import { CanvasProvider } from "@/context/Canvas";
import { HistoryProvider } from "@/context/History";
import { LoadingProvider } from "@/context/Loading";
import { SelectionProvider } from "@/context/Selection";
import { SettingsProvider } from "@/context/Settings";
import { TexturesProvider } from "@/context/Textures";
import { ToolProvider } from "@/context/Tool";

import MobileNotice from "@/components/MobileNotice";
import Menubar from "@/components/menubar";
import Toolbar from "@/components/toolbar";
import Canvas from "@/components/canvas/Canvas";
import Sidebar from "@/components/sidebar";

function AppPage() {
	return (
		<LoadingProvider>
			<SettingsProvider>
				<HistoryProvider>
					<CanvasProvider>
						<TexturesProvider>
							<ToolProvider>
								<SelectionProvider>
									<MobileNotice />

									<main className="overflow-y-hidden h-screen grid grid-rows-[2.5rem_minmax(0,1fr)] grid-cols-[2.5rem_minmax(0,1fr)_auto]">
										<Menubar />
										<Toolbar />
										<Canvas />
										<Sidebar />
									</main>
								</SelectionProvider>
							</ToolProvider>
						</TexturesProvider>
					</CanvasProvider>
				</HistoryProvider>
			</SettingsProvider>
		</LoadingProvider>
	);
}

export default AppPage;
