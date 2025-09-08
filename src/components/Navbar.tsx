import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 w-full z-50 backdrop-blur-lg border-b border-vybe-cyan/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <img 
              src="/uploads/VybeLoopRoomFULL LOGO.png" 
              alt="VYBE LOOPROOMS™" 
              className="object-contain h-20 w-auto"
            />
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <a href="/about" className="text-foreground/80 hover:text-vybe-cyan transition-colors">
              About
            </a>
            <a href="/contact" className="text-foreground/80 hover:text-vybe-cyan transition-colors">
              Contact
            </a>
            <a href="#creators" className="text-foreground/80 hover:text-vybe-cyan transition-colors">
              Creators
            </a>
            <Button className="btn-glow" onClick={() => window.location.href = '/waitlist'}>
              Join Waitlist
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-foreground hover:text-vybe-cyan transition-colors"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden absolute top-full left-0 w-full bg-background/95 backdrop-blur-lg border-b border-vybe-cyan/20">
            <div className="px-4 py-6 space-y-4">
              <a 
                href="/about" 
                className="block text-foreground/80 hover:text-vybe-cyan transition-colors"
                onClick={() => setIsOpen(false)}
              >
                About
              </a>
              <a 
                href="/contact" 
                className="block text-foreground/80 hover:text-vybe-cyan transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Contact
              </a>
              <a 
                href="#creators" 
                className="block text-foreground/80 hover:text-vybe-cyan transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Creators
              </a>
              <Button className="btn-glow w-full mt-4" onClick={() => {setIsOpen(false); window.location.href = '/waitlist';}}>
                Join Waitlist
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;