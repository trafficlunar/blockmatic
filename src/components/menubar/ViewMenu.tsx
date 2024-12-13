import { useContext } from "react";
import { MenubarCheckboxItem, MenubarContent, MenubarMenu, MenubarTrigger } from "@/components/ui/menubar";
import { SettingsContext } from "@/context/SettingsContext";

function ViewMenu() {
	const { settings, setSetting } = useContext(SettingsContext);

	const onCheckedChange = (key: keyof Settings) => (value: boolean) => {
		setSetting(key, value);
	};

	return (
		<MenubarMenu>
			<MenubarTrigger>View</MenubarTrigger>
			<MenubarContent>
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
