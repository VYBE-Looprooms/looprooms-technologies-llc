import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Mail, MessageSquare, Users, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const Contact = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      
      {/* Hero Section */}
      <section className="section-padding pt-32 particles">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            <span className="text-gradient">Get in Touch</span>
          </h1>
          <p className="text-xl md:text-2xl text-foreground/80 mb-12 leading-relaxed">
            Ready to join the emotional tech revolution? We'd love to hear from you.
          </p>
        </div>
      </section>

      {/* Contact Options */}
      <section className="section-padding">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16">
            
            {/* Contact Form */}
            <div className="vybe-card">
              <h2 className="text-3xl font-bold mb-6 text-gradient">Send us a Message</h2>
              <form className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium mb-2">
                      First Name
                    </label>
                    <Input 
                      id="firstName"
                      placeholder="Your first name"
                      className="bg-card/50 border-vybe-cyan/30 focus:border-vybe-cyan"
                    />
                  </div>
                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium mb-2">
                      Last Name
                    </label>
                    <Input 
                      id="lastName"
                      placeholder="Your last name"
                      className="bg-card/50 border-vybe-cyan/30 focus:border-vybe-cyan"
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-2">
                    Email Address
                  </label>
                  <Input 
                    id="email"
                    type="email"
                    placeholder="your@email.com"
                    className="bg-card/50 border-vybe-cyan/30 focus:border-vybe-cyan"
                  />
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium mb-2">
                    Subject
                  </label>
                  <Input 
                    id="subject"
                    placeholder="What's this about?"
                    className="bg-card/50 border-vybe-cyan/30 focus:border-vybe-cyan"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium mb-2">
                    Message
                  </label>
                  <Textarea 
                    id="message"
                    placeholder="Tell us about your interest in VYBE LOOPROOMS™..."
                    rows={6}
                    className="bg-card/50 border-vybe-cyan/30 focus:border-vybe-cyan resize-none"
                  />
                </div>

                <Button className="btn-glow w-full">
                  Send Message <MessageSquare className="ml-2 w-5 h-5" />
                </Button>
              </form>
            </div>

            {/* Contact Info */}
            <div className="space-y-8">
              <div>
                <h2 className="text-3xl font-bold mb-6 text-gradient-reverse">
                  Connect With Us
                </h2>
                <p className="text-lg text-foreground/70 mb-8 leading-relaxed">
                  Whether you're interested in joining our waitlist, becoming a creator, 
                  or partnering with us, we're here to help you become part of the 
                  emotional tech ecosystem.
                </p>
              </div>

              <div className="space-y-6">
                <div className="vybe-card">
                  <div className="flex items-start space-x-4">
                    <Mail className="w-6 h-6 text-vybe-cyan mt-1" />
                    <div>
                      <h3 className="text-xl font-bold mb-2">General Inquiries</h3>
                      <p className="text-foreground/70 mb-2">
                        Questions about VYBE LOOPROOMS™? We're here to help.
                      </p>
                      <a href="mailto:hello@vybelooprooms.com" className="text-vybe-cyan hover:text-vybe-blue transition-colors">
                        hello@vybelooprooms.com
                      </a>
                    </div>
                  </div>
                </div>

                <div className="vybe-card">
                  <div className="flex items-start space-x-4">
                    <Users className="w-6 h-6 text-vybe-purple mt-1" />
                    <div>
                      <h3 className="text-xl font-bold mb-2">Creator Applications</h3>
                      <p className="text-foreground/70 mb-2">
                        Ready to monetize your expertise? Join our creator program.
                      </p>
                      <a href="mailto:creators@vybelooprooms.com" className="text-vybe-purple hover:text-vybe-pink transition-colors">
                        creators@vybelooprooms.com
                      </a>
                    </div>
                  </div>
                </div>

                <div className="vybe-card">
                  <div className="flex items-start space-x-4">
                    <Zap className="w-6 h-6 text-vybe-pink mt-1" />
                    <div>
                      <h3 className="text-xl font-bold mb-2">Partnerships</h3>
                      <p className="text-foreground/70 mb-2">
                        Interested in collaborating? Let's build the future together.
                      </p>
                      <a href="mailto:partnerships@vybelooprooms.com" className="text-vybe-pink hover:text-vybe-cyan transition-colors">
                        partnerships@vybelooprooms.com
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              <div className="vybe-card text-center">
                <h3 className="text-xl font-bold mb-4 text-gradient">
                  Join Our Waitlist
                </h3>
                <p className="text-foreground/70 mb-6">
                  Be the first to experience VYBE LOOPROOMS™ when we launch.
                </p>
                <Button className="btn-glow" onClick={() => window.location.href = '/waitlist'}>
                  Join Waitlist
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Contact;