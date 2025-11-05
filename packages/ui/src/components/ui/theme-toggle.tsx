import { IoMoon, IoSunny } from 'react-icons/io5';
import { useTheme } from '../theme-provider.js';
import { Button } from './button.js';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  function toggleTheme() {
    if (theme === 'dark') {
      setTheme('light');
    } else {
      setTheme('dark');
    }
  }

  return (
    <Button variant="outline" size="icon" onClick={toggleTheme}>
      {theme === 'dark' ? (
        <IoSunny className="h-5 w-5" />
      ) : (
        <IoMoon className="h-5 w-5" />
      )}
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
