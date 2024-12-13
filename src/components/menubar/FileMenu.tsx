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

function FileMenu() {
	return (
		<MenubarMenu>
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
	);
}

export default FileMenu;