import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";

const Hero = () => {
  return (
    <section className="min-h-screen flex items-center justify-center particles relative overflow-hidden">
      {/* Background gradients */}
      <div className="absolute inset-0 bg-gradient-to-br from-vybe-cyan/10 via-vybe-purple/10 to-vybe-pink/10 animate-pulse"></div>
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-vybe-cyan/20 rounded-full blur-3xl animate-float"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-vybe-purple/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
      
      <div className="relative z-10 text-center max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Badge */}
        <div className="inline-flex items-center space-x-2 bg-card/50 backdrop-blur-sm border border-vybe-cyan/30 rounded-full px-6 py-3 mb-8 animate-fade-in">
          <Sparkles className="w-5 h-5 text-vybe-cyan" />
          <span className="text-sm font-medium">World's First Emotional Tech Ecosystem</span>
        </div>

        {/* Main Headline */}
        <h1 className="text-4xl sm:text-6xl lg:text-8xl font-bold mb-8 animate-slide-up">
          <span className="block text-gradient mb-4">VYBE LOOPROOMS™</span>
          <span className="block text-2xl sm:text-3xl lg:text-4xl font-normal text-foreground/80">
            The World's First Emotional Tech Ecosystem
          </span>
        </h1>

        {/* Subheadline */}
        <p className="text-xl sm:text-2xl text-foreground/70 mb-12 max-w-4xl mx-auto leading-relaxed animate-fade-in" style={{ animationDelay: '0.3s' }}>
          Recovery, Fitness, Meditation, Music, and more — all connected through{" "}
          <span className="text-gradient font-semibold">Loopchains™</span>
        </p>

        {/* CTA Button */}
        <div className="animate-fade-in" style={{ animationDelay: '0.6s' }}>
          <Button className="btn-glow text-xl px-12 py-6 group">
            Join the Waitlist
            <ArrowRight className="ml-3 w-6 h-6 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mt-20 animate-fade-in" style={{ animationDelay: '0.9s' }}>
          <div className="text-center">
            <div className="text-3xl sm:text-4xl font-bold text-gradient mb-2">5+</div>
            <div className="text-foreground/60">Looproom Categories</div>
          </div>
          <div className="text-center">
            <div className="text-3xl sm:text-4xl font-bold text-gradient mb-2">∞</div>
            <div className="text-foreground/60">Emotional Connections</div>
          </div>
          <div className="text-center">
            <div className="text-3xl sm:text-4xl font-bold text-gradient mb-2">1st</div>
            <div className="text-foreground/60">Of Its Kind</div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-vybe-cyan/50 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-vybe-cyan rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>
    </section>
  );
};

export default Hero;