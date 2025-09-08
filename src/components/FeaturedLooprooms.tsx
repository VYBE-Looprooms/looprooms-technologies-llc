import { Button } from "@/components/ui/button";
import { Heart, Zap, Brain } from "lucide-react";

const FeaturedLooprooms = () => {
  const looprooms = [
    {
      icon: Heart,
      title: "Recovery Looproom",
      description: "Healing journeys for emotional recovery, trauma processing, and personal growth through guided therapeutic experiences.",
      gradient: "from-vybe-pink/20 to-vybe-purple/20",
      iconGradient: "from-vybe-pink to-vybe-purple"
    },
    {
      icon: Brain,
      title: "Meditation Looproom",
      description: "Mindfulness practices, breathing techniques, and spiritual exploration designed to center your mind and elevate consciousness.",
      gradient: "from-vybe-cyan/20 to-vybe-blue/20",
      iconGradient: "from-vybe-cyan to-vybe-blue"
    },
    {
      icon: Zap,
      title: "Fitness Looproom",
      description: "Dynamic workouts, movement therapy, and physical wellness programs that connect body, mind, and emotional well-being.",
      gradient: "from-vybe-blue/20 to-vybe-purple/20",
      iconGradient: "from-vybe-blue to-vybe-purple"
    }
  ];

  return (
    <section id="looprooms" className="section-padding particles relative">
      {/* Background elements */}
      <div className="absolute top-20 right-20 w-64 h-64 bg-vybe-purple/10 rounded-full blur-3xl animate-float"></div>
      <div className="absolute bottom-20 left-20 w-64 h-64 bg-vybe-cyan/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '3s' }}></div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center space-x-2 bg-card/50 backdrop-blur-sm border border-vybe-purple/30 rounded-full px-6 py-3 mb-6">
            <div className="w-2 h-2 bg-vybe-purple rounded-full animate-pulse"></div>
            <span className="text-sm font-medium">Featured Experiences</span>
          </div>
          
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
            <span className="text-gradient-reverse">Explore Looprooms</span>
          </h2>
          <p className="text-xl text-foreground/70 max-w-3xl mx-auto">
            Discover specialized environments designed to nurture different aspects of your emotional and physical well-being.
          </p>
        </div>

        {/* Looprooms Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {looprooms.map((looproom, index) => (
            <div key={index} className="group relative">
              {/* Card */}
              <div className={`vybe-card h-full bg-gradient-to-br ${looproom.gradient} backdrop-blur-sm transition-all duration-500 group-hover:scale-105`}>
                {/* Icon */}
                <div className={`w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br ${looproom.iconGradient} flex items-center justify-center shadow-lg group-hover:animate-glow`}>
                  <looproom.icon className="w-8 h-8 text-background" />
                </div>

                {/* Content */}
                <h3 className="text-2xl font-bold mb-4 text-center text-gradient">
                  {looproom.title}
                </h3>
                <p className="text-foreground/70 leading-relaxed mb-8 text-center">
                  {looproom.description}
                </p>

                {/* CTA Button */}
                <div className="text-center">
                  <Button 
                    disabled 
                    className="w-full bg-gradient-to-r from-foreground/10 to-foreground/5 text-foreground/50 cursor-not-allowed border border-foreground/20 hover:bg-gradient-to-r hover:from-foreground/10 hover:to-foreground/5"
                  >
                    Coming Soon
                  </Button>
                </div>
              </div>

              {/* Hover glow effect */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-vybe-cyan/0 via-vybe-purple/0 to-vybe-pink/0 group-hover:from-vybe-cyan/5 group-hover:via-vybe-purple/5 group-hover:to-vybe-pink/5 transition-all duration-500 -z-10 blur-xl"></div>
            </div>
          ))}
        </div>

        {/* Bottom Message */}
        <div className="text-center mt-16">
          <p className="text-lg text-foreground/60 mb-4">
            More Looprooms launching soon...
          </p>
          <div className="flex justify-center space-x-2">
            {[...Array(5)].map((_, i) => (
              <div 
                key={i} 
                className="w-3 h-3 bg-vybe-cyan/30 rounded-full animate-pulse"
                style={{ animationDelay: `${i * 0.2}s` }}
              ></div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturedLooprooms;