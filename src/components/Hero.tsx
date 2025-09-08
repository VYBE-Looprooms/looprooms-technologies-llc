import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, Users, Heart, Zap } from "lucide-react";
import { useState, useEffect } from "react";

const Hero = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [countUp, setCountUp] = useState({ users: 0, connections: 0 });

  useEffect(() => {
    setIsVisible(true);
    // Animate counters
    const timer = setTimeout(() => {
      setCountUp({ users: 10000, connections: 50000 });
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="min-h-screen flex items-center justify-center particles relative overflow-hidden pt-20">
      {/* Enhanced Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-vybe-cyan/10 via-vybe-purple/10 to-vybe-pink/10 animate-pulse"></div>
      
      {/* Floating orbs with improved animations */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-vybe-cyan/20 rounded-full blur-3xl animate-float parallax"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-vybe-purple/20 rounded-full blur-3xl animate-float parallax" style={{ animationDelay: '2s' }}></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-vybe-pink/15 rounded-full blur-2xl animate-float parallax" style={{ animationDelay: '4s' }}></div>
      
      {/* Connection lines animation */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-1/3 left-1/4 w-px h-32 bg-gradient-to-b from-vybe-cyan to-transparent animate-pulse"></div>
        <div className="absolute top-2/3 right-1/3 w-32 h-px bg-gradient-to-r from-vybe-purple to-transparent animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-1/3 left-1/2 w-px h-24 bg-gradient-to-t from-vybe-pink to-transparent animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>
      
      <div className="relative z-10 text-center max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Enhanced Badge with social proof */}
        <div className={`inline-flex items-center space-x-3 bg-card/60 backdrop-blur-lg border border-vybe-cyan/40 rounded-full px-8 py-4 mb-12 transition-all duration-1000 scale-in ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <div className="flex items-center space-x-2">
            <Sparkles className="w-5 h-5 text-vybe-cyan animate-pulse" />
            <span className="text-sm font-semibold text-vybe-cyan">REVOLUTIONARY</span>
          </div>
          <div className="w-px h-6 bg-vybe-cyan/30"></div>
          <div className="flex items-center space-x-2">
            <Users className="w-4 h-4 text-vybe-purple" />
            <span className="text-sm font-medium counter" data-target="10000">Join 0+ on the waitlist</span>
          </div>
        </div>

        {/* Enhanced Main Headline with better typography */}
        <h1 className={`transition-all duration-1200 delay-300 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}>
          <div className="text-5xl sm:text-7xl lg:text-9xl font-black mb-6 tracking-tight">
            <span className="block text-gradient mb-2 hover:scale-105 transition-transform duration-300">VYBE</span>
            <span className="block text-gradient mb-6 hover:scale-105 transition-transform duration-300">LOOPROOMS™</span>
          </div>
          <div className="text-2xl sm:text-4xl lg:text-5xl font-light text-foreground/90 leading-tight">
            The World's First{" "}
            <span className="font-bold text-gradient-reverse">Emotional Tech</span>{" "}
            Ecosystem
          </div>
        </h1>

        {/* Enhanced Subheadline with better emotional messaging */}
        <p className={`text-xl sm:text-2xl text-foreground/80 mb-16 max-w-5xl mx-auto leading-relaxed transition-all duration-1200 delay-600 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}>
          Where{" "}
          <span className="text-gradient font-semibold inline-flex items-center gap-2">
            <Heart className="w-6 h-6" />
            Recovery
          </span>
          ,{" "}
          <span className="text-gradient font-semibold inline-flex items-center gap-2">
            <Zap className="w-6 h-6" />
            Fitness
          </span>
          , Meditation, Music, and more unite through{" "}
          <span className="text-gradient-reverse font-bold text-2xl">Loopchains™</span>
        </p>

        {/* Enhanced CTA Section */}
        <div className={`transition-all duration-1200 delay-900 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'} mb-20`}>
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Button className="btn-glow text-xl px-16 py-8 group relative overflow-hidden" onClick={() => window.location.href = '/waitlist'}>
              <span className="relative z-10">Join the Revolution</span>
              <ArrowRight className="ml-4 w-6 h-6 group-hover:translate-x-2 transition-transform relative z-10" />
              <div className="absolute inset-0 bg-gradient-to-r from-vybe-pink via-vybe-purple to-vybe-cyan opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
            </Button>
            
            <div className="text-center sm:text-left">
              <p className="text-sm text-foreground/60 mb-1">Join {countUp.users.toLocaleString()}+ people</p>
              <p className="text-xs text-vybe-cyan">✓ No spam, just updates</p>
            </div>
          </div>
        </div>

        {/* Enhanced Stats with animations */}
        <div className={`grid grid-cols-1 sm:grid-cols-3 gap-12 transition-all duration-1200 delay-1200 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}>
          <div className="text-center group cursor-pointer">
            <div className="text-4xl sm:text-6xl font-black text-gradient mb-3 group-hover:scale-110 transition-transform duration-300">5+</div>
            <div className="text-foreground/70 font-medium">Looproom Categories</div>
            <div className="text-xs text-vybe-cyan mt-2 opacity-0 group-hover:opacity-100 transition-opacity">Recovery • Fitness • Meditation</div>
          </div>
          <div className="text-center group cursor-pointer">
            <div className="text-4xl sm:text-6xl font-black text-gradient mb-3 group-hover:scale-110 transition-transform duration-300">∞</div>
            <div className="text-foreground/70 font-medium">Emotional Connections</div>
            <div className="text-xs text-vybe-purple mt-2 opacity-0 group-hover:opacity-100 transition-opacity">Limitless Possibilities</div>
          </div>
          <div className="text-center group cursor-pointer">
            <div className="text-4xl sm:text-6xl font-black text-gradient mb-3 group-hover:scale-110 transition-transform duration-300">1st</div>
            <div className="text-foreground/70 font-medium">Of Its Kind</div>
            <div className="text-xs text-vybe-pink mt-2 opacity-0 group-hover:opacity-100 transition-opacity">Pioneering Innovation</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;