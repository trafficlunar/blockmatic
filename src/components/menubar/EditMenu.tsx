import { useContext } from "react";

import { CanvasContext } from "@/context/Canvas";
import { SelectionContext } from "@/context/Selection";

import { MenubarContent, MenubarItem, MenubarMenu, MenubarSeparator, MenubarTrigger } from "@/components/ui/menubar";

function EditMenu() {
	const { setBlocks } = useContext(CanvasContext);
	const { coords: selectionCoords, setCoords: setSelectionCoords } = useContext(SelectionContext);

	const cut = () => {
		setBlocks((prev) => prev.filter((b) => !selectionCoords.some(([x2, y2]) => x2 === b.x && y2 === b.y)));
	};

	return (
		<MenubarMenu>
			<MenubarTrigger>Edit</MenubarTrigger>
			<MenubarContent>
				<MenubarItem>Undo</MenubarItem>
				<MenubarItem>Redo</MenubarItem>
				<MenubarSeparator />

				<MenubarItem onClick={cut}>Cut</MenubarItem>

				<MenubarSeparator />
				<MenubarItem onClick={() => setSelectionCoords([])}>Clear Selection</MenubarItem>
			</MenubarContent>
		</MenubarMenu>
	);
}

export default EditMenu;
