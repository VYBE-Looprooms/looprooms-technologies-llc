import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Menu, X, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import ThemeSwitcher from "./ThemeSwitcher";
import useGSAP from "@/hooks/useGSAP";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  // Initialize GSAP animations - disabled on mobile for navbar stability
  useGSAP();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle hash-based navigation when component mounts
  useEffect(() => {
    const hash = window.location.hash;
    if (hash) {
      const sectionId = hash.substring(1); // Remove the # character
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
          });
        }
      }, 500); // Wait for page to fully load
    }
  }, []);

  // Navigation function for cross-page navigation to sections
  const navigateToSection = (sectionId: string) => {
    const currentPath = window.location.pathname;
    
    if (currentPath === '/') {
      // Already on home page, just scroll to section
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ 
          behavior: 'smooth',
          block: 'start'
        });
      }
    } else {
      // On different page, navigate to home with hash
      navigate(`/#${sectionId}`);
    }
  };

  // Prevent body scroll when mobile menu is open and fix layout shifts
  useEffect(() => {
    if (isOpen) {
      // Prevent scrolling and fix viewport
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
      document.body.style.top = `-${window.scrollY}px`;
    } else {
      // Restore scrolling
      const scrollY = document.body.style.top;
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
      document.body.style.top = '';
      if (scrollY) {
        window.scrollTo(0, parseInt(scrollY || '0') * -1);
      }
    }
    
    return () => {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
      document.body.style.top = '';
    };
  }, [isOpen]);

  return (
    <nav className={`fixed top-0 left-0 right-0 w-full z-50 transition-all duration-300 ${scrolled ? 'backdrop-blur-xl bg-background/80 border-b border-vybe-cyan/30 shadow-lg shadow-vybe-cyan/10' : 'backdrop-blur-lg border-b border-vybe-cyan/20'}`} style={{ position: 'fixed', top: 0, width: '100%' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" style={{ width: '100%' }}>
        <div className="flex items-center justify-between h-20" style={{ minHeight: '80px' }}>
          {/* Enhanced Logo */}
          <div className="flex items-center space-x-3 group cursor-pointer" onClick={() => window.location.href = '/'}>
            <img 
              src="/uploads/VybeLoopRoomFULL LOGO.png" 
              alt="VYBE LOOPROOMS™" 
              className="object-contain h-12 sm:h-16 w-auto transition-transform duration-300 group-hover:scale-105"
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
            
            <button 
              onClick={() => navigateToSection('creators')}
              className="text-foreground/80 hover:text-vybe-pink transition-all duration-300 font-medium relative group bg-transparent border-none cursor-pointer"
            >
              Creators
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-vybe-pink to-vybe-cyan group-hover:w-full transition-all duration-300"></span>
            </button>
            
            {/* Theme Switcher */}
            <ThemeSwitcher className="relative" />
            
            {/* Authentication Buttons */}
            <div className="flex items-center space-x-3">
              {user ? (
                <>
                  <Button 
                    variant="ghost"
                    className="text-foreground/80 hover:text-vybe-cyan hover:bg-vybe-cyan/10 transition-all duration-300 font-medium"
                    onClick={() => navigate('/dashboard')}
                  >
                    Dashboard
                  </Button>
                  
                  <Button 
                    variant="outline"
                    className="text-foreground/80 hover:text-vybe-purple hover:bg-vybe-purple/10 transition-all duration-300 font-medium"
                    onClick={() => {
                      logout();
                      navigate('/');
                    }}
                  >
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Button 
                    variant="ghost"
                    className="text-foreground/80 hover:text-vybe-cyan hover:bg-vybe-cyan/10 transition-all duration-300 font-medium"
                    onClick={() => navigate('/login')}
                  >
                    Login
                  </Button>
                  
                  <Button 
                    className="btn-glow relative overflow-hidden group" 
                    onClick={() => navigate('/register')}
                  >
                    <span className="relative z-10">Sign Up</span>
                    <div className="absolute inset-0 bg-gradient-to-r from-vybe-cyan via-vybe-purple to-vybe-pink opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </Button>
                </>
              )}
            </div>
          </div>

          {/* Enhanced Mobile menu button */}
          <div className="md:hidden flex items-center space-x-3">
            {/* Theme Switcher for Mobile */}
            <ThemeSwitcher className="relative" />
            
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="flex items-center justify-center text-foreground hover:text-vybe-cyan transition-all duration-300 p-2 rounded-lg hover:bg-vybe-cyan/10 focus:outline-none focus:ring-2 focus:ring-vybe-cyan/50"
              aria-label="Toggle mobile menu"
            >
              <div className="relative w-6 h-6 flex items-center justify-center">
                <span className={`absolute block w-6 h-0.5 bg-current transform transition-all duration-300 ${isOpen ? 'rotate-45' : '-translate-y-2'}`}></span>
                <span className={`absolute block w-6 h-0.5 bg-current transform transition-all duration-300 ${isOpen ? 'opacity-0' : ''}`}></span>
                <span className={`absolute block w-6 h-0.5 bg-current transform transition-all duration-300 ${isOpen ? '-rotate-45' : 'translate-y-2'}`}></span>
              </div>
            </button>
          </div>
        </div>

        {/* Enhanced Mobile Navigation */}
        <div className={`md:hidden fixed left-0 right-0 transition-all duration-500 ease-in-out overflow-hidden ${isOpen ? 'max-h-80 opacity-100' : 'max-h-0 opacity-0'}`} style={{ top: '80px', width: '100vw', zIndex: 40 }}>
          <div className="bg-background/95 backdrop-blur-xl border-t border-vybe-cyan/30 px-6 py-4 space-y-4 shadow-lg shadow-vybe-cyan/10">
            {/* Navigation Links */}
            <div className="space-y-3 stagger-in">
              <a 
                href="/about" 
                className="block text-foreground/80 hover:text-vybe-cyan transition-all duration-300 text-base font-medium py-2 border-l-4 border-transparent hover:border-vybe-cyan pl-4 rounded-r-lg hover:bg-vybe-cyan/5 group"
                onClick={() => setIsOpen(false)}
              >
                <span className="flex items-center justify-between">
                  About
                  <ChevronDown className="w-4 h-4 transform group-hover:rotate-180 transition-transform duration-300" />
                </span>
              </a>
              <a 
                href="/contact" 
                className="block text-foreground/80 hover:text-vybe-purple transition-all duration-300 text-base font-medium py-2 border-l-4 border-transparent hover:border-vybe-purple pl-4 rounded-r-lg hover:bg-vybe-purple/5 group"
                onClick={() => setIsOpen(false)}
              >
                <span className="flex items-center justify-between">
                  Contact
                  <ChevronDown className="w-4 h-4 transform group-hover:rotate-180 transition-transform duration-300" />
                </span>
              </a>
              <button 
                onClick={() => {
                  navigateToSection('creators');
                  setIsOpen(false);
                }}
                className="block text-foreground/80 hover:text-vybe-pink transition-all duration-300 text-base font-medium py-2 border-l-4 border-transparent hover:border-vybe-pink pl-4 rounded-r-lg hover:bg-vybe-pink/5 group bg-transparent border-none cursor-pointer text-left w-full"
              >
                <span className="flex items-center justify-between">
                  Creators
                  <ChevronDown className="w-4 h-4 transform group-hover:rotate-180 transition-transform duration-300" />
                </span>
              </button>
            </div>
            
            {/* Authentication Buttons */}
            <div className="pt-3 border-t border-vybe-cyan/20 scale-in space-y-3">
              {user ? (
                <>
                  <Button 
                    variant="ghost"
                    className="w-full text-foreground/80 hover:text-vybe-cyan hover:bg-vybe-cyan/10 transition-all duration-300 font-medium text-base py-3"
                    onClick={() => {setIsOpen(false); navigate('/dashboard');}}
                  >
                    Dashboard
                  </Button>
                  
                  <Button 
                    variant="outline"
                    className="w-full text-foreground/80 hover:text-vybe-purple hover:bg-vybe-purple/10 transition-all duration-300 font-medium text-base py-3"
                    onClick={() => {
                      setIsOpen(false);
                      logout();
                      navigate('/');
                    }}
                  >
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Button 
                    variant="ghost"
                    className="w-full text-foreground/80 hover:text-vybe-cyan hover:bg-vybe-cyan/10 transition-all duration-300 font-medium text-base py-3"
                    onClick={() => {setIsOpen(false); navigate('/login');}}
                  >
                    Login
                  </Button>
                  
                  <Button 
                    className="btn-glow w-full text-base py-3 relative overflow-hidden group" 
                    onClick={() => {setIsOpen(false); navigate('/register');}}
                  >
                    <span className="relative z-10">Sign Up</span>
                    <div className="absolute inset-0 bg-gradient-to-r from-vybe-cyan via-vybe-purple to-vybe-pink opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </Button>
                </>
              )}
            </div>
            
            {/* Enhanced Mobile Social Proof */}
            <div className="text-center pt-3 space-y-2 fade-in">
              <div className="flex items-center justify-center space-x-2 text-sm text-foreground/60">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span>Ready to create amazing content?</span>
              </div>
              
              <div className="text-xs text-foreground/40">
                <p>✓ Professional tools • ✓ Creative community</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;