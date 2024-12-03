import { Menubar, MenubarContent, MenubarItem, MenubarMenu, MenubarSeparator, MenubarSub, MenubarSubContent, MenubarSubTrigger, MenubarTrigger } from "@/components/ui/menubar"
import ThemeChanger from "./components/menubar/theme-changer"

function App() {
  return (
    <>
      <Menubar>
        <MenubarMenu>
          <MenubarTrigger>File</MenubarTrigger>
          <MenubarContent>
            <MenubarItem>Open Schematic</MenubarItem>
            <MenubarItem>Open Image</MenubarItem>

            <MenubarSeparator />

            <MenubarSub>
              <MenubarSubTrigger>Export to...</MenubarSubTrigger>
              <MenubarSubContent>
                <MenubarItem>.schematic</MenubarItem>
                <MenubarItem>.litematic</MenubarItem>
                <MenubarItem>image</MenubarItem>
              </MenubarSubContent>
            </MenubarSub>
          </MenubarContent>
        </MenubarMenu>

        <MenubarMenu>
          <MenubarTrigger>More</MenubarTrigger>
          <MenubarContent>
						<ThemeChanger />
					</MenubarContent>
        </MenubarMenu>
      </Menubar>
    </>
  )
}

export default App
