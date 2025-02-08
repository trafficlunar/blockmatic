import { useContext } from "react";
import {
	MenubarCheckboxItem,
	MenubarContent,
	MenubarItem,
	MenubarMenu,
	MenubarSeparator,
	MenubarSub,
	MenubarSubContent,
	MenubarSubTrigger,
	MenubarTrigger,
} from "@/components/ui/menubar";

import { CanvasContext } from "@/context/Canvas";
import { DialogContext } from "@/context/Dialog";
import { SettingsContext } from "@/context/Settings";

function ViewMenu() {
	const { centerCanvas } = useContext(CanvasContext);
	const openDialog = useContext(DialogContext);
	const { settings, setSetting } = useContext(SettingsContext);

	const onCheckedChange = (key: keyof Settings) => (value: boolean) => {
		setSetting(key, value);
	};

	return (
		<MenubarMenu>
			<MenubarTrigger>View</MenubarTrigger>
			<MenubarContent>
				<MenubarItem onClick={() => openDialog("SetCoords")}>Set Coordinates</MenubarItem>
				<MenubarItem onClick={() => openDialog("SetScale")}>Set Scale</MenubarItem>
				<MenubarItem onClick={centerCanvas}>Center Canvas</MenubarItem>
				<MenubarSeparator />

				<MenubarCheckboxItem checked={settings.grid} onCheckedChange={onCheckedChange("grid")}>
					Grid
				</MenubarCheckboxItem>
				<MenubarCheckboxItem checked={settings.canvasBorder} onCheckedChange={onCheckedChange("canvasBorder")}>
					Canvas Border
				</MenubarCheckboxItem>

				<MenubarSeparator />
				<MenubarSub>
					<MenubarSubTrigger>Tabs</MenubarSubTrigger>
					<MenubarSubContent>
						<MenubarCheckboxItem checked={settings.historyPanel} onCheckedChange={onCheckedChange("historyPanel")}>
							History
						</MenubarCheckboxItem>
						<MenubarCheckboxItem checked={settings.colorPicker} onCheckedChange={onCheckedChange("colorPicker")}>
							Color Picker
						</MenubarCheckboxItem>
						<MenubarCheckboxItem checked={settings.blockReplacer} onCheckedChange={onCheckedChange("blockReplacer")}>
							Block Replacer
						</MenubarCheckboxItem>
					</MenubarSubContent>
				</MenubarSub>
				<MenubarCheckboxItem checked={settings.radiusChanger} onCheckedChange={onCheckedChange("radiusChanger")}>
					Radius Changer
				</MenubarCheckboxItem>
				<MenubarCheckboxItem checked={settings.blockSelector} onCheckedChange={onCheckedChange("blockSelector")}>
					Block Selector
				</MenubarCheckboxItem>
			</MenubarContent>
		</MenubarMenu>
	);
}

export default ViewMenu;
