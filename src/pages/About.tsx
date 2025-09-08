import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ArrowRight, Heart, Zap, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";

const About = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      
      {/* Hero Section */}
      <section className="section-padding pt-32 particles">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            <span className="text-gradient">About VYBE</span>
            <br />
            LOOPROOMS™
          </h1>
          <p className="text-xl md:text-2xl text-foreground/80 mb-8 leading-relaxed">
            The world's first emotional tech ecosystem designed to foster 
            <span className="text-gradient font-semibold"> positivity, connection, and growth</span>.
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="section-padding">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
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
              <Button className="btn-glow" onClick={() => window.location.href = '/waitlist'}>
                Join Our Mission <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </div>
            <div className="vybe-card">
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <Heart className="w-8 h-8 text-vybe-pink mt-1" />
                  <div>
                    <h3 className="text-xl font-bold mb-2">Emotional Connection</h3>
                    <p className="text-foreground/70">Building authentic relationships through shared experiences and growth.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <Zap className="w-8 h-8 text-vybe-cyan mt-1" />
                  <div>
                    <h3 className="text-xl font-bold mb-2">Innovative Technology</h3>
                    <p className="text-foreground/70">Pioneering Loopchain™ technology for seamless, guided user journeys.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <Globe className="w-8 h-8 text-vybe-purple mt-1" />
                  <div>
                    <h3 className="text-xl font-bold mb-2">Global Impact</h3>
                    <p className="text-foreground/70">Creating positive change across communities worldwide.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Vision Section */}
      <section className="section-padding bg-gradient-to-r from-secondary/30 to-background">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-8 text-gradient-reverse">
            Our Vision
          </h2>
          <p className="text-xl text-foreground/80 mb-12 leading-relaxed">
            A world where technology serves as a bridge to deeper human connection, 
            where every digital interaction contributes to personal growth, healing, 
            and collective wellbeing.
          </p>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Recovery & Healing",
                description: "Supporting individuals on their journey to mental and emotional wellness through guided experiences."
              },
              {
                title: "Fitness & Vitality", 
                description: "Encouraging physical wellbeing through engaging, community-driven fitness experiences."
              },
              {
                title: "Mindfulness & Growth",
                description: "Fostering personal development through meditation, music, and transformative practices."
              }
            ].map((item, index) => (
              <div key={index} className="vybe-card text-center">
                <h3 className="text-xl font-bold mb-4 text-gradient">{item.title}</h3>
                <p className="text-foreground/70">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding">
        <div className="max-w-4xl mx-auto text-center vybe-card">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gradient">
            Ready to Join the Revolution?
          </h2>
          <p className="text-lg text-foreground/70 mb-8">
            Be part of the world's first emotional tech ecosystem. 
            Together, we're building a more connected, compassionate digital future.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button className="btn-glow" onClick={() => window.location.href = '/waitlist'}>
              Join Waitlist
            </Button>
            <Button variant="outline" className="border-vybe-cyan/30 hover:border-vybe-cyan" onClick={() => window.location.href = '/contact'}>
              Get in Touch
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;