import { Button } from "@/components/ui/button";
import { Heart, Zap, Brain, ArrowRight, Clock, Users, Star } from "lucide-react";
import { useState } from "react";

const FeaturedLooprooms = () => {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  
  const looprooms = [
    {
      icon: Heart,
      title: "Recovery Looproom",
    description: "Healing spaces for NA/AA, emotional recovery, and personal growth. Join group sessions, 1-on-1 guidance, and anonymous support — all within the VYBE ecosystem.",
    gradient: "from-vybe-pink/20 to-vybe-purple/20",
    iconGradient: "from-vybe-pink to-vybe-purple",
    accentColor: "vybe-pink",
    features: ["1-on-1 Therapy", "Group Support", "Progress Tracking"],
    comingSoon: "Q2 2025"
    },
    {
      icon: Brain,
      title: "Meditation Looproom",
    description: "Mindful journeys through guided meditation, breathing, and calming practices that elevate focus, balance, and emotional clarity in the VYBE ecosystem.",
    gradient: "from-vybe-cyan/20 to-vybe-blue/20",
    iconGradient: "from-vybe-cyan to-vybe-blue",
    accentColor: "vybe-cyan",
    features: ["Guided Sessions", "Breathing Exercises", "Mindful Journeys"],
    comingSoon: "Q1 2025"
    },
    {
      icon: Zap,
      title: "Fitness Looproom",
    description: "Energizing workouts, movement therapy, and wellness coaching designed to connect body, mind, and emotions through the VYBE ecosystem.",
    gradient: "from-vybe-blue/20 to-vybe-purple/20",
    iconGradient: "from-vybe-blue to-vybe-purple",
    accentColor: "vybe-blue",
    features: ["Live Workouts", "Movement Therapy", "Wellness Programs"],
    comingSoon: "Q3 2025"
    }
  ];

  return (
    <section id="looprooms" className="section-padding section-bg-secondary section-separator particles relative">
      {/* Background elements */}
      <div className="absolute top-20 right-20 w-64 h-64 bg-vybe-purple/10 rounded-full blur-3xl animate-float"></div>
      <div className="absolute bottom-20 left-20 w-64 h-64 bg-vybe-cyan/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '3s' }}></div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center mb-20 fade-in">
          <div className="inline-flex items-center space-x-2 bg-card/50 backdrop-blur-sm border border-vybe-purple/30 rounded-full px-6 py-3 mb-6">
            <div className="w-2 h-2 bg-vybe-purple rounded-full animate-pulse"></div>
            <span className="text-sm font-medium">Featured Experiences</span>
          </div>
          
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 scale-in">
            <span className="text-gradient-reverse">Explore Looprooms</span>
          </h2>
          <p className="text-xl text-foreground/70 max-w-3xl mx-auto fade-in-up">
            Discover specialized environments designed to nurture different aspects of your emotional and physical well-being.
          </p>
        </div>

        {/* Enhanced Looprooms Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 stagger-in">
          {looprooms.map((looproom, index) => (
            <div 
              key={index} 
              className="group relative fade-in-up h-full flex flex-col"
              onMouseEnter={() => setHoveredCard(index)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              {/* Enhanced Card with better interactions */}
              <div className={`vybe-card h-full bg-gradient-to-br ${looproom.gradient} backdrop-blur-sm transition-all duration-700 group-hover:scale-105 group-hover:-translate-y-2 relative overflow-hidden flex flex-col`}>
                
                {/* Animated background pattern */}
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute top-4 right-4 w-32 h-32 border border-current rounded-full animate-spin-slow"></div>
                  <div className="absolute bottom-4 left-4 w-24 h-24 border border-current rounded-full animate-pulse"></div>
                </div>

                {/* Coming Soon Badge */}
                <div className="absolute top-4 right-4 z-10">
                  <div className="bg-gradient-to-r from-vybe-cyan to-vybe-purple text-background text-xs font-bold px-3 py-1 rounded-full flex items-center space-x-1">
                    <Clock className="w-3 h-3" />
                    <span>{looproom.comingSoon}</span>
                  </div>
                </div>

                {/* Enhanced Icon with interactive effects */}
                <div className={`w-20 h-20 mx-auto mb-6 rounded-3xl bg-gradient-to-br ${looproom.iconGradient} flex items-center justify-center shadow-2xl group-hover:animate-glow relative overflow-hidden`}>
                  <looproom.icon className="w-10 h-10 text-background relative z-10" />
                  <div className="absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>

                {/* Enhanced Content */}
                <div className="flex-1 flex flex-col">
                  <h3 className={`text-2xl font-bold mb-4 text-center transition-all duration-300 ${hoveredCard === index ? 'text-gradient scale-105' : 'text-foreground'}`}>
                    {looproom.title}
                  </h3>
                  
                  <p className="text-foreground/70 leading-relaxed mb-6 text-center flex-1">
                    {looproom.description}
                  </p>

                  {/* Features List - Fixed height container */}
                  <div className="mb-8 min-h-[120px] flex items-start">
                    <div className="flex flex-wrap gap-2 justify-center w-full">
                      {looproom.features.map((feature, idx) => (
                        <div 
                          key={idx} 
                          className="bg-foreground/10 backdrop-blur-sm border border-foreground/20 rounded-full px-3 py-1 text-xs font-medium flex items-center space-x-1"
                        >
                          <Star className="w-3 h-3 text-vybe-cyan" />
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Enhanced CTA Buttons */}
                <div className="text-center space-y-3">
                  <Button 
                    className="w-full bg-gradient-to-r from-vybe-cyan/20 to-vybe-purple/20 text-foreground border border-vybe-cyan/30 hover:border-vybe-cyan/60 hover:bg-gradient-to-r hover:from-vybe-cyan/30 hover:to-vybe-purple/30 transition-all duration-300 group/btn"
                    onClick={() => window.location.href = '/waitlist'}
                  >
                    <span>Get Notified</span>
                    <ArrowRight className="ml-2 w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                  </Button>
                  
                  <div className="text-center">
                    <div className="flex items-center justify-center space-x-2 text-xs text-foreground/50">
                      <Users className="w-3 h-3" />
                      <span>{Math.floor(Math.random() * 5000 + 1000).toLocaleString()} interested</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Enhanced hover glow effect */}
              <div className={`absolute inset-0 rounded-2xl transition-all duration-700 -z-10 blur-xl ${hoveredCard === index ? `bg-gradient-to-br from-${looproom.accentColor}/20 via-${looproom.accentColor}/10 to-transparent` : ''}`}></div>
            </div>
          ))}
        </div>

        {/* Enhanced Bottom Section with roadmap preview */}
        <div className="text-center mt-20">
          <div className="bg-gradient-to-r from-vybe-cyan/10 to-vybe-purple/10 rounded-3xl p-8 backdrop-blur-sm border border-vybe-cyan/20">
            <h3 className="text-2xl font-bold text-gradient mb-4">The Journey Continues...</h3>
            <p className="text-lg text-foreground/70 mb-6">
              More transformative Looprooms launching throughout 2025
            </p>
            
            {/* Roadmap preview */}
            <div className="flex flex-wrap justify-center gap-4 mb-8">
              {['Music Therapy', 'Art Expression', 'Nature Connection', 'Community Building', 'AI Coaching'].map((room, idx) => (
                <div key={idx} className="bg-gradient-to-r from-vybe-purple/20 to-vybe-pink/20 rounded-full px-4 py-2 text-sm font-medium border border-vybe-purple/30">
                  {room}
                </div>
              ))}
            </div>
            
            <div className="flex justify-center space-x-3">
              {[...Array(8)].map((_, i) => (
                <div 
                  key={i} 
                  className="w-3 h-3 bg-gradient-to-r from-vybe-cyan to-vybe-purple rounded-full animate-pulse"
                  style={{ animationDelay: `${i * 0.2}s` }}
                ></div>
              ))}
            </div>
            
            <Button 
              className="mt-6 btn-glow"
              onClick={() => window.location.href = '/waitlist'}
            >
              Be First to Know
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturedLooprooms;