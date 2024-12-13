import { MenubarContent, MenubarMenu, MenubarTrigger } from "@/components/ui/menubar";
import ThemeChanger from "./ThemeChanger";

function MoreMenu() {
	return (
		<MenubarMenu>
			<MenubarTrigger>More</MenubarTrigger>
			<MenubarContent>
				<ThemeChanger />
			</MenubarContent>
		</MenubarMenu>
	);
}

export default MoreMenu;
