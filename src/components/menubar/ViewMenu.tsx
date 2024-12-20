import { useContext } from "react";
import { MenubarCheckboxItem, MenubarContent, MenubarItem, MenubarMenu, MenubarSeparator, MenubarTrigger } from "@/components/ui/menubar";

import { DialogContext } from "@/context/Dialog";
import { SettingsContext } from "@/context/Settings";

function ViewMenu() {
	const openDialog = useContext(DialogContext);
	const { settings, setSetting } = useContext(SettingsContext);

	const onCheckedChange = (key: keyof Settings) => (value: boolean) => {
		setSetting(key, value);
	};

	return (
		<MenubarMenu>
			<MenubarTrigger>View</MenubarTrigger>
			<MenubarContent>
				<MenubarItem onClick={() => openDialog("SetScale")}>Set Scale</MenubarItem>
				<MenubarSeparator />
				<MenubarCheckboxItem checked={settings.grid} onCheckedChange={onCheckedChange("grid")}>
					Grid
				</MenubarCheckboxItem>
				<MenubarCheckboxItem checked={settings.canvasBorder} onCheckedChange={onCheckedChange("canvasBorder")}>
					Canvas Border
				</MenubarCheckboxItem>
			</MenubarContent>
		</MenubarMenu>
	);
}

export default ViewMenu;
