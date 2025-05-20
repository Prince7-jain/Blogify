import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "./ThemeProvider";
import ThemeToggle from "./ThemeToggle";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  LogOut, 
  User, 
  FileText, 
  Settings, 
  Search, 
  Menu, 
  X, 
  Home, 
  BookOpen,
  TrendingUp,
  Bell,
  Eye,
  Sun,
  Moon,
  Check
} from "lucide-react";
import { cn } from "@/lib/utils";

const Header = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const { eyeCare, toggleColorTemperature } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      avatar: "S",
      name: "Sarah Wilson",
      action: "commented on your post.",
      time: "2 minutes ago",
      read: false,
      avatarColor: "bg-blue-100 text-blue-700"
    },
    {
      id: 2,
      avatar: "A",
      name: "Alex Johnson",
      action: "liked your post.",
      time: "1 hour ago",
      read: false,
      avatarColor: "bg-green-100 text-green-700"
    }
  ]);
  
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const toggleSearch = () => {
    setSearchOpen(!searchOpen);
    if (!searchOpen) {
      setTimeout(() => {
        document.getElementById("search-input")?.focus();
      }, 100);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Implement search functionality
    console.log("Searching for:", searchQuery);
    setSearchOpen(false);
    // Add actual search implementation
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };
  
  // Mark all notifications as read
  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    );
  };

  // Helper to check if a link is active
  const isLinkActive = (path: string) => {
    if (path === "/" && location.pathname === "/") return true;
    if (path !== "/" && location.pathname.startsWith(path)) return true;
    return false;
  };
  
  // Helper to get eye care icon and color
  const getEyeCareIcon = () => {
    if (eyeCare.colorTemperature === "warm") return <Sun className="h-5 w-5 text-amber-500" />;
    return <Eye className="h-5 w-5" />;
  };

  // Check if there are unread notifications
  const hasUnreadNotifications = notifications.some(notification => !notification.read);

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-border bg-solid-card backdrop-blur-none">
        <div className="container mx-auto h-16 flex items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-4">
            <button 
              className="lg:hidden p-2 rounded-full text-muted-foreground hover:bg-muted" 
              onClick={toggleMobileMenu}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            <Link to="/" className="font-serif text-2xl font-bold text-foreground">
              Blogify
            </Link>
            
            {/* Desktop Navigation */}
            <nav className="hidden lg:flex ml-6 gap-1">
              <Link 
                to="/" 
                className={cn(
                  "px-3 py-2 rounded-md text-sm font-medium transition-colors",
                  isLinkActive("/") 
                    ? "bg-primary/10 text-primary" 
                    : "text-foreground hover:text-primary hover:bg-muted"
                )}
              >
                Home
              </Link>
              <Link 
                to="/explore" 
                className={cn(
                  "px-3 py-2 rounded-md text-sm font-medium transition-colors",
                  isLinkActive("/explore") 
                    ? "bg-primary/10 text-primary" 
                    : "text-foreground hover:text-primary hover:bg-muted"
                )}
              >
                Explore
              </Link>
              <Link 
                to="/trending" 
                className={cn(
                  "px-3 py-2 rounded-md text-sm font-medium transition-colors",
                  isLinkActive("/trending") 
                    ? "bg-primary/10 text-primary" 
                    : "text-foreground hover:text-primary hover:bg-muted"
                )}
              >
                Trending
              </Link>
              <Link 
                to="/categories" 
                className={cn(
                  "px-3 py-2 rounded-md text-sm font-medium transition-colors",
                  isLinkActive("/categories") 
                    ? "bg-primary/10 text-primary" 
                    : "text-foreground hover:text-primary hover:bg-muted"
                )}
              >
                Categories
              </Link>
            </nav>
          </div>
          
          <div className="flex items-center gap-2 md:gap-3">
            {/* Search Button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleSearch}
              className="rounded-full"
              aria-label="Search"
            >
              <Search className="h-5 w-5" />
            </Button>
            
            {/* Notifications dropdown */}
            {user && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-full relative"
                    aria-label="Notifications"
                  >
                    <Bell className="h-5 w-5" />
                    {hasUnreadNotifications && (
                      <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500"></span>
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-80 bg-solid-card border border-border">
                  <div className="flex items-center justify-between p-2 border-b border-border">
                    <h3 className="font-medium">Notifications</h3>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-xs flex items-center gap-1"
                      onClick={markAllAsRead}
                    >
                      <Check className="h-3 w-3" />
                      Mark all as read
                    </Button>
                  </div>
                  <div className="py-2 px-3 text-sm">
                    {notifications.length > 0 ? (
                      notifications.map(notification => (
                        <div 
                          key={notification.id}
                          className={cn(
                            "flex gap-3 items-start mb-3 p-2 rounded hover:bg-muted",
                            notification.read ? "" : "bg-primary/5"
                          )}
                        >
                          <Avatar className="h-8 w-8 mt-1">
                            <AvatarFallback className={notification.avatarColor}>
                              {notification.avatar}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p>
                              <span className="font-medium">{notification.name}</span> {notification.action}
                            </p>
                            <p className="text-muted-foreground text-xs mt-1">{notification.time}</p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-4 text-muted-foreground">
                        No notifications yet
                      </div>
                    )}
                  </div>
                  <DropdownMenuSeparator className="bg-border" />
                  <div className="p-2">
                    <Button asChild variant="ghost" size="sm" className="w-full justify-center">
                      <Link to="/notifications">View all notifications</Link>
                    </Button>
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
            
            {/* Eye Care Toggle Button - Only visible on medium screens and up */}
            <Button
              variant="outline"
              size="sm"
              onClick={toggleColorTemperature}
              className={cn(
                "relative flex items-center gap-1 border border-primary/20 hidden md:flex",
                eyeCare.colorTemperature === "warm" ? "bg-amber-100 text-amber-700 border-amber-300" : ""
              )}
              aria-label="Toggle eye care mode"
              title={
                eyeCare.colorTemperature === "normal" ? "Enable Eye Care Filter" :
                "Eye Care Filter (On)"
              }
            >
              {getEyeCareIcon()}
              <span className="hidden sm:inline">
                Eye Care
              </span>
              {eyeCare.colorTemperature === "warm" && (
                <span className="absolute -top-1 -right-1 h-2.5 w-2.5 rounded-full bg-amber-500" />
              )}
            </Button>
          
            {/* Theme Toggle - Only visible on medium screens and up */}
            <div className="hidden md:block">
              <ThemeToggle />
            </div>
          
            {user ? (
              <>
                <Button 
                  asChild 
                  variant="outline" 
                  size="sm" 
                  className="bg-primary/10 border-primary/20 text-primary hover:bg-primary/20 hidden md:flex"
                >
                  <Link to="/editor/new">New Post</Link>
                </Button>
                
                {/* Sign Out Button - Desktop */}
                <Button 
                  onClick={handleLogout}
                  variant="destructive" 
                  size="sm"
                  className="hidden lg:flex items-center gap-1"
                >
                  <LogOut className="h-4 w-4 mr-1" />
                  Sign Out
                </Button>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Avatar className="h-9 w-9 cursor-pointer">
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        {user.name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56 bg-solid-card border border-border">
                    <div className="px-2 py-1.5 text-sm border-b border-border">
                      <p className="font-medium text-foreground">{user.name}</p>
                      <p className="text-muted-foreground text-xs truncate">{user.email}</p>
                    </div>
                    <DropdownMenuItem asChild>
                      <Link to="/profile" className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        <span>Profile</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link 
                        to="/dashboard" 
                        className={cn(
                          "flex items-center gap-2",
                          isLinkActive("/dashboard") && "bg-muted"
                        )}
                      >
                        <FileText className="h-4 w-4" />
                        <span>My Posts</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link 
                        to="/settings" 
                        className={cn(
                          "flex items-center gap-2",
                          isLinkActive("/settings") && "bg-muted"
                        )}
                      >
                        <Settings className="h-4 w-4" />
                        <span>Settings</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="bg-border" />
                    <DropdownMenuItem 
                      className="flex items-center gap-2 text-red-600 focus:text-red-700"
                      onClick={handleLogout}
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Logout</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <>
                <Button asChild variant="ghost" size="sm" className="hidden md:inline-flex">
                  <Link to="/signup">Sign Up</Link>
                </Button>
                <Button asChild variant="default" size="sm" className="bg-solid-primary text-primary-foreground hover:bg-primary/90">
                  <Link to="/login">Login</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <div 
        className={cn(
          "fixed inset-0 z-30 bg-black/80 lg:hidden transition-opacity duration-200",
          mobileMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={toggleMobileMenu}
      />
      
      <div
        className={cn(
          "fixed top-16 left-0 bottom-0 z-30 w-64 bg-solid-card border-r border-border shadow-lg transform transition-transform duration-200 ease-in-out lg:hidden overflow-y-auto",
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <nav className="p-4 h-full flex flex-col">
          <div className="space-y-1">
            <Link 
              to="/" 
              className={cn(
                "flex items-center gap-2 px-3 py-2 rounded-md",
                isLinkActive("/") 
                  ? "bg-primary/10 text-primary" 
                  : "hover:bg-muted"
              )}
              onClick={() => setMobileMenuOpen(false)}
            >
              <Home className="h-5 w-5" />
              <span>Home</span>
            </Link>
            <Link 
              to="/explore" 
              className={cn(
                "flex items-center gap-2 px-3 py-2 rounded-md",
                isLinkActive("/explore") 
                  ? "bg-primary/10 text-primary" 
                  : "hover:bg-muted"
              )}
              onClick={() => setMobileMenuOpen(false)}
            >
              <BookOpen className="h-5 w-5" />
              <span>Explore</span>
            </Link>
            <Link 
              to="/trending" 
              className={cn(
                "flex items-center gap-2 px-3 py-2 rounded-md",
                isLinkActive("/trending") 
                  ? "bg-primary/10 text-primary" 
                  : "hover:bg-muted"
              )}
              onClick={() => setMobileMenuOpen(false)}
            >
              <TrendingUp className="h-5 w-5" />
              <span>Trending</span>
            </Link>
            <Link 
              to="/categories" 
              className={cn(
                "flex items-center gap-2 px-3 py-2 rounded-md",
                isLinkActive("/categories") 
                  ? "bg-primary/10 text-primary" 
                  : "hover:bg-muted"
              )}
              onClick={() => setMobileMenuOpen(false)}
            >
              <FileText className="h-5 w-5" />
              <span>Categories</span>
            </Link>
          </div>
          
          {/* Eye Care and Theme options in mobile menu */}
          <div className="mt-4 border-t border-border pt-4">
            <div className="px-3 py-2 text-sm font-medium text-muted-foreground mb-2">
              Display Settings
            </div>
            <button
              onClick={() => {
                toggleColorTemperature();
                setMobileMenuOpen(false);
              }}
              className={cn(
                "flex items-center justify-between w-full px-3 py-2 rounded-md",
                eyeCare.colorTemperature === "warm" ? "bg-amber-100/50 text-amber-700" : "hover:bg-muted"
              )}
            >
              <div className="flex items-center gap-2">
                {getEyeCareIcon()}
                <span>Eye Care Mode</span>
              </div>
              {eyeCare.colorTemperature === "warm" && (
                <span className="text-xs bg-amber-200 text-amber-800 px-2 py-0.5 rounded-full">ON</span>
              )}
            </button>
            
            <div className="px-3 py-2 flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Moon className="h-5 w-5" />
                <span>Theme</span>
              </span>
              <div className="mt-1">
                <ThemeToggle />
              </div>
            </div>
          </div>
          
          {user && (
            <>
              <Link 
                to="/editor/new" 
                className="flex items-center justify-center gap-2 px-3 py-2 mt-4 bg-solid-primary text-primary-foreground rounded-md"
                onClick={() => setMobileMenuOpen(false)}
              >
                <FileText className="h-5 w-5" />
                <span>New Post</span>
              </Link>
              
              <div className="mt-4 space-y-1">
                <Link 
                  to="/dashboard" 
                  className={cn(
                    "flex items-center gap-2 px-3 py-2 rounded-md",
                    isLinkActive("/dashboard") 
                      ? "bg-primary/10 text-primary" 
                      : "hover:bg-muted"
                  )}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <FileText className="h-5 w-5" />
                  <span>My Posts</span>
                </Link>
                
                <Link 
                  to="/settings" 
                  className={cn(
                    "flex items-center gap-2 px-3 py-2 rounded-md",
                    isLinkActive("/settings") 
                      ? "bg-primary/10 text-primary" 
                      : "hover:bg-muted"
                  )}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Settings className="h-5 w-5" />
                  <span>Settings</span>
                </Link>
              </div>
              
              {/* Mobile Sign Out Button */}
              <button
                onClick={() => {
                  handleLogout();
                  setMobileMenuOpen(false);
                }}
                className="mt-auto flex items-center justify-center gap-2 px-3 py-2 bg-red-600 text-white rounded-md w-full"
              >
                <LogOut className="h-5 w-5" />
                <span>Sign Out</span>
              </button>
            </>
          )}

          {!user && (
            <div className="mt-4 space-y-2">
              <Link 
                to="/signup" 
                className="flex items-center justify-center px-3 py-2 border border-primary text-primary rounded-md"
                onClick={() => setMobileMenuOpen(false)}
              >
                Sign Up
              </Link>
              <Link 
                to="/login" 
                className="flex items-center justify-center px-3 py-2 bg-solid-primary text-primary-foreground rounded-md"
                onClick={() => setMobileMenuOpen(false)}
              >
                Login
              </Link>
            </div>
          )}
        </nav>
      </div>

      {/* Global Search Overlay */}
      <div 
        className={cn(
          "fixed inset-0 z-50 bg-black/80 transition-opacity duration-200 flex items-start justify-center pt-20",
          searchOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={() => setSearchOpen(false)}
      >
        <div 
          className="w-full max-w-2xl mx-4 bg-solid-card rounded-lg shadow-lg overflow-hidden"
          onClick={e => e.stopPropagation()}
        >
          <form onSubmit={handleSearch} className="relative">
            <input
              id="search-input"
              type="text"
              placeholder="Search articles, topics, and authors..."
              className="w-full py-4 px-5 pr-12 text-foreground bg-solid-card outline-none border-b border-border"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
            <Button 
              type="submit" 
              variant="ghost" 
              size="icon" 
              className="absolute right-3 top-3"
            >
              <Search className="h-5 w-5" />
            </Button>
          </form>
          <div className="p-4 text-sm text-muted-foreground">
            <p>Try searching for topics, tags, or authors</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;
