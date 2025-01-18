import { useContext } from "react";
import { Link } from "react-router";

import { DialogProvider } from "@/context/Dialog";
import { ThemeContext } from "@/context/Theme";

import { Menubar as UIMenubar } from "@/components/ui/menubar";

import FileMenu from "./FileMenu";
import EditMenu from "./EditMenu";
import ViewMenu from "./ViewMenu";
import MoreMenu from "./MoreMenu";

import BlockmaticIcon from "@/assets/blockmatic-icon-colored.svg?react";
import BlockmaticText from "@/assets/blockmatic-text-colored.svg?react";
import GithubIcon from "@/assets/github.svg?react";

function Menubar() {
	const { isDark } = useContext(ThemeContext);

	return (
		<DialogProvider>
			<UIMenubar className="rounded-none border-t-0 border-x-0 col-span-3">
				<Link to={{ pathname: "/" }} className="px-4 w-40 flex gap-2 items-center">
					<BlockmaticIcon className="h-full w-8" />
					<BlockmaticText className="h-full w-full" />
				</Link>

				<FileMenu />
				<EditMenu />
				<ViewMenu />
				<MoreMenu />

				<a href="https://github.com/trafficlunar/blockmatic" className="w-6 absolute right-2">
					<GithubIcon fill={isDark ? "white" : "black"} />
				</a>
			</UIMenubar>
		</DialogProvider>
	);
}

export default Menubar;
