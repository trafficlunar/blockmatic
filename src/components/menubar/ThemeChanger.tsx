import { useContext } from "react";
import { ThemeContext } from "@/context/Theme";
import { MenubarRadioGroup, MenubarRadioItem, MenubarSub, MenubarSubContent, MenubarSubTrigger } from "@/components/ui/menubar";

function ThemeChanger() {
	const { setTheme, theme } = useContext(ThemeContext);

	return (
		<MenubarSub>
			<MenubarSubTrigger>Set theme...</MenubarSubTrigger>
			<MenubarSubContent>
				<MenubarRadioGroup value={theme} onValueChange={(value) => setTheme(value as Theme)}>
					<MenubarRadioItem value="light">Light</MenubarRadioItem>
					<MenubarRadioItem value="dark">Dark</MenubarRadioItem>
					<MenubarRadioItem value="system">System</MenubarRadioItem>
				</MenubarRadioGroup>
			</MenubarSubContent>
		</MenubarSub>
	);
}

export default ThemeChanger;
