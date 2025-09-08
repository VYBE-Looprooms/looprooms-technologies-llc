import { useState, useEffect } from "react";
import { Palette, Check } from "lucide-react";

type Theme = "cyber" | "ocean" | "sunset";

const ThemeSwitcher = () => {
  const [currentTheme, setCurrentTheme] = useState<Theme>("cyber");
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
    }
  ];

  useEffect(() => {
    // Apply theme to CSS variables
    const root = document.documentElement;
    
    switch (currentTheme) {
      case "cyber":
        root.style.setProperty('--vybe-primary', '195 100% 60%'); // cyan
        root.style.setProperty('--vybe-secondary', '280 100% 70%'); // purple
        root.style.setProperty('--vybe-accent', '320 100% 75%'); // pink
        break;
      case "ocean":
        root.style.setProperty('--vybe-primary', '200 100% 60%'); // blue
        root.style.setProperty('--vybe-secondary', '180 100% 60%'); // teal
        root.style.setProperty('--vybe-accent', '160 100% 60%'); // emerald
        break;
      case "sunset":
        root.style.setProperty('--vybe-primary', '25 100% 60%'); // orange
        root.style.setProperty('--vybe-secondary', '350 100% 65%'); // rose
        root.style.setProperty('--vybe-accent', '45 100% 60%'); // amber
        break;
    }
  }, [currentTheme]);

  return (
    <div className="fixed top-24 right-6 z-40">
      <div className="relative">
        {/* Theme Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-12 h-12 rounded-full bg-gradient-to-br from-vybe-cyan/20 to-vybe-purple/20 backdrop-blur-lg border border-vybe-cyan/30 flex items-center justify-center hover:scale-110 transition-all duration-300 shadow-lg hover:shadow-vybe-cyan/25"
          title="Change Theme"
        >
          <Palette className="w-5 h-5 text-vybe-cyan" />
        </button>

        {/* Theme Dropdown */}
        {isOpen && (
          <div className="absolute top-14 right-0 w-64 bg-background/95 backdrop-blur-xl border border-vybe-cyan/30 rounded-2xl p-4 shadow-2xl shadow-vybe-cyan/10 animate-fade-in">
            <div className="text-sm font-semibold text-foreground mb-3">Choose Your Vibe</div>
            
            <div className="space-y-2">
              {themes.map((theme) => (
                <button
                  key={theme.id}
                  onClick={() => {
                    setCurrentTheme(theme.id);
                    setIsOpen(false);
                  }}
                  className="w-full flex items-center space-x-3 p-3 rounded-xl hover:bg-vybe-cyan/10 transition-all duration-300 group"
                >
                  {/* Theme Preview */}
                  <div className={`w-8 h-8 rounded-full ${theme.preview} relative flex items-center justify-center`}>
                    {currentTheme === theme.id && (
                      <Check className="w-4 h-4 text-white" />
                    )}
                  </div>
                  
                  {/* Theme Info */}
                  <div className="flex-1 text-left">
                    <div className="text-sm font-medium text-foreground group-hover:text-vybe-cyan transition-colors">
                      {theme.name}
                    </div>
                    <div className="text-xs text-foreground/60">
                      {theme.description}
                    </div>
                  </div>
                  
                  {/* Active Indicator */}
                  {currentTheme === theme.id && (
                    <div className="w-2 h-2 bg-vybe-cyan rounded-full animate-pulse"></div>
                  )}
                </button>
              ))}
            </div>
            
            <div className="text-xs text-foreground/50 mt-3 pt-3 border-t border-vybe-cyan/20">
              Theme changes apply instantly
            </div>
          </div>
        )}
      </div>
      
      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 -z-10" 
          onClick={() => setIsOpen(false)}
        ></div>
      )}
    </div>
  );
};

export default ThemeSwitcher;
