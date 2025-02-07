import { useContext } from "react";

import { SelectionContext } from "@/context/Selection";

import { MenubarContent, MenubarItem, MenubarMenu, MenubarShortcut, MenubarTrigger } from "@/components/ui/menubar";
import { CanvasContext } from "@/context/Canvas";

import * as selection from "@/utils/selection";

function SelectMenu() {
	const { canvasSize } = useContext(CanvasContext);
	const { selectionCoords, setSelectionCoords } = useContext(SelectionContext);

	// Add every block within the canvas size to the temporary array
	const selectAll = () => {
		const newSelection: CoordinateArray = [];

		for (let x = canvasSize.minX; x < canvasSize.maxX; x++) {
			for (let y = canvasSize.minY; y < canvasSize.maxY; y++) {
				newSelection.push([x, y]);
			}
		}

		setSelectionCoords(newSelection);
	};

	// Add every block that isn't within in the selectio and within the canvas size to the temporary array
	const inverse = () => {
		const newSelection: CoordinateArray = [];

		for (let x = canvasSize.minX; x < canvasSize.maxX; x++) {
			for (let y = canvasSize.minY; y < canvasSize.maxY; y++) {
				if (!selection.isIn(selectionCoords, x, y)) newSelection.push([x, y]);
			}
		}

		setSelectionCoords(newSelection);
	};

	return (
		<MenubarMenu>
			<MenubarTrigger>Select</MenubarTrigger>
			<MenubarContent>
				<MenubarItem onClick={selectAll}>
					All
					<MenubarShortcut>Ctrl A</MenubarShortcut>
				</MenubarItem>
				<MenubarItem onClick={() => setSelectionCoords([])}>Clear</MenubarItem>
				<MenubarItem onClick={inverse}>Inverse</MenubarItem>
			</MenubarContent>
		</MenubarMenu>
	);
}

export default SelectMenu;
