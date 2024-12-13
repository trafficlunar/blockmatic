import { Menubar as UIMenubar } from "@/components/ui/menubar";

import FileMenu from "./FileMenu";
import ViewMenu from "./ViewMenu";
import MoreMenu from "./MoreMenu";

function Menubar() {
	return (
		<UIMenubar className="rounded-none border-t-0 border-x-0 col-span-2">
			<a href="https://github.com/trafficlunar/blockmatic" className="ml-4 mr-2">
				blockmatic
			</a>

			<FileMenu />
			<ViewMenu />
			<MoreMenu />
		</UIMenubar>
	);
}

export default Menubar;
