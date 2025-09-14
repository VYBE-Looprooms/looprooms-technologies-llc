import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, Users, Heart, Zap } from "lucide-react";

const Hero = () => {
  return (
    <section className="min-h-screen flex items-center justify-center particles relative pt-24 sm:pt-20 overflow-hidden">
      {/* Enhanced Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-vybe-primary/10 via-vybe-secondary/10 to-vybe-accent/10 animate-pulse pointer-events-none"></div>
      
      {/* Floating orbs with improved animations - fully contained within safe area */}
      <div className="absolute top-1/4 left-4 sm:left-12 lg:left-20 w-16 h-16 sm:w-32 sm:h-32 lg:w-64 lg:h-64 bg-vybe-primary/20 rounded-full blur-3xl animate-float parallax pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-4 sm:right-12 lg:right-20 w-16 h-16 sm:w-32 sm:h-32 lg:w-64 lg:h-64 bg-vybe-secondary/20 rounded-full blur-3xl animate-float parallax pointer-events-none" style={{ animationDelay: '2s' }}></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-12 h-12 sm:w-24 sm:h-24 lg:w-48 lg:h-48 bg-vybe-accent/15 rounded-full blur-2xl animate-float parallax pointer-events-none" style={{ animationDelay: '4s' }}></div>
      
      {/* Connection lines animation - mobile responsive */}
      <div className="absolute inset-0 opacity-30 pointer-events-none">
        <div className="absolute top-1/3 left-1/4 w-px h-16 sm:h-32 bg-gradient-to-b from-vybe-primary to-transparent animate-pulse"></div>
        <div className="absolute top-2/3 right-1/3 w-16 sm:w-32 h-px bg-gradient-to-r from-vybe-secondary to-transparent animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-1/3 left-1/2 w-px h-12 sm:h-24 bg-gradient-to-t from-vybe-accent to-transparent animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>
      
      <div className="text-center max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
        {/* Enhanced Badge with social proof */}
        <div className="inline-flex items-center space-x-3 bg-card/60 backdrop-blur-lg border border-vybe-primary/40 rounded-full px-8 py-4 mb-12 scale-in">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-5 h-5 text-vybe-primary animate-pulse" />
            <span className="text-sm font-semibold text-vybe-primary">REVOLUTIONARY</span>
          </div>
          <div className="w-px h-6 bg-vybe-primary/30"></div>
          <div className="flex items-center space-x-2">
            <Users className="w-4 h-4 text-vybe-secondary" />
            <span className="text-sm font-medium">Now Live & Ready</span>
          </div>
        </div>

        {/* Enhanced Main Headline with better typography */}
        <h1 className="fade-in">
          <div className="text-4xl sm:text-7xl lg:text-9xl font-black mb-4 sm:mb-6 tracking-tight">
            <span className="block text-gradient mb-1 sm:mb-2 hover:scale-105 transition-transform duration-300">VYBE</span>
            <span className="block text-gradient mb-4 sm:mb-6 hover:scale-105 transition-transform duration-300">LOOPROOMS™</span>
          </div>
          <div className="text-lg sm:text-4xl lg:text-5xl font-light text-foreground/90 leading-tight">
            The World's First{" "}
            <span className="font-bold text-gradient-reverse">Emotional Tech</span>{" "}
            Ecosystem
          </div>
        </h1>

        {/* Enhanced Subheadline with better emotional messaging */}
        <p className="text-lg sm:text-2xl text-foreground/80 mb-12 sm:mb-16 max-w-5xl mx-auto leading-relaxed slide-in-left">
          Where{" "}
          <span className="text-gradient font-semibold inline-flex items-center gap-2">
            <Heart className="w-5 h-5 sm:w-6 sm:h-6 text-looproom-heart" />
            Recovery
          </span>
          ,{" "}
          <span className="text-gradient font-semibold inline-flex items-center gap-2">
            <Zap className="w-5 h-5 sm:w-6 sm:h-6 text-looproom-fitness" />
            Fitness
          </span>
          , Meditation, Music, and more unite through{" "}
          <span className="text-gradient-reverse font-bold text-xl sm:text-2xl">Loopchains™</span>
        </p>

        {/* Enhanced CTA Section */}
        <div className="mb-16 sm:mb-20 slide-in-right">
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center">
            <Button className="btn-glow text-lg sm:text-xl px-12 sm:px-16 py-6 sm:py-8 group relative overflow-hidden" onClick={() => window.location.href = '/register'}>
              <span className="relative z-10">Start Creating Today</span>
              <ArrowRight className="ml-3 sm:ml-4 w-5 h-5 sm:w-6 sm:h-6 group-hover:translate-x-2 transition-transform relative z-10" />
              <div className="absolute inset-0 bg-gradient-to-r from-vybe-accent via-vybe-secondary to-vybe-primary opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
            </Button>
            
            <div className="text-center sm:text-left fade-in">
              <p className="text-sm text-foreground/60 mb-1">Already have an account? <a href="/login" className="text-vybe-primary hover:text-vybe-secondary transition-colors">Login</a></p>
              <p className="text-xs text-vybe-primary">✓ Free to start • ✓ Professional tools</p>
            </div>
          </div>
        </div>

        {/* Enhanced Stats with animations */}
        <div className="grid grid-cols-3 gap-4 sm:gap-12 stagger-in">
          <div className="text-center group cursor-pointer">
            <div className="text-2xl sm:text-6xl font-black text-gradient mb-1 sm:mb-3 group-hover:scale-110 transition-transform duration-300">5+</div>
            <div className="text-foreground/70 font-medium text-xs sm:text-base leading-tight">Looproom Categories</div>
            <div className="text-xs text-vybe-primary mt-1 sm:mt-2 opacity-0 group-hover:opacity-100 transition-opacity hidden sm:block">Recovery • Fitness • Meditation</div>
          </div>
          <div className="text-center group cursor-pointer">
            <div className="text-2xl sm:text-6xl font-black text-gradient mb-1 sm:mb-3 group-hover:scale-110 transition-transform duration-300">∞</div>
            <div className="text-foreground/70 font-medium text-xs sm:text-base leading-tight">Emotional Connections</div>
            <div className="text-xs text-vybe-secondary mt-1 sm:mt-2 opacity-0 group-hover:opacity-100 transition-opacity hidden sm:block">Limitless Possibilities</div>
          </div>
          <div className="text-center group cursor-pointer">
            <div className="text-2xl sm:text-6xl font-black text-gradient mb-1 sm:mb-3 group-hover:scale-110 transition-transform duration-300">1st</div>
            <div className="text-foreground/70 font-medium text-xs sm:text-base leading-tight">Of Its Kind</div>
            <div className="text-xs text-vybe-accent mt-1 sm:mt-2 opacity-0 group-hover:opacity-100 transition-opacity hidden sm:block">Pioneering Innovation</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;