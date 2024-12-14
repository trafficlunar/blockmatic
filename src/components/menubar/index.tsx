import { Link } from "react-router";

import { Menubar as UIMenubar } from "@/components/ui/menubar";
import { DialogProvider } from "@/context/DialogContext";

import FileMenu from "./FileMenu";
import ViewMenu from "./ViewMenu";
import MoreMenu from "./MoreMenu";

import BlockmaticText from "@/assets/blockmatic-text.svg?react";

function Menubar() {
	return (
		<DialogProvider>
			<UIMenubar className="rounded-none border-t-0 border-x-0 col-span-2">
				<Link to={{ pathname: "/" }} className="px-4 w-32">
					<BlockmaticText className="h-full w-full" />
				</Link>

				<FileMenu />
				<ViewMenu />
				<MoreMenu />
			</UIMenubar>
		</DialogProvider>
	);
}

export default Menubar;
