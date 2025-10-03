import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import QuickMoodHeader from '@/components/dashboard/QuickMoodHeader';
import { 
  Heart, 
  Menu, 
  X, 
  User, 
  LogOut, 
  Settings,
  MessageCircle,
  Calendar,
  BookOpen,
  Users,
  BarChart,
  Palette,
  Bell
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const Header = () => {
  const { user, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const getNavItems = () => {
    const baseItems = [
      { name: 'Resources', href: '/app/resources', icon: BookOpen },
      { name: 'Forum', href: '/app/forum', icon: Users },
    ];

    if (user?.role === 'student') {
      return [
        { name: 'Dashboard', href: '/app/student-dashboard', icon: BarChart },
        { name: 'Chat', href: '/app/chat', icon: MessageCircle },
        { name: 'Book Session', href: '/app/booking', icon: Calendar },
        ...baseItems,
      ];
    }

    if (user?.role === 'counselor') {
      return [
        { name: 'Sessions', href: '/app/sessions', icon: Calendar },
        { name: 'Chat Support', href: '/app/chat-support', icon: MessageCircle },
        ...baseItems,
      ];
    }

    if (user?.role === 'admin') {
      return [
        { name: 'Dashboard', href: '/app/dashboard', icon: BarChart },
        { name: 'Sessions', href: '/app/sessions', icon: Calendar },
        { name: 'Users', href: '/app/users', icon: Users },
        ...baseItems,
      ];
    }

    return baseItems;
  };

  const navItems = getNavItems();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-sm shadow-subtle">
      <div className="container flex h-20 items-center px-6">
        {/* Logo */}
        <Link 
          to="/" 
          className="flex items-center space-x-3 mr-10 group gentle-transition gentle-hover"
        >
          <div className="relative">
            <div className="p-2 rounded-lg bg-primary/10 border border-primary/20 group-hover:bg-primary/15 gentle-transition">
              <Heart className="h-8 w-8 text-primary" />
            </div>
          </div>
          <span className="hidden font-bold text-2xl sm:inline-block text-primary">
            MindBuddy
          </span>
        </Link>

        {/* Desktop Navigation */}
        {user && (
          <nav className="hidden lg:flex items-center space-x-2 text-sm font-medium">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className="flex items-center space-x-2 px-4 py-2.5 rounded-lg text-muted-foreground hover:text-primary hover:bg-accent gentle-transition"
              >
                <item.icon className="h-5 w-5" />
                <span className="font-medium">{item.name}</span>
              </Link>
            ))}
          </nav>
        )}

        <div className="flex flex-1 items-center justify-end space-x-4">
          {/* Quick Mood Header - Only for students */}
          {user?.role === 'student' && (
            <div className="hidden md:block">
              <QuickMoodHeader variant="dropdown" showTrend={false} />
            </div>
          )}
          
          {/* Theme Toggle */}
          <div className="hidden sm:block">
            <ThemeToggle />
          </div>
          
          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden relative rounded-lg bg-muted/50 hover:bg-muted gentle-transition"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>

          {/* User Menu */}
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-12 w-12 rounded-lg bg-muted/50 hover:bg-muted gentle-transition">
                  <User className="h-6 w-6" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-64 bg-popover backdrop-blur-sm border-border shadow-card rounded-lg" align="end" forceMount>
                <DropdownMenuLabel className="font-normal p-4">
                  <div className="flex flex-col space-y-2">
                    <p className="text-base font-semibold leading-none text-foreground">{user.name}</p>
                    <p className="text-sm leading-none text-muted-foreground capitalize bg-primary/10 px-2 py-1 rounded-md inline-block w-fit">
                      {user.role}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/app/profile" className="flex items-center p-3 rounded-lg hover:bg-accent focus:bg-accent gentle-transition">
                    <User className="mr-3 h-5 w-5" />
                    <span className="font-medium">Profile</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/app/notifications" className="flex items-center p-3 rounded-lg hover:bg-accent focus:bg-accent gentle-transition">
                    <Bell className="mr-3 h-5 w-5" />
                    <span className="font-medium">Notifications</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/app/theme-settings" className="flex items-center p-3 rounded-lg hover:bg-accent focus:bg-accent gentle-transition">
                    <Palette className="mr-3 h-5 w-5" />
                    <span className="font-medium">Theme & Reading</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/app/settings" className="flex items-center p-3 rounded-lg hover:bg-accent focus:bg-accent gentle-transition">
                    <Settings className="mr-3 h-5 w-5" />
                    <span className="font-medium">Settings</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  onClick={logout}
                  className="text-destructive hover:text-destructive-foreground hover:bg-destructive/10 p-3 rounded-lg gentle-transition"
                >
                  <LogOut className="mr-3 h-5 w-5" />
                  <span className="font-medium">Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button asChild variant="default" size="lg" className="shadow-sm hover:shadow-card">
              <Link to="/login" className="font-semibold">Get Started</Link>
            </Button>
          )}
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-t bg-background/80 backdrop-blur-sm fade-in">
          <div className="container py-6 px-6">
            {user ? (
              <nav className="flex flex-col space-y-3">
                {navItems.map((item, index) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center space-x-3 px-4 py-3 rounded-lg text-base font-medium text-muted-foreground hover:text-primary hover:bg-accent gentle-transition fade-in"
                    style={{animationDelay: `${index * 50}ms`}}
                  >
                    <item.icon className="h-5 w-5" />
                    <span>{item.name}</span>
                  </Link>
                ))}
                <div className="pt-4 border-t">
                  <ThemeToggle />
                </div>
              </nav>
            ) : (
              <div className="flex flex-col space-y-4">
                <ThemeToggle />
                <Button asChild variant="default" size="lg" className="w-full shadow-sm hover:shadow-card">
                  <Link to="/login" onClick={() => setIsMobileMenuOpen(false)}>Get Started</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;