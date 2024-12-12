import {
	Menubar as UIMenubar,
	MenubarContent,
	MenubarItem,
	MenubarMenu,
	MenubarSeparator,
	MenubarSub,
	MenubarSubContent,
	MenubarSubTrigger,
	MenubarTrigger,
} from "@/components/ui/menubar";

import ThemeChanger from "./ThemeChanger";

function Menubar() {
	return (
		<UIMenubar className="rounded-none border-t-0 border-x-0 col-span-2">
			<MenubarMenu>
				<a href="https://github.com/trafficlunar/blockmatic" className="ml-4 mr-2">
					blockmatic
				</a>

				<MenubarTrigger>File</MenubarTrigger>
				<MenubarContent>
					<MenubarItem>Open Schematic</MenubarItem>
					<MenubarItem>Open Image</MenubarItem>

					<MenubarSeparator />

					<MenubarSub>
						<MenubarSubTrigger>Export to...</MenubarSubTrigger>
						<MenubarSubContent>
							<MenubarItem>.schematic</MenubarItem>
							<MenubarItem>.litematic</MenubarItem>
							<MenubarItem>image</MenubarItem>
						</MenubarSubContent>
					</MenubarSub>
				</MenubarContent>
			</MenubarMenu>

			<MenubarMenu>
				<MenubarTrigger>More</MenubarTrigger>
				<MenubarContent>
					<ThemeChanger />
				</MenubarContent>
			</MenubarMenu>
		</UIMenubar>
	);
}

export default Menubar;
