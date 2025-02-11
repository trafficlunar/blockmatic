import { useContext } from "react";
import { Link } from "react-router";

import { DialogProvider } from "@/context/Dialog";
import { ThemeContext } from "@/context/Theme";

import { Menubar as UIMenubar } from "@/components/ui/menubar";

import FileMenu from "./FileMenu";
import EditMenu from "./EditMenu";
import SelectMenu from "./SelectMenu";
import ViewMenu from "./ViewMenu";

import ThemeIcon from "@/components/ThemeIcon";

import BlockmaticIcon from "@/assets/blockmatic-icon-colored.svg?react";
import BlockmaticText from "@/assets/blockmatic-text-colored.svg?react";
import GithubIcon from "@/assets/github.svg?react";
import TrafficConeIcon from "@/assets/traffic_cone.svg?react";

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
				<SelectMenu />
				<ViewMenu />

				<div className="absolute right-3 grid grid-cols-3 items-center gap-1">
					<ThemeIcon inApp />
					<a href="https://github.com/trafficlunar/blockmatic" className="w-5">
						<GithubIcon fill={isDark ? "white" : "black"} />
					</a>
					<a href="https://trafficlunar.net" className="w-5">
						<TrafficConeIcon fill={isDark ? "white" : "black"} className="hover:fill-orange-400 transition-colors" />
					</a>
				</div>
			</UIMenubar>
		</DialogProvider>
	);
}

export default Menubar;
