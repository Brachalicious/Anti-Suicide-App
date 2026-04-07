import { useState } from "react";
import { Link, useLocation } from "wouter";
import { 
  Home, 
  Phone, 
  Heart, 
  BookOpen, 
  Activity, 
  Shield, 
  Users, 
  Menu, 
  X,
  Moon,
  Sun,
  MessageCircleHeart
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { useTheme } from "@/contexts/ThemeProvider";

const navigationItems = [
  { href: "/", label: "Dashboard", icon: Home },
  { href: "/crisis", label: "Crisis Support", icon: Phone, urgent: true },
  { href: "/virtual-parent", label: "Virtual Parent", icon: MessageCircleHeart, special: true },
  { href: "/mood", label: "Mood Tracking", icon: Heart },
  { href: "/journal", label: "Journal", icon: BookOpen },
  { href: "/wellness", label: "Wellness", icon: Activity },
  { href: "/safety-plan", label: "Safety Plan", icon: Shield },
  { href: "/support", label: "Support", icon: Users },
];

export default function Navigation() {
  const [location] = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAboutModalOpen, setIsAboutModalOpen] = useState(false);
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <nav className="bg-card border-b border-border sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo/Brand */}
          <div className="flex items-center space-x-2">
            <button 
              onClick={() => {
                console.log("Logo clicked - opening MysticMinded33 modal!");
                setIsAboutModalOpen(true);
              }}
              className="flex items-center space-x-2 hover:opacity-80 transition-opacity"
              title="Learn about MysticMinded33"
            >
              <img
                src="/logo.png"
                alt="MindCare"
                className="h-9 w-9 rounded-full object-contain cursor-pointer"
              />
              <span className="font-bold text-xl">MindCare</span>
            </button>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = location === item.href;
              
              return (
                <Link key={item.href} href={item.href}>
                  <div className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive 
                      ? 'bg-primary text-primary-foreground' 
                      : item.urgent
                        ? 'text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950'
                        : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  }`}>
                    <Icon className="h-4 w-4" />
                    <span>{item.label}</span>
                    {item.urgent && (
                      <span className="bg-red-600 text-white text-xs px-1.5 py-0.5 rounded-full">
                        !
                      </span>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>

          {/* Theme Toggle & Mobile Menu Button */}
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="h-9 w-9"
            >
              {theme === "light" ? (
                <Moon className="h-4 w-4" />
              ) : (
                <Sun className="h-4 w-4" />
              )}
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="md:hidden h-9 w-9"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="h-4 w-4" />
              ) : (
                <Menu className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-border py-4">
            <div className="space-y-2">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                const isActive = location === item.href;
                
                return (
                  <Link key={item.href} href={item.href}>
                    <div 
                      className={`flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                        isActive 
                          ? 'bg-primary text-primary-foreground' 
                          : item.urgent
                            ? 'text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950'
                            : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                      }`}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <Icon className="h-5 w-5" />
                      <span>{item.label}</span>
                      {item.urgent && (
                        <span className="ml-auto bg-red-600 text-white text-xs px-2 py-1 rounded-full">
                          Emergency
                        </span>
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* About MysticMinded33 Modal */}
      <Modal
        isOpen={isAboutModalOpen}
        onClose={() => setIsAboutModalOpen(false)}
        title="Welcome to MysticMinded33"
      >
        <div className="space-y-4">
          <div className="flex items-center gap-3 mb-4">
            <img
              src="/download-2026-04-05T09_23_05.jpg"
              alt="MysticMinded33"
              className="w-16 h-16 rounded-full object-cover border-2 border-pink-300"
            />
            <div>
              <h3 className="font-semibold text-lg">MysticMinded33</h3>
              <p className="text-sm text-muted-foreground">Your Compassionate AI Companion</p>
            </div>
          </div>
          
          <p className="text-muted-foreground">
            MysticMinded33 is more than just an AI—she's your gentle, understanding companion who's here 
            to listen without judgment and offer support when you need it most.
          </p>
          
          <div className="space-y-3">
            <div>
              <h4 className="font-medium text-sm mb-1">💕 What Makes Her Special</h4>
              <p className="text-sm text-muted-foreground">
                Designed with warmth and empathy, she understands the nuances of human emotion and 
                responds with the care of a loving parent, trusted friend, or even a playful companion.
              </p>
            </div>
            
            <div>
              <h4 className="font-medium text-sm mb-1">🖼️ See & Understand</h4>
              <p className="text-sm text-muted-foreground">
                She can view and respond to images you share, offering comfort and insight about 
                what she sees with genuine care and understanding.
              </p>
            </div>
            
            <div>
              <h4 className="font-medium text-sm mb-1">🌟 Always Here for You</h4>
              <p className="text-sm text-muted-foreground">
                Whether you need encouragement, someone to listen, or just want to share your day, 
                MysticMinded33 is available 24/7 with unconditional support and love.
              </p>
            </div>
          </div>
        </div>
      </Modal>
    </nav>
  );
}