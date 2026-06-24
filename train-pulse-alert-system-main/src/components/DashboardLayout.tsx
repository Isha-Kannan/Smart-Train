
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useAuth } from "@/context/AuthContext";
import { Menu, Search, Map, Ticket, Bell, MapPin, LogOut, User } from "lucide-react";
import { cn } from "@/lib/utils";

interface DashboardLayoutProps {
  children: React.ReactNode;
  title: string;
  activeTab?: string;
}

const DashboardLayout = ({ children, title, activeTab }: DashboardLayoutProps) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [openMenu, setOpenMenu] = useState(false);

  // Gender-based avatar style
  const getAvatarSeed = () => {
    if (!user) return 'default';
    
    // Use gender to determine avatar style
    const gender = user.gender?.toLowerCase() || 'neutral';
    if (gender === 'male') {
      return `male-${user.name}`;
    } else if (gender === 'female') {
      return `female-${user.name}`;
    } else {
      return `neutral-${user.name}`;
    }
  };
  
  // Get avatar URL based on gender
  const getAvatarUrl = () => {
    if (!user) return '';
    
    const gender = user.gender?.toLowerCase() || 'neutral';
    const seed = encodeURIComponent(user?.name || 'User');
    
    if (gender === 'female') {
      return `https://api.dicebear.com/7.x/lorelei/svg?seed=${seed}`;
    } else if (gender === 'male') {
      return `https://api.dicebear.com/7.x/bottts/svg?seed=${seed}`;
    } else {
      return `https://api.dicebear.com/7.x/micah/svg?seed=${seed}`;
    }
  };

  const menuItems = [
    { id: 'search', label: 'Search Trains', icon: Search, path: '/dashboard' },
    { id: 'track', label: 'Track Trains', icon: Map, path: '/track-trains' },
    { id: 'book', label: 'Book Tickets', icon: Ticket, path: '/book-tickets' },
    { id: 'alert', label: 'Notification Alert', icon: Bell, path: '/notification-alert' },
    { id: 'platform', label: 'Platform Locator', icon: MapPin, path: '/platform-locator' },
  ];

  const handleNavigate = (path: string) => {
    navigate(path);
    setOpenMenu(false);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      {/* Header */}
      <header className="bg-white shadow-md sticky top-0 z-10">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <Sheet open={openMenu} onOpenChange={setOpenMenu}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-72">
                <SheetHeader className="pb-6">
                  <SheetTitle className="gradient-text text-2xl">SMART TRAIN</SheetTitle>
                </SheetHeader>
                
                {/* User Profile in Sidebar */}
                <div className="mb-8 flex flex-col items-center p-4 bg-gradient-card rounded-xl">
                  <Avatar className="h-20 w-20 mb-4 border-4 border-white shadow-lg">
                    <AvatarImage src={getAvatarUrl()} />
                    <AvatarFallback className="text-lg bg-train-primary text-white">
                      {user?.name?.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="text-center">
                    <h3 className="font-bold text-lg">{user?.name}</h3>
                    <p className="text-sm text-gray-500">{user?.email}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-2 w-full mt-4 text-xs text-gray-600">
                    <div className="flex flex-col items-center bg-white/50 p-2 rounded-lg">
                      <span className="font-semibold">Phone</span>
                      <span>{user?.phone}</span>
                    </div>
                    <div className="flex flex-col items-center bg-white/50 p-2 rounded-lg">
                      <span className="font-semibold">Gender</span>
                      <span>{user?.gender || 'N/A'}</span>
                    </div>
                  </div>
                </div>
                
                {/* Navigation in Sidebar */}
                <nav className="space-y-1">
                  {menuItems.map((item) => (
                    <button
                      key={item.id}
                      className={cn(
                        "flex items-center w-full p-3 rounded-lg transition-all",
                        activeTab === item.id
                          ? "bg-train-primary text-white"
                          : "hover:bg-blue-50"
                      )}
                      onClick={() => handleNavigate(item.path)}
                    >
                      <item.icon className="h-5 w-5 mr-3" />
                      <span>{item.label}</span>
                    </button>
                  ))}
                </nav>
                
                {/* Logout Button */}
                <div className="absolute bottom-8 left-0 right-0 px-6">
                  <Button 
                    variant="outline"
                    className="w-full flex items-center justify-center"
                    onClick={handleLogout}
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    <span>Logout</span>
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
            
            <h1 className="text-xl font-bold gradient-text hidden sm:block">SMART TRAIN</h1>
          </div>
          
          <div className="text-lg font-medium text-center flex-1 sm:flex-none">
            {title}
          </div>

          <div className="flex items-center">
            <Button 
              variant="ghost" 
              size="icon"
              className="rounded-full"
              onClick={() => handleNavigate('/profile')}
            >
              <Avatar className="h-9 w-9">
                <AvatarImage src={getAvatarUrl()} />
                <AvatarFallback className="bg-train-primary text-white">
                  {user?.name?.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </Button>
          </div>
        </div>
      </header>

      {/* Desktop Side Navigation */}
      <div className="hidden lg:block fixed left-0 top-[68px] bottom-0 w-60 bg-white shadow-lg p-4">
        <nav className="space-y-1">
          {menuItems.map((item) => (
            <button
              key={item.id}
              className={cn(
                "flex items-center w-full p-3 rounded-lg transition-all",
                activeTab === item.id
                  ? "bg-train-primary text-white"
                  : "hover:bg-blue-50"
              )}
              onClick={() => handleNavigate(item.path)}
            >
              <item.icon className="h-5 w-5 mr-3" />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
        
        {/* Desktop Logout Button */}
        <Button 
          variant="outline"
          className="w-full flex items-center justify-center mt-8"
          onClick={handleLogout}
        >
          <LogOut className="h-4 w-4 mr-2" />
          <span>Logout</span>
        </Button>
      </div>

      {/* Main Content */}
      <main className="pt-4 pb-16 lg:ml-60">
        <div className="container mx-auto px-4">
          {children}
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
