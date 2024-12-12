import { MenubarRadioGroup, MenubarRadioItem, MenubarSub, MenubarSubContent, MenubarSubTrigger } from '@/components/ui/menubar';
import { useTheme } from '@/context/ThemeContext';

function ThemeChanger() {
  const { setTheme, theme } = useTheme();

  return (
    <MenubarSub>
      <MenubarSubTrigger>Set theme...</MenubarSubTrigger>
      <MenubarSubContent>
        <MenubarRadioGroup value={theme} onValueChange={(value) => setTheme(value as Theme)}>
          <MenubarRadioItem value='light'>Light</MenubarRadioItem>
          <MenubarRadioItem value='dark'>Dark</MenubarRadioItem>
          <MenubarRadioItem value='system'>System</MenubarRadioItem>
        </MenubarRadioGroup>
      </MenubarSubContent>
    </MenubarSub>
  )
}

export default ThemeChanger