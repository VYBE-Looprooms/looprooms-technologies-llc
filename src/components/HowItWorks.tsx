import { Search, Users, Link } from "lucide-react";

const HowItWorks = () => {
  const steps = [
    {
      icon: Search,
      title: "Choose a Looproom",
      description: "Select from Recovery, Fitness, Meditation, Music, and more specialized experiences tailored to your emotional needs."
    },
    {
      icon: Users,
      title: "Engage & Interact",
      description: "Connect with like-minded individuals, participate in guided sessions, and build meaningful relationships in your chosen space."
    },
    {
      icon: Link,
      title: "Follow a Loopchain",
      description: "Experience interconnected journeys that guide your emotional growth through personalized pathways and shared experiences."
    }
  ];

  return (
    <section id="how-it-works" className="section-padding bg-gradient-to-b from-background to-background/50">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-20">
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
            <span className="text-gradient">How It Works</span>
          </h2>
          <p className="text-xl text-foreground/70 max-w-3xl mx-auto">
            Experience emotional technology through three simple steps that transform how you connect, grow, and thrive.
          </p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
          {steps.map((step, index) => (
            <div key={index} className="relative group">
              {/* Connection line for desktop */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-16 left-full w-full h-0.5 bg-gradient-to-r from-vybe-cyan/50 to-vybe-purple/50 transform translate-x-6 z-0">
                  <div className="absolute right-0 top-1/2 transform -translate-y-1/2">
                    <div className="w-3 h-3 bg-vybe-purple rounded-full"></div>
                  </div>
                </div>
              )}

              {/* Step Card */}
              <div className="vybe-card text-center transition-all duration-500 group-hover:scale-105 relative z-10">
                {/* Step Number */}
                <div className="absolute -top-4 -left-4 w-8 h-8 bg-gradient-to-br from-vybe-cyan to-vybe-purple rounded-full flex items-center justify-center text-sm font-bold text-background">
                  {index + 1}
                </div>

                {/* Icon */}
                <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-vybe-cyan/20 to-vybe-purple/20 flex items-center justify-center group-hover:animate-glow">
                  <step.icon className="w-10 h-10 text-vybe-cyan" />
                </div>

                {/* Content */}
                <h3 className="text-2xl font-bold mb-4 text-gradient-reverse">
                  {step.title}
                </h3>
                <p className="text-foreground/70 leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <div className="inline-flex items-center space-x-2 text-vybe-cyan font-medium">
            <span>Ready to start your journey?</span>
            <div className="w-2 h-2 bg-vybe-cyan rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;