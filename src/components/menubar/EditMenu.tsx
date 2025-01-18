import { useContext } from "react";

import { CanvasContext } from "@/context/Canvas";
import { ToolContext } from "@/context/Tool";

import { MenubarContent, MenubarItem, MenubarMenu, MenubarSeparator, MenubarTrigger } from "@/components/ui/menubar";

function EditMenu() {
	const { setBlocks } = useContext(CanvasContext);
	const { selectionBoxBounds, setSelectionBoxBounds } = useContext(ToolContext);

	const cut = () => {
		setBlocks((prev) =>
			prev.filter(
				(b) => !(b.x >= selectionBoxBounds.minX && b.x < selectionBoxBounds.maxX && b.y >= selectionBoxBounds.minY && b.y < selectionBoxBounds.maxY)
			)
		);
	};

	return (
		<MenubarMenu>
			<MenubarTrigger>Edit</MenubarTrigger>
			<MenubarContent>
				<MenubarItem onClick={cut}>Cut</MenubarItem>

				<MenubarSeparator />
				<MenubarItem onClick={() => setSelectionBoxBounds([])}>Clear Selection</MenubarItem>
			</MenubarContent>
		</MenubarMenu>
	);
}

export default EditMenu;
