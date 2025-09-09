import { Button } from "@/components/ui/button";
import { Star, Users, TrendingUp, Award, ArrowRight, DollarSign, Heart, Zap } from "lucide-react";

const CreatorHighlight = () => {
  const benefits = [
    {
      icon: TrendingUp,
      title: "Monetize Expertise",
      description: "Turn your knowledge into sustainable income through VYBE's creator economy.",
      stat: "70% avg. revenue share",
      color: "vybe-cyan"
    },
    {
      icon: Users,
      title: "Build Community",
      description: "Connect with audiences who truly resonate with your unique approach and vision.",
      stat: "10x engagement rate",
      color: "vybe-purple"
    },
    {
      icon: Award,
      title: "Premium Tools",
      description: "Access cutting-edge technology to create immersive, transformational experiences.",
      stat: "5+ content formats",
      color: "vybe-pink"
    }
  ];

  const creatorTypes = [
    { icon: Heart, name: "Therapists", count: "500+", color: "text-vybe-pink" },
    { icon: Zap, name: "Fitness Coaches", count: "300+", color: "text-vybe-cyan" },
    { icon: Star, name: "Meditation Guides", count: "200+", color: "text-vybe-purple" }
  ];

  return (
    <section id="creators" className="section-padding section-bg-primary section-separator relative overflow-hidden">
      {/* Enhanced background effects */}
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-vybe-cyan/5 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-vybe-purple/5 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-vybe-pink/5 rounded-full blur-2xl animate-float" style={{ animationDelay: '4s' }}></div>
      </div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Enhanced container with better visual hierarchy */}
        <div className="relative border-glow rounded-3xl p-8 lg:p-16 overflow-hidden backdrop-blur-sm fade-in">
          {/* Background pattern */}
          <div className="absolute inset-0 bg-gradient-to-br from-vybe-cyan/10 via-vybe-purple/10 to-vybe-pink/10"></div>
          
          <div className="relative z-10">
            {/* Enhanced badge with creator count - Fixed icon positioning */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-12 gap-6">
              <div className="inline-flex items-center space-x-3 bg-vybe-purple/20 backdrop-blur-sm border border-vybe-purple/40 rounded-full px-8 py-4">
                <Star className="w-6 h-6 text-vybe-purple animate-pulse flex-shrink-0" />
                <span className="text-lg font-bold text-vybe-purple whitespace-nowrap">Creator Program</span>
              </div>
              
              {/* Fixed creator stats with proper icon containers */}
              <div className="flex flex-wrap gap-4 sm:gap-6">
                {creatorTypes.map((type, idx) => (
                  <div key={idx} className="flex flex-col items-center text-center min-w-0">
                    <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-gradient-to-br flex items-center justify-center mb-2 flex-shrink-0 ${
                      type.color === 'text-vybe-pink' ? 'from-pink-500/20 to-purple-500/20' :
                      type.color === 'text-vybe-cyan' ? 'from-cyan-500/20 to-blue-500/20' :
                      'from-purple-500/20 to-pink-500/20'
                    }`}>
                      <type.icon className={`w-6 h-6 ${type.color} flex-shrink-0`} />
                    </div>
                    <div className="text-sm font-bold text-foreground">{type.count}</div>
                    <div className="text-xs text-foreground/60 break-words">{type.name}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center mb-16">
              {/* Left Content - Enhanced */}
              <div className="fade-in-left">
                <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black mb-8 leading-tight scale-in">
                  <span className="block text-gradient mb-2">Transform Lives</span>
                  <span className="block text-foreground mb-2">and Build Your</span>
                  <span className="block text-gradient-reverse">Creator Empire</span>
                </h2>
                
                <p className="text-xl text-foreground/80 mb-8 leading-relaxed">
                  Join our exclusive creator ecosystem where passionate experts are earning 
                  <span className="text-gradient font-bold"> $5K-50K monthly</span> while 
                  making real impact on emotional well-being.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 mb-8">
                  <Button className="btn-glow text-lg px-8 py-6 group flex-1" onClick={() => window.location.href = '/contact'}>
                    Apply as Creator
                    <ArrowRight className="ml-3 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="border-vybe-cyan/30 text-vybe-cyan hover:bg-vybe-cyan/10 px-8 py-6 text-lg"
                    onClick={() => window.location.href = '/about'}
                  >
                    Learn More
                  </Button>
                </div>

                <div className="text-sm text-foreground/60">
                  ✓ No upfront costs • ✓ Full content ownership • ✓ 24/7 support
                </div>
              </div>

              {/* Right Content - Enhanced Benefits with proper card layout */}
              <div className="space-y-6">
                {benefits.map((benefit, index) => (
                  <div key={index} className="group cursor-pointer">
                    <div className="vybe-card hover:scale-105 transition-all duration-500 overflow-hidden">
                      <div className="flex items-start space-x-4">
                        {/* Fixed icon container */}
                        <div className={`flex-shrink-0 w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center group-hover:animate-glow transition-all duration-300 ${
                          benefit.color === 'vybe-cyan' ? 'bg-gradient-to-br from-cyan-500/20 to-blue-500/20' :
                          benefit.color === 'vybe-purple' ? 'bg-gradient-to-br from-purple-500/20 to-pink-500/20' :
                          'bg-gradient-to-br from-pink-500/20 to-purple-500/20'
                        }`}>
                          <benefit.icon className={`w-7 h-7 sm:w-8 sm:h-8 ${
                            benefit.color === 'vybe-cyan' ? 'text-cyan-400' :
                            benefit.color === 'vybe-purple' ? 'text-purple-400' :
                            'text-pink-400'
                          } flex-shrink-0`} />
                        </div>
                        
                        {/* Fixed content container with proper text wrapping */}
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3 gap-2">
                            <h3 className="text-lg sm:text-xl font-bold text-gradient break-words">
                              {benefit.title}
                            </h3>
                            <div className={`text-xs sm:text-sm font-bold px-3 py-1 rounded-full whitespace-nowrap flex-shrink-0 ${
                              benefit.color === 'vybe-cyan' ? 'text-cyan-400 bg-cyan-500/10' :
                              benefit.color === 'vybe-purple' ? 'text-purple-400 bg-purple-500/10' :
                              'text-pink-400 bg-pink-500/10'
                            }`}>
                              {benefit.stat}
                            </div>
                          </div>
                          <p className="text-sm sm:text-base text-foreground/70 leading-relaxed break-words">
                            {benefit.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Enhanced Success Stories Preview */}
            <div className="bg-gradient-to-r from-vybe-cyan/10 to-vybe-purple/10 rounded-3xl p-8 mb-16">
              <h3 className="text-2xl font-bold text-center text-gradient mb-6">Creator Success Stories</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-vybe-cyan mb-2">$15K</div>
                  <div className="text-sm text-foreground/60">Monthly Revenue</div>
                  <div className="text-xs text-foreground/50">Sarah, Recovery Coach</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-vybe-purple mb-2">5K</div>
                  <div className="text-sm text-foreground/60">Active Students</div>
                  <div className="text-xs text-foreground/50">Marcus, Fitness Expert</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-vybe-pink mb-2">98%</div>
                  <div className="text-sm text-foreground/60">Satisfaction Rate</div>
                  <div className="text-xs text-foreground/50">Zen, Meditation Guide</div>
                </div>
              </div>
            </div>

            {/* Enhanced Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 pt-8 border-t border-vybe-cyan/20">
              <div className="text-center group cursor-pointer">
                <div className="text-4xl sm:text-5xl font-black text-gradient mb-3 group-hover:scale-110 transition-transform duration-300">∞</div>
                <div className="text-foreground/70 font-medium">Creative Possibilities</div>
                <div className="text-xs text-vybe-cyan mt-2 opacity-0 group-hover:opacity-100 transition-opacity">Unlimited Content Types</div>
              </div>
              <div className="text-center group cursor-pointer">
                <div className="text-4xl sm:text-5xl font-black text-gradient mb-3 group-hover:scale-110 transition-transform duration-300">24/7</div>
                <div className="text-foreground/70 font-medium">Creator Support</div>
                <div className="text-xs text-vybe-purple mt-2 opacity-0 group-hover:opacity-100 transition-opacity">Dedicated Success Team</div>
              </div>
              <div className="text-center group cursor-pointer">
                <div className="text-4xl sm:text-5xl font-black text-gradient mb-3 group-hover:scale-110 transition-transform duration-300">100%</div>
                <div className="text-foreground/70 font-medium">Ownership Rights</div>
                <div className="text-xs text-vybe-pink mt-2 opacity-0 group-hover:opacity-100 transition-opacity">You Keep Full Control</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CreatorHighlight;