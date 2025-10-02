import { Moon, Sun, Monitor } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useTheme } from '@/contexts/ThemeContext';

export function ThemeToggle() {
  const { setTheme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          className="relative rounded-2xl bg-white/5 hover:bg-white/10 backdrop-blur-sm border border-white/10 hover:border-white/20 hover:scale-105 transition-all duration-200 group h-12 w-12"
        >
          <Sun className="h-6 w-6 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 group-hover:scale-110" />
          <Moon className="absolute h-6 w-6 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 group-hover:scale-110" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="bg-white/10 backdrop-blur-2xl border-white/20 shadow-floating rounded-2xl">
        <DropdownMenuItem onClick={() => setTheme('light')} className="p-3 rounded-xl hover:bg-white/10 transition-all duration-200 group">
          <Sun className="mr-3 h-5 w-5 group-hover:scale-110 transition-transform duration-200" />
          <span className="font-medium">Light</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('dark')} className="p-3 rounded-xl hover:bg-white/10 transition-all duration-200 group">
          <Moon className="mr-3 h-5 w-5 group-hover:scale-110 transition-transform duration-200" />
          <span className="font-medium">Dark</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('system')} className="p-3 rounded-xl hover:bg-white/10 transition-all duration-200 group">
          <Monitor className="mr-3 h-5 w-5 group-hover:scale-110 transition-transform duration-200" />
          <span className="font-medium">System</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}