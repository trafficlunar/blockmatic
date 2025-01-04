import { useContext } from "react";

import {
	MenubarContent,
	MenubarItem,
	MenubarMenu,
	MenubarSeparator,
	MenubarSub,
	MenubarSubContent,
	MenubarSubTrigger,
	MenubarTrigger,
} from "@/components/ui/menubar";

import { DialogContext } from "@/context/Dialog";

function FileMenu() {
	const openDialog = useContext(DialogContext);

	return (
		<MenubarMenu>
			<MenubarTrigger>File</MenubarTrigger>
			<MenubarContent>
				<MenubarItem>Open Schematic</MenubarItem>
				<MenubarItem onClick={() => openDialog("OpenImage")}>Open Image</MenubarItem>
				<MenubarSeparator />

				<MenubarSub>
					<MenubarSubTrigger>Export to...</MenubarSubTrigger>
					<MenubarSubContent>
						<MenubarItem onClick={() => openDialog("SaveSchem")}>.schem</MenubarItem>
						<MenubarItem onClick={() => openDialog("SaveLitematic")}>.litematic</MenubarItem>
						<MenubarItem onClick={() => openDialog("SaveImage")}>image</MenubarItem>
					</MenubarSubContent>
				</MenubarSub>
				<MenubarSeparator />

				<MenubarItem onClick={() => openDialog("SetVersion")}>Set Version</MenubarItem>
				<MenubarItem onClick={() => openDialog("ClearBlocks")}>Clear All Blocks</MenubarItem>
			</MenubarContent>
		</MenubarMenu>
	);
}

export default FileMenu;
