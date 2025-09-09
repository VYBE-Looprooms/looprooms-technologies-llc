import { Star, Quote, ThumbsUp, Heart } from "lucide-react";

const Testimonials = () => {
  const testimonials = [
    {
      name: "Dr. Sarah Chen",
      role: "Clinical Psychologist",
      avatar: "SC",
      rating: 5,
      text: "VYBE LOOPROOMS™ represents the future of emotional technology. The interconnected approach to healing and growth is revolutionary.",
      color: "vybe-cyan",
      category: "Recovery"
    },
    {
      name: "Marcus Rodriguez",
      role: "Fitness Coach & Wellness Expert",
      avatar: "MR",
      rating: 5,
      text: "I've never seen anything like the Loopchain technology. It's transforming how we approach holistic fitness and emotional well-being.",
      color: "vybe-purple",
      category: "Fitness"
    },
    {
      name: "Zen Master Akira",
      role: "Meditation Guide",
      avatar: "ZA",
      rating: 5,
      text: "The depth of connection possible through VYBE's ecosystem goes beyond traditional meditation platforms. Truly groundbreaking.",
      color: "vybe-pink",
      category: "Meditation"
    }
  ];

  const stats = [
    { icon: ThumbsUp, value: "98%", label: "User Satisfaction", color: "text-vybe-cyan" },
    { icon: Heart, value: "50K+", label: "Lives Impacted", color: "text-vybe-purple" },
    { icon: Star, value: "4.9", label: "Average Rating", color: "text-vybe-pink" }
  ];

  return (
    <section className="section-padding section-bg-tertiary section-separator relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-vybe-cyan/5 rounded-full blur-3xl animate-float"></div>
      <div className="absolute bottom-1/4 left-1/4 w-64 h-64 bg-vybe-purple/5 rounded-full blur-3xl animate-float" style={{ animationDelay: '3s' }}></div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 bg-card/50 backdrop-blur-sm border border-vybe-cyan/30 rounded-full px-6 py-3 mb-6">
            <Quote className="w-5 h-5 text-vybe-cyan" />
            <span className="text-sm font-medium">Early Feedback</span>
          </div>
          
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
            <span className="text-gradient">What Experts Are Saying</span>
          </h2>
          <p className="text-xl text-foreground/70 max-w-3xl mx-auto">
            Leading professionals in wellness, therapy, and mindfulness are already experiencing the transformative power of VYBE LOOPROOMS™
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="group h-full">
              <div className="vybe-card h-full hover:scale-105 transition-all duration-500 relative overflow-hidden flex flex-col">
                {/* Category Badge */}
                <div className={`absolute top-4 right-4 bg-${testimonial.color}/20 text-${testimonial.color} text-xs font-bold px-3 py-1 rounded-full border border-${testimonial.color}/30`}>
                  {testimonial.category}
                </div>

                {/* Quote Icon */}
                <div className="mb-6">
                  <Quote className={`w-8 h-8 text-${testimonial.color} opacity-50`} />
                </div>

                {/* Rating */}
                <div className="flex space-x-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className={`w-4 h-4 text-${testimonial.color} fill-current`} />
                  ))}
                </div>

                {/* Testimonial Text - Flex grow to fill space */}
                <div className="flex-grow flex items-center mb-6">
                  <p className="text-foreground/80 leading-relaxed italic">
                    "{testimonial.text}"
                  </p>
                </div>

                {/* Author - Fixed at bottom */}
                <div className="flex items-center space-x-4 mt-auto">
                  <div className={`w-12 h-12 bg-gradient-to-br from-${testimonial.color}/30 to-vybe-purple/30 rounded-full flex items-center justify-center font-bold text-${testimonial.color}`}>
                    {testimonial.avatar}
                  </div>
                  <div>
                    <div className="font-semibold text-foreground">{testimonial.name}</div>
                    <div className="text-sm text-foreground/60">{testimonial.role}</div>
                  </div>
                </div>

                {/* Hover Effect */}
                <div className={`absolute inset-0 bg-gradient-to-br from-${testimonial.color}/0 to-${testimonial.color}/0 group-hover:from-${testimonial.color}/5 group-hover:to-${testimonial.color}/5 transition-all duration-500 -z-10 rounded-2xl`}></div>
              </div>
            </div>
          ))}
        </div>

        {/* Stats Section */}
        <div className="bg-gradient-to-r from-vybe-cyan/10 via-vybe-purple/10 to-vybe-pink/10 rounded-3xl p-8 backdrop-blur-sm border border-vybe-cyan/20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center group cursor-pointer">
                <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-${stat.color.split('-')[1]}/20 to-vybe-purple/20 flex items-center justify-center group-hover:animate-glow transition-all duration-300`}>
                  <stat.icon className={`w-8 h-8 ${stat.color}`} />
                </div>
                <div className="text-3xl font-bold text-gradient mb-2 group-hover:scale-110 transition-transform">
                  {stat.value}
                </div>
                <div className="text-foreground/70 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="text-center mt-12">
          <p className="text-foreground/60 mb-4">Trusted by wellness professionals worldwide</p>
          <div className="flex justify-center space-x-8 text-foreground/40">
            <span className="text-sm">✓ HIPAA Compliant</span>
            <span className="text-sm">✓ Evidence-Based</span>
            <span className="text-sm">✓ Peer Reviewed</span>
            <span className="text-sm">✓ Ethically Designed</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
