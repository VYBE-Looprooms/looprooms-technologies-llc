import { useState, useEffect } from "react";
import { Palette, Check } from "lucide-react";

type Theme = "cyber" | "ocean" | "sunset" | "dark" | "light";

interface ThemeSwitcherProps {
  className?: string;
}

const ThemeSwitcher = ({ className = "" }: ThemeSwitcherProps) => {
  const [currentTheme, setCurrentTheme] = useState<Theme>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('vybe-theme');
      return (saved as Theme) || "cyber";
    }
    return "cyber";
  });
  const [isOpen, setIsOpen] = useState(false);

  const themes = [
    {
      id: "cyber" as Theme,
      name: "Cyber Tech",
      description: "Cyan, Purple & Pink",
      primary: "from-cyan-400 to-purple-500",
      accent: "from-purple-500 to-pink-500",
      preview: "bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500"
    },
    {
      id: "ocean" as Theme,
      name: "Ocean Depths",
      description: "Blue, Teal & Emerald",
      primary: "from-blue-400 to-teal-500",
      accent: "from-teal-500 to-emerald-500",
      preview: "bg-gradient-to-r from-blue-400 via-teal-500 to-emerald-500"
    },
    {
      id: "sunset" as Theme,
      name: "Sunset Vibes",
      description: "Orange, Rose & Amber",
      primary: "from-orange-400 to-rose-500",
      accent: "from-rose-500 to-amber-500",
      preview: "bg-gradient-to-r from-orange-400 via-rose-500 to-amber-500"
    },
    {
      id: "dark" as Theme,
      name: "Pure Dark",
      description: "Pure black & white",
      primary: "from-gray-900 to-black",
      accent: "from-black to-gray-800",
      preview: "bg-gradient-to-r from-gray-900 via-black to-gray-800"
    },
    {
      id: "light" as Theme,
      name: "Pure Light",
      description: "Pure white & clean",
      primary: "from-white to-gray-100",
      accent: "from-gray-100 to-white",
      preview: "bg-gradient-to-r from-white via-gray-100 to-gray-50 border border-gray-300"
    }
  ];

  // Save theme to localStorage whenever it changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('vybe-theme', currentTheme);
    }
  }, [currentTheme]);

  useEffect(() => {
    // Apply theme to CSS variables and data attributes
    const root = document.documentElement;
    
    // Remove any existing theme data attributes
    root.removeAttribute('data-theme');
    
    switch (currentTheme) {
      case "cyber":
        root.style.setProperty('--vybe-primary', '195 100% 60%'); // cyan
        root.style.setProperty('--vybe-secondary', '280 100% 70%'); // purple
        root.style.setProperty('--vybe-accent', '320 100% 75%'); // pink
        // Reset background and text colors for colorful themes
        root.style.setProperty('--background', '240 15% 8%');
        root.style.setProperty('--foreground', '240 5% 96%');
        root.style.setProperty('--card', '240 12% 12%');
        root.style.setProperty('--card-foreground', '240 5% 96%');
        root.style.setProperty('--muted', '240 8% 20%');
        root.style.setProperty('--secondary', '240 10% 18%');
        break;
      case "ocean":
        root.style.setProperty('--vybe-primary', '200 100% 60%'); // blue
        root.style.setProperty('--vybe-secondary', '180 100% 60%'); // teal
        root.style.setProperty('--vybe-accent', '160 100% 60%'); // emerald
        // Reset background and text colors for colorful themes
        root.style.setProperty('--background', '240 15% 8%');
        root.style.setProperty('--foreground', '240 5% 96%');
        root.style.setProperty('--card', '240 12% 12%');
        root.style.setProperty('--card-foreground', '240 5% 96%');
        root.style.setProperty('--muted', '240 8% 20%');
        root.style.setProperty('--secondary', '240 10% 18%');
        break;
      case "sunset":
        root.style.setProperty('--vybe-primary', '25 100% 60%'); // orange
        root.style.setProperty('--vybe-secondary', '350 100% 65%'); // rose
        root.style.setProperty('--vybe-accent', '45 100% 60%'); // amber
        // Reset background and text colors for colorful themes
        root.style.setProperty('--background', '240 15% 8%');
        root.style.setProperty('--foreground', '240 5% 96%');
        root.style.setProperty('--card', '240 12% 12%');
        root.style.setProperty('--card-foreground', '240 5% 96%');
        root.style.setProperty('--muted', '240 8% 20%');
        root.style.setProperty('--secondary', '240 10% 18%');
        break;
      case "dark":
        // Pure dark theme
        root.style.setProperty('--vybe-primary', '0 0% 100%'); // white accents
        root.style.setProperty('--vybe-secondary', '0 0% 80%'); // light gray
        root.style.setProperty('--vybe-accent', '0 0% 60%'); // medium gray
        root.style.setProperty('--background', '0 0% 0%'); // pure black
        root.style.setProperty('--foreground', '0 0% 100%'); // pure white
        root.style.setProperty('--card', '0 0% 5%'); // very dark gray
        root.style.setProperty('--card-foreground', '0 0% 100%'); // pure white
        root.style.setProperty('--muted', '0 0% 10%');
        root.style.setProperty('--secondary', '0 0% 8%');
        break;
      case "light":
        // Pure light theme with data attribute for CSS targeting
        root.setAttribute('data-theme', 'light');
        root.style.setProperty('--vybe-primary', '0 0% 0%'); // black accents
        root.style.setProperty('--vybe-secondary', '0 0% 20%'); // dark gray
        root.style.setProperty('--vybe-accent', '0 0% 40%'); // medium gray
        root.style.setProperty('--background', '0 0% 100%'); // pure white
        root.style.setProperty('--foreground', '0 0% 0%'); // pure black
        root.style.setProperty('--card', '0 0% 98%'); // very light gray
        root.style.setProperty('--card-foreground', '0 0% 0%'); // pure black
        root.style.setProperty('--muted', '0 0% 96%');
        root.style.setProperty('--secondary', '0 0% 94%');
        break;
    }
  }, [currentTheme]);

  return (
    <div className={`relative ${className}`}>
      <div className="relative">
        {/* Theme Button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setIsOpen(!isOpen);
          }}
          className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-gradient-to-br from-vybe-primary/20 to-vybe-secondary/20 backdrop-blur-lg border border-vybe-primary/30 flex items-center justify-center hover:scale-110 transition-all duration-300 shadow-lg hover:shadow-vybe-primary/25"
          title="Change Theme"
          type="button"
        >
          <Palette className="w-4 h-4 md:w-5 md:h-5 text-vybe-primary" />
        </button>

        {/* Theme Dropdown */}
        {isOpen && (
          <div className="absolute top-12 md:top-14 right-0 w-56 md:w-64 bg-background/95 backdrop-blur-xl border border-vybe-primary/30 rounded-2xl p-3 md:p-4 shadow-2xl shadow-vybe-primary/10 animate-fade-in z-50">
            <div className="text-sm font-semibold text-foreground mb-3">Choose Your Vibe</div>
            
            <div className="space-y-2 max-h-80 overflow-y-auto">
              {themes.map((theme) => (
                <button
                  key={theme.id}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setCurrentTheme(theme.id);
                    setIsOpen(false);
                  }}
                  className="w-full flex items-center space-x-3 p-2 md:p-3 rounded-xl hover:bg-vybe-primary/10 transition-all duration-300 group"
                  type="button"
                >
                  {/* Theme Preview */}
                  <div className={`w-6 h-6 md:w-8 md:h-8 rounded-full ${theme.preview} relative flex items-center justify-center flex-shrink-0`}>
                    {currentTheme === theme.id && (
                      <Check className="w-3 h-3 md:w-4 md:h-4" style={{color: theme.id === 'light' ? '#000' : '#fff'}} />
                    )}
                  </div>
                  
                  {/* Theme Info */}
                  <div className="flex-1 text-left min-w-0">
                    <div className="text-xs md:text-sm font-medium text-foreground group-hover:text-vybe-primary transition-colors truncate">
                      {theme.name}
                    </div>
                    <div className="text-xs text-foreground/60 truncate">
                      {theme.description}
                    </div>
                  </div>
                  
                  {/* Active Indicator */}
                  {currentTheme === theme.id && (
                    <div className="w-2 h-2 bg-vybe-primary rounded-full animate-pulse flex-shrink-0"></div>
                  )}
                </button>
              ))}
            </div>
            
            <div className="text-xs text-foreground/50 mt-3 pt-3 border-t border-vybe-primary/20">
              Theme changes apply instantly
            </div>
          </div>
        )}
      </div>
      
      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setIsOpen(false);
          }}
        ></div>
      )}
    </div>
  );
};

export default ThemeSwitcher;
