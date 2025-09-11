import { Heart } from "lucide-react";

const Footer = () => {
  const links = [
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
    { name: "Login", href: "/login" },
    { name: "Sign Up", href: "/register" },
    { name: "Privacy Policy", href: "/privacy" }
  ];

  return (
    <footer className="section-padding bg-gradient-to-t from-secondary/20 to-background border-t border-vybe-cyan/20 fade-in">
      <div className="max-w-7xl mx-auto">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-12 stagger-in">
          {/* Left - Logo and Tagline */}
          <div className="text-center lg:text-left slide-in-left">
            <div className="flex items-center justify-center lg:justify-start space-x-3 mb-6 scale-in">
                <img 
                  src="/uploads/VybeLoopRoomFULL LOGO.png" 
                  alt="VYBE LOOPROOMS™" 
                  className="object-contain h-20 w-auto"
                />
            </div>
            <p className="text-xl font-medium text-gradient-reverse mb-4">
              Positivity. Connection. Growth.
            </p>
            <p className="text-foreground/60 leading-relaxed max-w-md mx-auto lg:mx-0">
              The world's first emotional tech ecosystem, connecting hearts and minds through innovative digital experiences.
            </p>
          </div>

          {/* Right - Get Started */}
          <div className="text-center lg:text-right slide-in-right">
            <h3 className="text-2xl font-bold mb-4 text-gradient fade-in">
              Ready to Create?
            </h3>
            <p className="text-foreground/70 mb-6">
              Join VYBE LOOPROOMS™ and start building your emotional tech journey.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto lg:ml-auto">
              <button 
                className="btn-glow px-8 py-3 whitespace-nowrap flex-1" 
                onClick={() => window.location.href = '/register'}
              >
                Get Started Free
              </button>
              <button 
                className="px-8 py-3 border border-vybe-cyan/30 rounded-full text-vybe-cyan hover:bg-vybe-cyan/10 transition-all duration-300 whitespace-nowrap" 
                onClick={() => window.location.href = '/login'}
              >
                Login
              </button>
            </div>
          </div>
        </div>

        {/* Navigation Links */}
        <div className="flex flex-wrap justify-center gap-8 mb-12 stagger-in">
          {links.map((link, index) => (
            <a
              key={index}
              href={link.href}
              className="text-foreground/70 hover:text-vybe-cyan transition-colors duration-300 text-lg font-medium relative group"
            >
              {link.name}
              <span className="absolute inset-x-0 -bottom-1 h-0.5 bg-vybe-cyan scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></span>
            </a>
          ))}
        </div>

        {/* Bottom Section */}
        <div className="pt-8 border-t border-vybe-cyan/20">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            {/* Copyright */}
            <div className="text-foreground/60 text-center sm:text-left">
              © {new Date().getFullYear()} VYBE LOOPROOMS™. All rights reserved.
            </div>

            {/* Made with love */}
            <div className="flex items-center space-x-2 text-foreground/60">
              <span>Made with</span>
              <Heart className="w-4 h-4 text-vybe-pink animate-pulse" />
              <span>for emotional connection</span>
            </div>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-vybe-cyan via-vybe-purple to-vybe-pink opacity-50"></div>
      </div>
    </footer>
  );
};

export default Footer;