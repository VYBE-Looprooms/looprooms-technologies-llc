import { Search, Users, Link, ArrowRight, PlayCircle, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const HowItWorks = () => {
  const [activeStep, setActiveStep] = useState(0);
  
  const steps = [
    {
      icon: Search,
      title: "Choose a Looproom",
      description: "Select from Recovery, Fitness, Meditation, Music, and more specialized experiences tailored to your emotional needs.",
      details: ["Browse 5+ categories", "Personalized recommendations", "Instant access"],
      color: "vybe-cyan"
    },
    {
      icon: Users,
      title: "Engage & Interact",
      description: "Connect with like-minded individuals, participate in guided sessions, and build meaningful relationships in your chosen space.",
      details: ["Live sessions", "Community interaction", "Expert guidance"],
      color: "vybe-purple"
    },
    {
      icon: Link,
      title: "Follow a Loopchain",
      description: "Experience interconnected journeys that guide your emotional growth through personalized pathways and shared experiences.",
      details: ["Personalized pathways", "Progress tracking", "Continuous growth"],
      color: "vybe-pink"
    }
  ];

  return (
    <section id="how-it-works" className="section-padding section-bg-primary section-separator relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute top-20 left-20 w-64 h-64 bg-vybe-cyan/5 rounded-full blur-3xl animate-float parallax"></div>
      <div className="absolute bottom-20 right-20 w-64 h-64 bg-vybe-purple/5 rounded-full blur-3xl animate-float parallax" style={{ animationDelay: '2s' }}></div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Enhanced Section Header */}
        <div className="text-center mb-20 fade-in">
          <div className="inline-flex items-center space-x-2 bg-card/50 backdrop-blur-sm border border-vybe-purple/30 rounded-full px-6 py-3 mb-6 scale-in">
            <PlayCircle className="w-5 h-5 text-vybe-purple" />
            <span className="text-sm font-medium">Simple Process</span>
          </div>
          
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 text-reveal">
            <span className="text-gradient">How It Works</span>
          </h2>
          <p className="text-xl text-foreground/70 max-w-3xl mx-auto leading-relaxed slide-in-left">
            Experience emotional technology through three simple steps that transform how you connect, grow, and thrive in our ecosystem.
          </p>
        </div>

        {/* Interactive Steps */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12 mb-16 stagger-in">
          {steps.map((step, index) => (
            <div 
              key={index} 
              className="relative group cursor-pointer"
              onMouseEnter={() => setActiveStep(index)}
            >
              {/* Enhanced Connection line for desktop */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-20 left-full w-full h-0.5 bg-gradient-to-r from-vybe-cyan/30 to-vybe-purple/30 transform translate-x-6 z-0">
                  <div className="absolute right-0 top-1/2 transform -translate-y-1/2">
                    <div className="w-4 h-4 bg-gradient-to-r from-vybe-purple to-vybe-pink rounded-full animate-pulse"></div>
                  </div>
                  <div className="absolute left-0 top-1/2 transform -translate-y-1/2">
                    <div className="w-2 h-2 bg-vybe-cyan rounded-full"></div>
                  </div>
                </div>
              )}

              {/* Enhanced Step Card */}
              <div className={`vybe-card text-center transition-all duration-700 relative z-10 ${activeStep === index ? 'scale-105 -translate-y-2' : 'hover:scale-105 hover:-translate-y-2'}`}>
                
                {/* Enhanced Step Number */}
                <div className={`absolute -top-4 -left-4 w-10 h-10 bg-gradient-to-br from-${step.color} to-vybe-purple rounded-full flex items-center justify-center text-sm font-bold text-background shadow-lg ${activeStep === index ? 'animate-glow' : ''}`}>
                  {index + 1}
                </div>

                {/* Enhanced Icon */}
                <div className={`w-24 h-24 mx-auto mb-6 rounded-3xl bg-gradient-to-br from-${step.color}/20 to-vybe-purple/20 flex items-center justify-center transition-all duration-500 ${activeStep === index ? 'animate-glow' : 'group-hover:animate-glow'} relative overflow-hidden`}>
                  <step.icon className={`w-12 h-12 text-${step.color} relative z-10`} />
                  <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>

                {/* Enhanced Content */}
                <h3 className={`text-2xl font-bold mb-4 transition-all duration-300 ${activeStep === index ? 'text-gradient scale-105' : 'text-foreground group-hover:text-gradient'}`}>
                  {step.title}
                </h3>
                
                <p className="text-foreground/70 leading-relaxed mb-6">
                  {step.description}
                </p>

                {/* Feature List */}
                <div className="space-y-2 mb-6">
                  {step.details.map((detail, idx) => (
                    <div key={idx} className="flex items-center justify-center space-x-2 text-sm text-foreground/60">
                      <CheckCircle className={`w-4 h-4 text-${step.color}`} />
                      <span>{detail}</span>
                    </div>
                  ))}
                </div>

                {/* Progress Indicator */}
                <div className="w-full bg-foreground/10 rounded-full h-1 mb-4">
                  <div 
                    className={`h-1 bg-gradient-to-r from-${step.color} to-vybe-purple rounded-full transition-all duration-1000 ${activeStep === index ? 'w-full' : 'w-0'}`}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Enhanced Interactive Demo Section */}
        <div className="bg-gradient-to-br from-vybe-cyan/10 to-vybe-purple/10 rounded-3xl p-12 backdrop-blur-sm border border-vybe-cyan/20 text-center scale-in">
          <h3 className="text-3xl font-bold text-gradient mb-4">Ready to Experience the Future?</h3>
          <p className="text-lg text-foreground/70 mb-8 max-w-2xl mx-auto fade-in">
            Join thousands of early adopters who are already transforming their emotional well-being through VYBE LOOPROOMS™
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Button 
              className="btn-glow group px-12 py-6 text-lg"
              onClick={() => window.location.href = '/waitlist'}
            >
              Start Your Journey
              <ArrowRight className="ml-3 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            
            <div className="flex items-center space-x-4 text-foreground/60">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm">10,000+ waiting</span>
              </div>
              <div className="text-vybe-cyan">•</div>
              <div className="text-sm">No payment required</div>
            </div>
          </div>
          
          {/* Trust indicators */}
          <div className="flex justify-center space-x-8 mt-8 text-xs text-foreground/50">
            <span>✓ Privacy focused</span>
            <span>✓ Science-backed</span>
            <span>✓ Community-driven</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;