import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { CheckCircle, Star, Users, Zap } from "lucide-react";
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
      <section className="section-padding pt-32 particles">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            <span className="text-gradient">Join the</span>
            <br />
            <span className="text-gradient-reverse">Revolution</span>
          </h1>
          <p className="text-xl md:text-2xl text-foreground/80 mb-12 leading-relaxed">
            Be among the first to experience VYBE LOOPROOMS™ – 
            The World's First Emotional Tech Ecosystem.
          </p>
        </div>
      </section>

      {/* Waitlist Form */}
      <section className="section-padding">
        <div className="max-w-2xl mx-auto">
          {!isSubmitted ? (
            <div className="vybe-card text-center">
              <div className="mb-8">
                <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-r from-vybe-cyan to-vybe-purple flex items-center justify-center">
                  <Star className="w-10 h-10 text-background" />
                </div>
                <h2 className="text-3xl font-bold mb-4 text-gradient">
                  Join Our Exclusive Waitlist
                </h2>
                <p className="text-lg text-foreground/70 mb-8">
                  Get early access to VYBE LOOPROOMS™ and be part of shaping the future 
                  of emotional technology.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <Input 
                    type="email"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-card/50 border-vybe-cyan/30 focus:border-vybe-cyan text-center text-lg py-4"
                    required
                  />
                </div>
                <Button type="submit" className="btn-glow w-full text-lg py-4">
                  Secure My Spot
                </Button>
              </form>

              <div className="mt-8 pt-8 border-t border-vybe-cyan/20">
                <p className="text-sm text-foreground/60">
                  By joining our waitlist, you'll be the first to know when we launch 
                  and receive exclusive early access to our platform.
                </p>
              </div>
            </div>
          ) : (
            <div className="vybe-card text-center">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-r from-green-500 to-vybe-cyan flex items-center justify-center">
                <CheckCircle className="w-10 h-10 text-background" />
              </div>
              <h2 className="text-3xl font-bold mb-4 text-gradient">
                Welcome to the Future!
              </h2>
              <p className="text-lg text-foreground/70 mb-8">
                Thank you for joining our waitlist. You'll be among the first to experience 
                VYBE LOOPROOMS™ when we launch.
              </p>
              <div className="bg-secondary/30 rounded-lg p-6 mb-8">
                <h3 className="text-xl font-bold mb-4 text-gradient-reverse">What's Next?</h3>
                <ul className="text-left space-y-2 text-foreground/70">
                  <li>• You'll receive exclusive updates on our development progress</li>
                  <li>• Early access invitation when we're ready to launch</li>
                  <li>• Special founding member benefits and features</li>
                  <li>• Priority access to our creator program</li>
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
      <section className="section-padding bg-gradient-to-r from-secondary/30 to-background">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold mb-12 text-center text-gradient-reverse">
            Why Join Our Waitlist?
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="vybe-card text-center">
              <Users className="w-12 h-12 text-vybe-cyan mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-4 text-gradient">Early Access</h3>
              <p className="text-foreground/70">
                Be among the first to experience our revolutionary emotional tech ecosystem 
                before the public launch.
              </p>
            </div>

            <div className="vybe-card text-center">
              <Star className="w-12 h-12 text-vybe-purple mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-4 text-gradient">Founding Member Benefits</h3>
              <p className="text-foreground/70">
                Enjoy exclusive features, special pricing, and priority support as a 
                founding member of our community.
              </p>
            </div>

            <div className="vybe-card text-center">
              <Zap className="w-12 h-12 text-vybe-pink mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-4 text-gradient">Shape the Future</h3>
              <p className="text-foreground/70">
                Your feedback will directly influence our development, helping us create 
                the best possible emotional tech experience.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Waitlist;