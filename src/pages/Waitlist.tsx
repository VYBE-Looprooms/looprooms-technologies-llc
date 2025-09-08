import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { CheckCircle, Star, Users, Zap, Gift, Crown, Sparkles, Calendar, ArrowRight, Mail, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";

const Waitlist = () => {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setIsSubmitted(true);
    }
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      
      {/* Hero Section */}
      <section className="section-padding pt-32 particles section-bg-primary section-separator">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-8">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-vybe-cyan/20 to-vybe-purple/20 border border-vybe-cyan/30 mb-6">
              <Crown className="w-5 h-5 text-vybe-cyan mr-2" />
              <span className="text-sm font-medium text-gradient">Exclusive Early Access</span>
            </div>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            <span className="text-gradient">Join the</span>
            <br />
            <span className="text-gradient-reverse">Revolution</span>
          </h1>
          <p className="text-xl md:text-2xl text-foreground/80 mb-12 leading-relaxed max-w-3xl mx-auto">
            Be among the first to experience VYBE LOOPROOMS™ – 
            The World's First Emotional Tech Ecosystem that's transforming digital wellbeing.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-2xl mx-auto">
            <div className="flex items-center justify-center space-x-2 text-sm text-foreground/60">
              <Users className="w-4 h-4 text-vybe-cyan" />
              <span>10,000+ waiting</span>
            </div>
            <div className="flex items-center justify-center space-x-2 text-sm text-foreground/60">
              <Calendar className="w-4 h-4 text-green-500" />
              <span>Q1 2025 launch</span>
            </div>
            <div className="flex items-center justify-center space-x-2 text-sm text-foreground/60">
              <Crown className="w-4 h-4 text-vybe-purple" />
              <span>Founding member perks</span>
            </div>
          </div>
        </div>
      </section>

      {/* Waitlist Form */}
      <section className="section-padding section-bg-secondary section-separator">
        <div className="max-w-2xl mx-auto">
          {!isSubmitted ? (
            <div className="vybe-card text-center border-glow">
              <div className="mb-8">
                <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-r from-vybe-cyan to-vybe-purple flex items-center justify-center animate-pulse-slow">
                  <Star className="w-10 h-10 text-background" />
                </div>
                <h2 className="text-3xl font-bold mb-4 text-gradient">
                  Join Our Exclusive Waitlist
                </h2>
                <p className="text-lg text-foreground/70 mb-8 leading-relaxed">
                  Get early access to VYBE LOOPROOMS™ and be part of shaping the future 
                  of emotional technology. Plus, receive exclusive founding member benefits!
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-vybe-cyan/60" />
                  <Input 
                    type="email"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-card/50 border-vybe-cyan/30 focus:border-vybe-cyan text-center text-lg py-4 pl-12 transition-colors"
                    required
                  />
                </div>
                <Button type="submit" className="btn-glow w-full text-lg py-4">
                  Secure My Spot <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </form>

              <div className="mt-8 pt-8 border-t border-vybe-cyan/20">
                <div className="flex flex-col sm:flex-row items-center justify-center gap-6 text-sm text-foreground/60">
                  <div className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    No payment required
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    Unsubscribe anytime
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    Privacy protected
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="vybe-card text-center border-glow">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-r from-green-500 to-vybe-cyan flex items-center justify-center animate-bounce-slow">
                <CheckCircle className="w-10 h-10 text-background" />
              </div>
              <h2 className="text-3xl font-bold mb-4 text-gradient">
                Welcome to the Future!
              </h2>
              <p className="text-lg text-foreground/70 mb-8 leading-relaxed">
                Thank you for joining our waitlist! You're now part of an exclusive community 
                of early adopters who will shape the future of emotional technology.
              </p>
              <div className="bg-secondary/30 rounded-lg p-6 mb-8">
                <h3 className="text-xl font-bold mb-4 text-gradient-reverse">What's Next?</h3>
                <ul className="text-left space-y-3 text-foreground/70">
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                    <span>Exclusive updates on our development progress and behind-the-scenes content</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                    <span>Early access invitation when we're ready to launch in Q1 2025</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                    <span>Special founding member benefits and exclusive features</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                    <span>Priority access to our creator program and partnership opportunities</span>
                  </li>
                </ul>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button className="btn-glow flex-1" onClick={() => window.location.href = '/about'}>
                  Learn More About VYBE
                </Button>
                <Button variant="outline" className="border-vybe-cyan/30 hover:border-vybe-cyan flex-1" onClick={() => window.location.href = '/'}>
                  Back to Home
                </Button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Benefits Section */}
      <section className="section-padding section-bg-tertiary section-separator">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-vybe-purple/20 to-vybe-pink/20 border border-vybe-purple/30 mb-6">
              <Gift className="w-5 h-5 text-vybe-purple mr-2" />
              <span className="text-sm font-medium text-gradient-reverse">Exclusive Benefits</span>
            </div>
            <h2 className="text-4xl font-bold mb-8 text-gradient-reverse">
              Why Join Our Waitlist?
            </h2>
            <p className="text-xl text-foreground/80 mb-12 leading-relaxed max-w-3xl mx-auto">
              Become a founding member of the world's first emotional tech ecosystem 
              and enjoy exclusive benefits that regular users won't get.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="vybe-card text-center group hover:scale-105 transition-transform duration-300">
              <div className="mb-6">
                <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-r from-vybe-cyan/20 to-vybe-blue/20 flex items-center justify-center border border-vybe-cyan/30 group-hover:border-vybe-cyan/50 transition-colors">
                  <Users className="w-8 h-8 text-vybe-cyan" />
                </div>
              </div>
              <h3 className="text-xl font-bold mb-4 text-gradient">Early Access</h3>
              <p className="text-foreground/70 leading-relaxed">
                Be among the first to experience our revolutionary emotional tech ecosystem 
                before the public launch. Get exclusive preview access to all Looprooms.
              </p>
            </div>

            <div className="vybe-card text-center group hover:scale-105 transition-transform duration-300">
              <div className="mb-6">
                <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-r from-vybe-purple/20 to-vybe-pink/20 flex items-center justify-center border border-vybe-purple/30 group-hover:border-vybe-purple/50 transition-colors">
                  <Crown className="w-8 h-8 text-vybe-purple" />
                </div>
              </div>
              <h3 className="text-xl font-bold mb-4 text-gradient">Founding Member Benefits</h3>
              <p className="text-foreground/70 leading-relaxed">
                Enjoy exclusive features, special pricing, priority support, and a unique 
                founder badge that shows your role in building the future.
              </p>
            </div>

            <div className="vybe-card text-center group hover:scale-105 transition-transform duration-300">
              <div className="mb-6">
                <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-r from-vybe-pink/20 to-vybe-cyan/20 flex items-center justify-center border border-vybe-pink/30 group-hover:border-vybe-pink/50 transition-colors">
                  <Sparkles className="w-8 h-8 text-vybe-pink" />
                </div>
              </div>
              <h3 className="text-xl font-bold mb-4 text-gradient">Shape the Future</h3>
              <p className="text-foreground/70 leading-relaxed">
                Your feedback will directly influence our development, helping us create 
                the best possible emotional tech experience for millions of users.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="section-padding section-bg-primary section-separator">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-gradient">
            Join a Growing Community
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              {
                icon: Users,
                stat: "10,000+",
                label: "Waitlist Members",
                color: "text-vybe-cyan"
              },
              {
                icon: TrendingUp,
                stat: "500+",
                label: "Expert Creators",
                color: "text-vybe-purple"
              },
              {
                icon: Sparkles,
                stat: "5+",
                label: "Looproom Categories",
                color: "text-vybe-pink"
              },
              {
                icon: Calendar,
                stat: "Q1 2025",
                label: "Launch Target",
                color: "text-vybe-cyan"
              }
            ].map((item, index) => (
              <div key={index} className="text-center">
                <div className="vybe-card hover:scale-105 transition-transform duration-300">
                  <item.icon className={`w-8 h-8 ${item.color} mx-auto mb-3`} />
                  <div className="text-2xl font-bold text-gradient mb-1">{item.stat}</div>
                  <div className="text-sm text-foreground/60">{item.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding section-bg-secondary section-separator">
        <div className="max-w-4xl mx-auto text-center">
          <div className="vybe-card border-glow">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gradient">
              Ready to Transform Your Digital Wellbeing?
            </h2>
            <p className="text-lg text-foreground/70 mb-8 leading-relaxed">
              Don't miss out on being part of the emotional tech revolution. 
              Join thousands of early adopters who are already securing their spot 
              in the future of digital wellness.
            </p>
            {!isSubmitted && (
              <Button className="btn-glow" onClick={() => document.querySelector('form')?.scrollIntoView({ behavior: 'smooth' })}>
                Join Waitlist Now
              </Button>
            )}
            <div className="mt-8 pt-8 border-t border-vybe-cyan/20">
              <div className="flex flex-col sm:flex-row items-center justify-center gap-8 text-sm text-foreground/60">
                <div className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  Exclusive early access
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  Founding member benefits
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  Shape the future
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

export default Waitlist;