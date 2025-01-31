import { useContext } from "react";

import { SelectionContext } from "@/context/Selection";

import { MenubarContent, MenubarItem, MenubarMenu, MenubarShortcut, MenubarTrigger } from "@/components/ui/menubar";
import { CanvasContext } from "@/context/Canvas";

import * as selection from "@/utils/selection";

function SelectMenu() {
	const { canvasSize } = useContext(CanvasContext);
	const { coords: selectionCoords, setCoords: setSelectionCoords } = useContext(SelectionContext);

	return (
		<MenubarMenu>
			<MenubarTrigger>Select</MenubarTrigger>
			<MenubarContent>
				<MenubarItem onClick={() => setSelectionCoords([])}>Clear</MenubarItem>
			</MenubarContent>
		</MenubarMenu>
	);
}

export default SelectMenu;
