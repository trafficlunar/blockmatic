import { useContext } from "react";

import { CanvasContext } from "@/context/Canvas";
import { HistoryContext } from "@/context/History";
import { SelectionContext } from "@/context/Selection";
import { ToolContext } from "@/context/Tool";

import * as clipboard from "@/utils/clipboard";

import { MenubarContent, MenubarItem, MenubarMenu, MenubarSeparator, MenubarShortcut, MenubarTrigger } from "@/components/ui/menubar";

function EditMenu() {
	const { blocks, setBlocks } = useContext(CanvasContext);
	const { undo, redo, isUndoAvailable, isRedoAvailable } = useContext(HistoryContext);
	const { selectionCoords, setSelectionCoords, setSelectionLayerBlocks } = useContext(SelectionContext);
	const { setTool } = useContext(ToolContext);

	const cut = () => {
		setBlocks((prev) => prev.filter((b) => !selectionCoords.some(([x2, y2]) => x2 === b.x && y2 === b.y)));
	};

	return (
		<MenubarMenu>
			<MenubarTrigger>Edit</MenubarTrigger>
			<MenubarContent>
				<MenubarItem onClick={undo} disabled={!isUndoAvailable}>
					Undo
					<MenubarShortcut>Ctrl Z</MenubarShortcut>
				</MenubarItem>
				<MenubarItem onClick={redo} disabled={!isRedoAvailable}>
					Redo
					<MenubarShortcut>Ctrl Y</MenubarShortcut>
				</MenubarItem>
				<MenubarSeparator />

				<MenubarItem onClick={() => clipboard.copy(selectionCoords, blocks)}>
					Copy
					<MenubarShortcut>Ctrl C</MenubarShortcut>
				</MenubarItem>
				<MenubarItem onClick={() => clipboard.paste(setSelectionLayerBlocks, setSelectionCoords, setTool)}>
					Paste
					<MenubarShortcut>Ctrl V</MenubarShortcut>
				</MenubarItem>
				<MenubarSeparator />

				<MenubarItem onClick={cut}>Cut</MenubarItem>
			</MenubarContent>
		</MenubarMenu>
	);
}

export default EditMenu;
