import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Home, Search, ArrowLeft, Zap, Heart, Star, Sparkles } from "lucide-react";
import useGSAP from "@/hooks/useGSAP";

const NotFound = () => {
  const location = useLocation();

  // Initialize GSAP animations
  useGSAP();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  const goBack = () => {
    if (window.history.length > 1) {
      window.history.back();
    } else {
      window.location.href = '/';
    }
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      
      {/* 404 Hero Section */}
      <section className="section-padding pt-32 particles section-bg-primary min-h-screen flex items-center">
        <div className="max-w-4xl mx-auto text-center">
          {/* Animated 404 */}
          <div className="mb-8 scale-in">
            <div className="relative">
              <h1 className="text-8xl md:text-9xl font-bold text-gradient opacity-20 select-none">
                404
              </h1>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-32 h-32 rounded-full bg-gradient-to-r from-vybe-cyan via-vybe-purple to-vybe-pink animate-pulse flex items-center justify-center">
                  <Zap className="w-16 h-16 text-background" />
                </div>
              </div>
            </div>
          </div>

          {/* Error Message */}
          <div className="mb-8 fade-in">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-red-500/20 to-vybe-purple/20 border border-red-500/30 mb-6">
              <Search className="w-5 h-5 text-red-400 mr-2" />
              <span className="text-sm font-medium text-gradient">Page Not Found</span>
            </div>
          </div>

          <h2 className="text-4xl md:text-6xl font-bold mb-6 leading-tight slide-in-left">
            <span className="text-gradient">Oops! This page got lost in the VYBE</span>
          </h2>

          <p className="text-xl md:text-2xl text-foreground/80 mb-12 leading-relaxed max-w-3xl mx-auto fade-in">
            Looks like this page took an emotional detour and ended up in the wrong looproom. 
            Don't worry, we'll help you find your way back to the emotional tech revolution!
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12 stagger-in">
            <Button 
              className="btn-glow text-lg py-6 px-8" 
              onClick={() => window.location.href = '/'}
            >
              <Home className="w-5 h-5 mr-2" />
              Back to Home
            </Button>
            
            <Button 
              variant="outline" 
              className="border-vybe-cyan/30 hover:border-vybe-cyan text-lg py-6 px-8"
              onClick={goBack}
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Go Back
            </Button>
          </div>

          {/* Fun Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-2xl mx-auto mb-12 stagger-in">
            <div className="vybe-card text-center group hover:scale-105 transition-transform">
              <Heart className="w-8 h-8 text-vybe-cyan mx-auto mb-3" />
              <div className="text-2xl font-bold text-gradient counter" data-target="10000">0</div>
              <p className="text-sm text-foreground/60">People on waitlist</p>
            </div>
            <div className="vybe-card text-center group hover:scale-105 transition-transform">
              <Star className="w-8 h-8 text-vybe-purple mx-auto mb-3" />
              <div className="text-2xl font-bold text-gradient counter" data-target="99">0</div>
              <p className="text-sm text-foreground/60">% Emotional accuracy</p>
            </div>
            <div className="vybe-card text-center group hover:scale-105 transition-transform">
              <Sparkles className="w-8 h-8 text-vybe-pink mx-auto mb-3" />
              <div className="text-2xl font-bold text-gradient counter" data-target="24">0</div>
              <p className="text-sm text-foreground/60">Hours until launch</p>
            </div>
          </div>

          {/* Suggested Pages */}
          <div className="text-center fade-in">
            <h3 className="text-xl font-bold mb-6 text-gradient">While you're here, check these out:</h3>
            <div className="flex flex-wrap justify-center gap-4">
              <a 
                href="/about" 
                className="px-4 py-2 rounded-full bg-vybe-cyan/20 text-vybe-cyan hover:bg-vybe-cyan hover:text-background transition-all duration-300"
              >
                About Us
              </a>
              <a 
                href="/contact" 
                className="px-4 py-2 rounded-full bg-vybe-purple/20 text-vybe-purple hover:bg-vybe-purple hover:text-background transition-all duration-300"
              >
                Contact
              </a>
              <a 
                href="/waitlist" 
                className="px-4 py-2 rounded-full bg-vybe-pink/20 text-vybe-pink hover:bg-vybe-pink hover:text-background transition-all duration-300"
              >
                Join Waitlist
              </a>
              <a 
                href="/privacy" 
                className="px-4 py-2 rounded-full bg-green-500/20 text-green-500 hover:bg-green-500 hover:text-background transition-all duration-300"
              >
                Privacy Policy
              </a>
            </div>
          </div>

          {/* Easter Egg */}
          <div className="mt-16 text-center fade-in">
            <div className="inline-flex items-center space-x-2 text-xs text-foreground/40">
              <span>Error Code: VYBE-404-EMOTIONAL-DETOUR</span>
              <div className="w-2 h-2 bg-gradient-to-r from-vybe-cyan to-vybe-purple rounded-full animate-pulse"></div>
            </div>
            <p className="text-xs text-foreground/30 mt-2">
              Don't worry, this happens to the best of us. Even AI gets emotional sometimes! 🤖💙
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default NotFound;
