import { Button } from "@/components/ui/button";
import { Star, Users, TrendingUp, Award } from "lucide-react";

const CreatorHighlight = () => {
  const benefits = [
    {
      icon: TrendingUp,
      title: "Monetize Expertise",
      description: "Turn your knowledge into sustainable income through VYBE's creator economy."
    },
    {
      icon: Users,
      title: "Build Community",
      description: "Connect with audiences who truly resonate with your unique approach and vision."
    },
    {
      icon: Award,
      title: "Premium Tools",
      description: "Access cutting-edge technology to create immersive, transformational experiences."
    }
  ];

  return (
    <section id="creators" className="section-padding bg-gradient-to-b from-background to-secondary/30">
      <div className="max-w-7xl mx-auto">
        {/* Neon border container */}
        <div className="relative border-glow rounded-3xl p-8 lg:p-16 overflow-hidden">
          {/* Background effects */}
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-vybe-cyan/5 via-vybe-purple/5 to-vybe-pink/5"></div>
          <div className="absolute -top-20 -right-20 w-40 h-40 bg-vybe-cyan/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-vybe-purple/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>

          <div className="relative z-10">
            {/* Badge */}
            <div className="inline-flex items-center space-x-2 bg-vybe-purple/20 backdrop-blur-sm border border-vybe-purple/40 rounded-full px-6 py-3 mb-8">
              <Star className="w-5 h-5 text-vybe-purple" />
              <span className="text-sm font-medium text-vybe-purple">For Creators</span>
            </div>

            {/* Main Content */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              {/* Left Content */}
              <div>
                <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
                  <span className="text-gradient">Creators can monetize</span>
                  <br />
                  <span className="text-foreground">their expertise through</span>
                  <br />
                  <span className="text-gradient-reverse">VYBE LOOPROOMS™</span>
                </h2>
                
                <p className="text-xl text-foreground/70 mb-8 leading-relaxed">
                  Join our exclusive creator ecosystem and transform your passion into a thriving business. 
                  Build meaningful connections while making a real impact on people's emotional well-being.
                </p>

                <Button className="btn-glow text-lg px-8 py-4 group">
                  Apply as a Creator
                  <Star className="ml-3 w-5 h-5 group-hover:rotate-12 transition-transform" />
                </Button>
              </div>

              {/* Right Content - Benefits */}
              <div className="space-y-6">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-start space-x-4 group">
                    <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-vybe-cyan/20 to-vybe-purple/20 rounded-xl flex items-center justify-center group-hover:animate-glow">
                      <benefit.icon className="w-6 h-6 text-vybe-cyan" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold mb-2 text-gradient">
                        {benefit.title}
                      </h3>
                      <p className="text-foreground/70">
                        {benefit.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mt-16 pt-16 border-t border-vybe-cyan/20">
              <div className="text-center">
                <div className="text-3xl sm:text-4xl font-bold text-gradient mb-2">∞</div>
                <div className="text-foreground/60">Creative Possibilities</div>
              </div>
              <div className="text-center">
                <div className="text-3xl sm:text-4xl font-bold text-gradient mb-2">24/7</div>
                <div className="text-foreground/60">Creator Support</div>
              </div>
              <div className="text-center">
                <div className="text-3xl sm:text-4xl font-bold text-gradient mb-2">100%</div>
                <div className="text-foreground/60">Ownership Rights</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CreatorHighlight;