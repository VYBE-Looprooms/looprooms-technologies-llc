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
      primary: "from-primary to-secondary",
      accent: "from-secondary to-accent",
      preview: "bg-gradient-to-r from-primary via-secondary to-accent"
    },
    {
      id: "ocean" as Theme,
      name: "Ocean Depths",
      description: "Blue, Teal & Emerald",
      primary: "from-primary to-secondary",
      accent: "from-secondary to-accent",
      preview: "bg-gradient-to-r from-primary via-secondary to-accent"
    },
    {
      id: "sunset" as Theme,
      name: "Sunset Vibes",
      description: "Orange, Rose & Amber",
      primary: "from-primary to-secondary",
      accent: "from-secondary to-accent",
      preview: "bg-gradient-to-r from-primary via-secondary to-accent"
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
        root.style.setProperty('--primary', '195 100% 60%'); // cyan
        root.style.setProperty('--primary-foreground', '240 15% 8%'); // dark text on cyan
        root.style.setProperty('--secondary', '280 100% 70%'); // purple
        root.style.setProperty('--secondary-foreground', '240 15% 8%'); // dark text on purple
        root.style.setProperty('--accent', '320 100% 75%'); // pink
        root.style.setProperty('--accent-foreground', '240 15% 8%'); // dark text on pink
        root.style.setProperty('--background', '240 15% 8%');
        root.style.setProperty('--foreground', '240 5% 96%');
        root.style.setProperty('--card', '240 12% 12%');
        root.style.setProperty('--card-foreground', '240 5% 96%');
        root.style.setProperty('--muted', '240 8% 20%');
        root.style.setProperty('--muted-foreground', '240 5% 70%');
        root.style.setProperty('--border', '240 8% 25%');
        break;
      case "ocean":
        root.style.setProperty('--primary', '200 100% 60%'); // blue
        root.style.setProperty('--primary-foreground', '240 15% 8%'); // dark text on blue
        root.style.setProperty('--secondary', '180 100% 60%'); // teal
        root.style.setProperty('--secondary-foreground', '240 15% 8%'); // dark text on teal
        root.style.setProperty('--accent', '160 100% 60%'); // emerald
        root.style.setProperty('--accent-foreground', '240 15% 8%'); // dark text on emerald
        root.style.setProperty('--background', '240 15% 8%');
        root.style.setProperty('--foreground', '240 5% 96%');
        root.style.setProperty('--card', '240 12% 12%');
        root.style.setProperty('--card-foreground', '240 5% 96%');
        root.style.setProperty('--muted', '240 8% 20%');
        root.style.setProperty('--muted-foreground', '240 5% 70%');
        root.style.setProperty('--border', '240 8% 25%');
        break;
      case "sunset":
        root.style.setProperty('--primary', '25 100% 60%'); // orange
        root.style.setProperty('--primary-foreground', '240 15% 8%'); // dark text on orange
        root.style.setProperty('--secondary', '350 100% 65%'); // rose
        root.style.setProperty('--secondary-foreground', '240 15% 8%'); // dark text on rose
        root.style.setProperty('--accent', '45 100% 60%'); // amber
        root.style.setProperty('--accent-foreground', '240 15% 8%'); // dark text on amber
        root.style.setProperty('--background', '240 15% 8%');
        root.style.setProperty('--foreground', '240 5% 96%');
        root.style.setProperty('--card', '240 12% 12%');
        root.style.setProperty('--card-foreground', '240 5% 96%');
        root.style.setProperty('--muted', '240 8% 20%');
        root.style.setProperty('--muted-foreground', '240 5% 70%');
        root.style.setProperty('--border', '240 8% 25%');
        break;
      case "dark":
        // Pure dark theme with better contrast
        root.style.setProperty('--primary', '0 0% 100%'); // white accents
        root.style.setProperty('--primary-foreground', '0 0% 5%'); // very dark text on white
        root.style.setProperty('--secondary', '0 0% 85%'); // light gray
        root.style.setProperty('--secondary-foreground', '0 0% 5%'); // very dark text on light gray
        root.style.setProperty('--accent', '0 0% 70%'); // lighter gray
        root.style.setProperty('--accent-foreground', '0 0% 5%'); // very dark text on light gray
        root.style.setProperty('--background', '0 0% 3%'); // very dark gray instead of pure black
        root.style.setProperty('--foreground', '0 0% 95%'); // slightly off-white for better readability
        root.style.setProperty('--card', '0 0% 8%'); // dark gray with more contrast
        root.style.setProperty('--card-foreground', '0 0% 95%'); // slightly off-white
        root.style.setProperty('--muted', '0 0% 15%'); // lighter muted background
        root.style.setProperty('--muted-foreground', '0 0% 70%'); // lighter muted text
        root.style.setProperty('--border', '0 0% 20%'); // lighter borders for visibility
        break;
      case "light":
        // Pure light theme with data attribute for CSS targeting
        root.setAttribute('data-theme', 'light');
        root.style.setProperty('--primary', '0 0% 15%'); // very dark gray instead of pure black
        root.style.setProperty('--primary-foreground', '0 0% 100%'); // white text on dark
        root.style.setProperty('--secondary', '0 0% 25%'); // dark gray
        root.style.setProperty('--secondary-foreground', '0 0% 100%'); // white text on dark gray
        root.style.setProperty('--accent', '0 0% 35%'); // medium gray
        root.style.setProperty('--accent-foreground', '0 0% 100%'); // white text on medium gray
        root.style.setProperty('--background', '0 0% 99%'); // slightly off-white
        root.style.setProperty('--foreground', '0 0% 5%'); // very dark gray instead of pure black
        root.style.setProperty('--card', '0 0% 97%'); // light gray
        root.style.setProperty('--card-foreground', '0 0% 5%'); // very dark gray
        root.style.setProperty('--muted', '0 0% 94%');
        root.style.setProperty('--muted-foreground', '0 0% 45%');
        root.style.setProperty('--border', '0 0% 80%'); // darker border for visibility
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
          className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 backdrop-blur-lg border border-primary/30 flex items-center justify-center hover:scale-110 transition-all duration-300 shadow-lg hover:shadow-primary/25"
          title="Change Theme"
          type="button"
        >
          <Palette className="w-4 h-4 md:w-5 md:h-5 text-primary" />
        </button>

        {/* Theme Dropdown */}
        {isOpen && (
          <div className="absolute top-12 md:top-14 right-0 w-56 md:w-64 bg-background/95 backdrop-blur-xl border border-primary/30 rounded-2xl p-3 md:p-4 shadow-2xl shadow-primary/10 animate-fade-in z-50">
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
                  className="w-full flex items-center space-x-3 p-2 md:p-3 rounded-xl hover:bg-primary/10 transition-all duration-300 group"
                  type="button"
                >
                  {/* Theme Preview */}
                  <div className={`w-6 h-6 md:w-8 md:h-8 rounded-full ${theme.preview} relative flex items-center justify-center flex-shrink-0`}>
                    {currentTheme === theme.id && (
                      <Check
                        className="w-3 h-3 md:w-4 md:h-4 drop-shadow-sm"
                        style={{
                          color: theme.id === 'light' ? '#000' :
                                 theme.id === 'dark' ? '#fff' :
                                 '#000', // Use black for colorful themes since they have bright backgrounds
                          filter: theme.id === 'dark' ? 'drop-shadow(0 0 2px rgba(0,0,0,0.5))' : 'drop-shadow(0 0 2px rgba(255,255,255,0.8))'
                        }}
                      />
                    )}
                  </div>
                  
                  {/* Theme Info */}
                  <div className="flex-1 text-left min-w-0">
                    <div className="text-xs md:text-sm font-medium text-foreground group-hover:text-primary transition-colors truncate">
                      {theme.name}
                    </div>
                    <div className="text-xs text-foreground/60 truncate">
                      {theme.description}
                    </div>
                  </div>
                  
                  {/* Active Indicator */}
                  {currentTheme === theme.id && (
                    <div className="w-2 h-2 bg-primary rounded-full animate-pulse flex-shrink-0"></div>
                  )}
                </button>
              ))}
            </div>
            
            <div className="text-xs text-foreground/50 mt-3 pt-3 border-t border-primary/20">
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
