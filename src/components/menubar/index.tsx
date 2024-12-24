import { Link } from "react-router";

import { Menubar as UIMenubar } from "@/components/ui/menubar";
import { DialogProvider } from "@/context/Dialog";

import FileMenu from "./FileMenu";
import ViewMenu from "./ViewMenu";
import MoreMenu from "./MoreMenu";

import BlockmaticText from "@/assets/blockmatic-text.svg?react";
import GithubIcon from "@/assets/github.svg?react";

function Menubar() {
	return (
		<DialogProvider>
			<UIMenubar className="rounded-none border-t-0 border-x-0 col-span-2">
				<Link to={{ pathname: "/" }} className="px-4 w-32">
					<BlockmaticText className="h-full w-full" fill="white" />
				</Link>

				<FileMenu />
				<ViewMenu />
				<MoreMenu />

				<a href="https://github.com/trafficlunar/blockmatic" className="w-5 absolute right-2">
					<GithubIcon fill="white" />
				</a>
			</UIMenubar>
		</DialogProvider>
	);
}

export default Menubar;
