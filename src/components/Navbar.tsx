import { useState, useEffect } from "react";
import { Menu, X, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import ThemeSwitcher from "./ThemeSwitcher";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'backdrop-blur-xl bg-background/80 border-b border-vybe-cyan/30 shadow-lg shadow-vybe-cyan/10' : 'backdrop-blur-lg border-b border-vybe-cyan/20'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Enhanced Logo */}
          <div className="flex items-center space-x-3 group cursor-pointer" onClick={() => window.location.href = '/'}>
            <img 
              src="/uploads/VybeLoopRoomFULL LOGO.png" 
              alt="VYBE LOOPROOMS™" 
              className="object-contain h-20 w-auto transition-transform duration-300 group-hover:scale-105"
            />
          </div>

          {/* Enhanced Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <a 
              href="/about" 
              className="text-foreground/80 hover:text-vybe-cyan transition-all duration-300 font-medium relative group"
            >
              About
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-vybe-cyan to-vybe-purple group-hover:w-full transition-all duration-300"></span>
            </a>
            
            <a 
              href="/contact" 
              className="text-foreground/80 hover:text-vybe-purple transition-all duration-300 font-medium relative group"
            >
              Contact
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-vybe-purple to-vybe-pink group-hover:w-full transition-all duration-300"></span>
            </a>
            
            <a 
              href="#creators" 
              className="text-foreground/80 hover:text-vybe-pink transition-all duration-300 font-medium relative group"
            >
              Creators
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-vybe-pink to-vybe-cyan group-hover:w-full transition-all duration-300"></span>
            </a>
            
            {/* Theme Switcher */}
            <ThemeSwitcher />
            
            <Button 
              className="btn-glow relative overflow-hidden group" 
              onClick={() => window.location.href = '/waitlist'}
            >
              <span className="relative z-10">Join Waitlist</span>
              <div className="absolute inset-0 bg-gradient-to-r from-vybe-cyan via-vybe-purple to-vybe-pink opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </Button>
          </div>

          {/* Enhanced Mobile menu button */}
          <div className="md:hidden flex items-center space-x-2">
            {/* Theme Switcher for Mobile */}
            <ThemeSwitcher />
            
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-foreground hover:text-vybe-cyan transition-all duration-300 p-2 rounded-lg hover:bg-vybe-cyan/10 focus:outline-none focus:ring-2 focus:ring-vybe-cyan/50"
              aria-label="Toggle mobile menu"
            >
              <div className="relative w-6 h-6">
                <span className={`absolute block w-6 h-0.5 bg-current transform transition-all duration-300 ${isOpen ? 'rotate-45 translate-y-0' : '-translate-y-2'}`}></span>
                <span className={`absolute block w-6 h-0.5 bg-current transform transition-all duration-300 ${isOpen ? 'opacity-0' : 'translate-y-0'}`}></span>
                <span className={`absolute block w-6 h-0.5 bg-current transform transition-all duration-300 ${isOpen ? '-rotate-45 translate-y-0' : 'translate-y-2'}`}></span>
              </div>
            </button>
          </div>
        </div>

        {/* Enhanced Mobile Navigation */}
        <div className={`md:hidden transition-all duration-500 ease-in-out overflow-hidden ${isOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'}`}>
          <div className="bg-background/98 backdrop-blur-xl border-t border-vybe-cyan/30 px-6 py-8 space-y-8 shadow-lg shadow-vybe-cyan/10">
            {/* Navigation Links */}
            <div className="space-y-6">
              <a 
                href="/about" 
                className="block text-foreground/80 hover:text-vybe-cyan transition-all duration-300 text-xl font-medium py-3 border-l-4 border-transparent hover:border-vybe-cyan pl-6 rounded-r-lg hover:bg-vybe-cyan/5 group"
                onClick={() => setIsOpen(false)}
              >
                <span className="flex items-center justify-between">
                  About
                  <ChevronDown className="w-4 h-4 transform group-hover:rotate-180 transition-transform duration-300" />
                </span>
              </a>
              <a 
                href="/contact" 
                className="block text-foreground/80 hover:text-vybe-purple transition-all duration-300 text-xl font-medium py-3 border-l-4 border-transparent hover:border-vybe-purple pl-6 rounded-r-lg hover:bg-vybe-purple/5 group"
                onClick={() => setIsOpen(false)}
              >
                <span className="flex items-center justify-between">
                  Contact
                  <ChevronDown className="w-4 h-4 transform group-hover:rotate-180 transition-transform duration-300" />
                </span>
              </a>
              <a 
                href="#creators" 
                className="block text-foreground/80 hover:text-vybe-pink transition-all duration-300 text-xl font-medium py-3 border-l-4 border-transparent hover:border-vybe-pink pl-6 rounded-r-lg hover:bg-vybe-pink/5 group"
                onClick={() => setIsOpen(false)}
              >
                <span className="flex items-center justify-between">
                  Creators
                  <ChevronDown className="w-4 h-4 transform group-hover:rotate-180 transition-transform duration-300" />
                </span>
              </a>
            </div>
            
            {/* Call to Action */}
            <div className="pt-6 border-t border-vybe-cyan/20">
              <Button 
                className="btn-glow w-full text-xl py-6 relative overflow-hidden group" 
                onClick={() => {setIsOpen(false); window.location.href = '/waitlist';}}
              >
                <span className="relative z-10">Join Waitlist</span>
                <div className="absolute inset-0 bg-gradient-to-r from-vybe-cyan via-vybe-purple to-vybe-pink opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </Button>
            </div>
            
            {/* Enhanced Mobile Social Proof */}
            <div className="text-center pt-6 space-y-4">
              <div className="flex items-center justify-center space-x-2 text-sm text-foreground/60">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span>Join 10,000+ people on the waitlist</span>
              </div>
              
              <div className="flex justify-center space-x-2">
                {[...Array(5)].map((_, i) => (
                  <div 
                    key={i} 
                    className="w-2 h-2 bg-gradient-to-r from-vybe-cyan to-vybe-purple rounded-full animate-bounce" 
                    style={{ animationDelay: `${i * 0.1}s` }}
                  ></div>
                ))}
              </div>
              
              <div className="text-xs text-foreground/40 space-y-1">
                <p>✓ No spam • ✓ Early access • ✓ Exclusive updates</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;