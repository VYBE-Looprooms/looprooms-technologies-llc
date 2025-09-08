import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ArrowRight, Heart, Zap, Globe, Target, Users, Sparkles, CheckCircle, Star, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import useGSAP from "@/hooks/useGSAP";

const About = () => {
  // Initialize GSAP animations
  useGSAP();

  return (
    <div className="min-h-screen">
      <Navbar />
      
      {/* Hero Section */}
      <section className="section-padding pt-32 particles section-bg-primary section-separator">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-8 fade-in">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-vybe-cyan/20 to-vybe-purple/20 border border-vybe-cyan/30 mb-6">
              <Sparkles className="w-5 h-5 text-vybe-cyan mr-2" />
              <span className="text-sm font-medium text-gradient">Revolutionary Emotional Technology</span>
            </div>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight slide-in-left">
            <span className="text-gradient">About VYBE</span>
            <br />
            <span className="text-gradient-reverse">LOOPROOMS™</span>
          </h1>
          <p className="text-xl md:text-2xl text-foreground/80 mb-12 leading-relaxed max-w-3xl mx-auto fade-in">
            The world's first emotional tech ecosystem designed to foster 
            <span className="text-gradient font-semibold"> positivity, connection, and growth</span> 
            through innovative digital experiences.
          </p>
          <div className="grid grid-cols-3 gap-8 max-w-xl mx-auto stagger-in">
            <div className="text-center">
              <div className="text-3xl font-bold text-gradient mb-2 counter" data-target="10000">0</div>
              <div className="text-sm text-foreground/60">Early Adopters</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-gradient mb-2 counter" data-target="5">0</div>
              <div className="text-sm text-foreground/60">Looproom Categories</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-gradient mb-2">2025</div>
              <div className="text-sm text-foreground/60">Launch Year</div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="section-padding section-bg-secondary section-separator">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="slide-in-left">
              <div className="mb-6">
                <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-vybe-purple/20 to-vybe-pink/20 border border-vybe-purple/30 mb-4">
                  <Target className="w-5 h-5 text-vybe-purple mr-2" />
                  <span className="text-sm font-medium text-gradient-reverse">Our Purpose</span>
                </div>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gradient">
                Our Mission
              </h2>
              <p className="text-lg text-foreground/70 mb-6 leading-relaxed">
                VYBE LOOPROOMS™ reimagines how we connect, grow, and thrive in the digital age. 
                We believe that technology should enhance human emotion and connection, not replace it.
              </p>
              <p className="text-lg text-foreground/70 mb-8 leading-relaxed">
                Through our innovative Loopchain™ technology, we create immersive experiences 
                that guide users on transformative journeys across recovery, fitness, meditation, 
                music, and beyond.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button className="btn-glow" onClick={() => window.location.href = '/waitlist'}>
                  Join Our Mission <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
                <Button variant="outline" className="border-vybe-cyan/30 hover:border-vybe-cyan" onClick={() => window.location.href = '/contact'}>
                  Learn More
                </Button>
              </div>
            </div>
            <div className="vybe-card slide-in-right">
              <h3 className="text-2xl font-bold mb-6 text-gradient-reverse">Core Values</h3>
              <div className="space-y-6 stagger-in">
                <div className="flex items-start space-x-4">
                  <Heart className="w-8 h-8 text-vybe-pink mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="text-xl font-bold mb-2">Emotional Connection</h4>
                    <p className="text-foreground/70">Building authentic relationships through shared experiences and meaningful growth journeys.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <Zap className="w-8 h-8 text-vybe-cyan mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="text-xl font-bold mb-2">Innovative Technology</h4>
                    <p className="text-foreground/70">Pioneering Loopchain™ technology for seamless, guided user journeys and personalized experiences.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <Globe className="w-8 h-8 text-vybe-purple mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="text-xl font-bold mb-2">Global Impact</h4>
                    <p className="text-foreground/70">Creating positive change across communities worldwide through accessible emotional technology.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Vision Section */}
      <section className="section-padding section-bg-tertiary section-separator">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 fade-in">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-vybe-cyan/20 to-vybe-blue/20 border border-vybe-cyan/30 mb-6">
              <Star className="w-5 h-5 text-vybe-cyan mr-2" />
              <span className="text-sm font-medium text-gradient">Future of Emotional Tech</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-8 text-gradient-reverse slide-in-left">
              Our Vision
            </h2>
            <p className="text-xl text-foreground/80 mb-12 leading-relaxed max-w-4xl mx-auto">
              A world where technology serves as a bridge to deeper human connection, 
              where every digital interaction contributes to personal growth, healing, 
              and collective wellbeing.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Heart,
                title: "Recovery & Healing",
                description: "Supporting individuals on their journey to mental and emotional wellness through guided experiences and community support.",
                color: "text-vybe-pink"
              },
              {
                icon: TrendingUp,
                title: "Fitness & Vitality", 
                description: "Encouraging physical wellbeing through engaging, community-driven fitness experiences that connect body and mind.",
                color: "text-vybe-cyan"
              },
              {
                icon: Sparkles,
                title: "Mindfulness & Growth",
                description: "Fostering personal development through meditation, music, and transformative practices for lifelong learning.",
                color: "text-vybe-purple"
              }
            ].map((item, index) => (
              <div key={index} className="vybe-card text-center group hover:scale-105 transition-transform duration-300">
                <div className="mb-6">
                  <div className={`w-16 h-16 mx-auto rounded-full bg-gradient-to-r from-secondary to-card flex items-center justify-center border border-vybe-cyan/20 group-hover:border-vybe-cyan/40 transition-colors`}>
                    <item.icon className={`w-8 h-8 ${item.color}`} />
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-4 text-gradient">{item.title}</h3>
                <p className="text-foreground/70 leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team/Company Section */}
      <section className="section-padding section-bg-primary section-separator">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-vybe-purple/20 to-vybe-pink/20 border border-vybe-purple/30 mb-6">
              <Users className="w-5 h-5 text-vybe-purple mr-2" />
              <span className="text-sm font-medium text-gradient-reverse">Built by Experts</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-8 text-gradient">
              Who We Are
            </h2>
            <p className="text-xl text-foreground/80 mb-12 leading-relaxed max-w-4xl mx-auto">
              A passionate team of technologists, therapists, fitness experts, and mindfulness practitioners 
              united by the vision of creating meaningful digital experiences that transform lives.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                stat: "500+",
                label: "Wellness Experts",
                description: "Therapists and coaches"
              },
              {
                stat: "50+",
                label: "Tech Innovators", 
                description: "Engineers and designers"
              },
              {
                stat: "10+",
                label: "Years Experience",
                description: "In emotional technology"
              },
              {
                stat: "98%",
                label: "User Satisfaction",
                description: "From beta testing"
              }
            ].map((item, index) => (
              <div key={index} className="text-center">
                <div className="vybe-card hover:scale-105 transition-transform duration-300">
                  <div className="text-3xl font-bold text-gradient mb-2">{item.stat}</div>
                  <div className="text-lg font-semibold mb-2">{item.label}</div>
                  <div className="text-sm text-foreground/60">{item.description}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding section-bg-secondary section-separator">
        <div className="max-w-4xl mx-auto text-center">
          <div className="vybe-card">
            <div className="mb-8">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-r from-vybe-cyan to-vybe-purple flex items-center justify-center">
                <CheckCircle className="w-10 h-10 text-background" />
              </div>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gradient">
              Ready to Join the Revolution?
            </h2>
            <p className="text-lg text-foreground/70 mb-8 leading-relaxed">
              Be part of the world's first emotional tech ecosystem. 
              Together, we're building a more connected, compassionate digital future 
              that prioritizes human wellbeing and authentic connection.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="btn-glow" onClick={() => window.location.href = '/waitlist'}>
                Join Waitlist
              </Button>
              <Button variant="outline" className="border-vybe-cyan/30 hover:border-vybe-cyan" onClick={() => window.location.href = '/contact'}>
                Get in Touch
              </Button>
            </div>
            <div className="mt-8 pt-8 border-t border-vybe-cyan/20">
              <div className="flex flex-col sm:flex-row items-center justify-center gap-8 text-sm text-foreground/60">
                <div className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  No payment required
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  Early access guaranteed
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  Privacy focused
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;