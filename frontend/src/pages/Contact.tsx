import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Mail, MessageSquare, Users, Zap, Send, Phone, MapPin, Clock, CheckCircle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState, useEffect } from "react";
import useGSAP from "@/hooks/useGSAP";

const Contact = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    subject: "",
    message: ""
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Initialize GSAP animations
  useGSAP();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.email && formData.message) {
      setIsSubmitted(true);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value
    });
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      
      {/* Hero Section */}
      <section className="section-padding pt-32 particles section-bg-primary section-separator">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-8 fade-in">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-vybe-cyan/20 to-vybe-purple/20 border border-vybe-cyan/30 mb-6">
              <MessageSquare className="w-5 h-5 text-vybe-cyan mr-2" />
              <span className="text-sm font-medium text-gradient">Let's Connect</span>
            </div>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight slide-in-left">
            <span className="text-gradient">Get in Touch</span>
          </h1>
          <p className="text-xl md:text-2xl text-foreground/80 mb-12 leading-relaxed max-w-3xl mx-auto fade-in">
            Ready to join the emotional tech revolution? We'd love to hear from you 
            and explore how we can work together to transform digital wellbeing.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-2xl mx-auto stagger-in">
            <div className="flex items-center justify-center space-x-2 text-sm text-foreground/60">
              <Clock className="w-4 h-4 text-vybe-cyan" />
              <span>24h response time</span>
            </div>
            <div className="flex items-center justify-center space-x-2 text-sm text-foreground/60">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span>Personal attention</span>
            </div>
            <div className="flex items-center justify-center space-x-2 text-sm text-foreground/60">
              <MapPin className="w-4 h-4 text-vybe-purple" />
              <span>Global support</span>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Options */}
      <section className="section-padding section-bg-secondary section-separator">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16">
            
            {/* Contact Form */}
            <div className="vybe-card slide-in-left">
              {!isSubmitted ? (
                <>
                  <div className="mb-8">
                    <div className="flex items-center mb-4">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-r from-vybe-cyan to-vybe-purple flex items-center justify-center mr-4">
                        <Send className="w-5 h-5 text-background" />
                      </div>
                      <h2 className="text-3xl font-bold text-gradient">Send us a Message</h2>
                    </div>
                    <p className="text-foreground/70">
                      Have questions about VYBE LOOPROOMS™? Want to become a creator? 
                      We're here to help you join the emotional tech revolution.
                    </p>
                  </div>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="firstName" className="block text-sm font-medium mb-2">
                          First Name *
                        </label>
                        <Input 
                          id="firstName"
                          placeholder="Your first name"
                          value={formData.firstName}
                          onChange={handleChange}
                          className="bg-card/50 border-vybe-cyan/30 focus:border-vybe-cyan transition-colors"
                          required
                        />
                      </div>
                      <div>
                        <label htmlFor="lastName" className="block text-sm font-medium mb-2">
                          Last Name *
                        </label>
                        <Input 
                          id="lastName"
                          placeholder="Your last name"
                          value={formData.lastName}
                          onChange={handleChange}
                          className="bg-card/50 border-vybe-cyan/30 focus:border-vybe-cyan transition-colors"
                          required
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium mb-2">
                        Email Address *
                      </label>
                      <Input 
                        id="email"
                        type="email"
                        placeholder="your@email.com"
                        value={formData.email}
                        onChange={handleChange}
                        className="bg-card/50 border-vybe-cyan/30 focus:border-vybe-cyan transition-colors"
                        required
                      />
                    </div>

                    <div>
                      <label htmlFor="subject" className="block text-sm font-medium mb-2">
                        Subject *
                      </label>
                      <Input 
                        id="subject"
                        placeholder="What's this about?"
                        value={formData.subject}
                        onChange={handleChange}
                        className="bg-card/50 border-vybe-cyan/30 focus:border-vybe-cyan transition-colors"
                        required
                      />
                    </div>

                    <div>
                      <label htmlFor="message" className="block text-sm font-medium mb-2">
                        Message *
                      </label>
                      <Textarea 
                        id="message"
                        placeholder="Tell us about your interest in VYBE LOOPROOMS™..."
                        rows={6}
                        value={formData.message}
                        onChange={handleChange}
                        className="bg-card/50 border-vybe-cyan/30 focus:border-vybe-cyan resize-none transition-colors"
                        required
                      />
                    </div>

                    <div className="!mb-0">
                      <Button type="submit" className="btn-glow w-full">
                        Send Message <MessageSquare className="ml-2 w-5 h-5" />
                      </Button>
                    </div>
                  </form>
                </>
              ) : (
                <div className="text-center py-8 scale-in">
                  <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-r from-green-500 to-vybe-cyan flex items-center justify-center">
                    <CheckCircle className="w-10 h-10 text-background" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-gradient">Message Sent!</h3>
                  <p className="text-foreground/70 mb-6">
                    Thank you for reaching out. We'll get back to you within 24 hours.
                  </p>
                  <Button 
                    onClick={() => setIsSubmitted(false)}
                    variant="outline" 
                    className="border-vybe-cyan/30 hover:border-vybe-cyan"
                  >
                    Send Another Message
                  </Button>
                </div>
              )}
            </div>

            {/* Contact Info */}
            <div className="space-y-8 slide-in-right">
              <div>
                <div className="mb-6">
                  <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-vybe-purple/20 to-vybe-pink/20 border border-vybe-purple/30 mb-4">
                    <Users className="w-5 h-5 text-vybe-purple mr-2" />
                    <span className="text-sm font-medium text-gradient-reverse">Multiple Ways to Connect</span>
                  </div>
                </div>
                <h2 className="text-3xl font-bold mb-6 text-gradient-reverse">
                  Connect With Us
                </h2>
                <p className="text-lg text-foreground/70 mb-8 leading-relaxed">
                  Whether you're interested in becoming a creator, partnering with us, 
                  or have questions about our platform, we're here to help you become part of the 
                  emotional tech ecosystem.
                </p>
              </div>

              <div className="space-y-6 stagger-in">
                <div className="vybe-card group hover:scale-105 transition-transform duration-300">
                  <div className="flex items-start space-x-4">
                    <Mail className="w-6 h-6 text-vybe-cyan mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="text-xl font-bold mb-2 group-hover:text-gradient transition-colors">General Inquiries</h3>
                      <p className="text-foreground/70 mb-3">
                        Questions about VYBE LOOPROOMS™? We're here to help with any questions about our platform.
                      </p>
                      <a 
                        href="mailto:technical@feelyourvybe.com" 
                        className="text-vybe-cyan hover:text-vybe-blue transition-colors font-medium inline-flex items-center"
                      >
                        technical@feelyourvybe.com
                        <ArrowRight className="w-4 h-4 ml-1" />
                      </a>
                    </div>
                  </div>
                </div>

                <div className="vybe-card group hover:scale-105 transition-transform duration-300">
                  <div className="flex items-start space-x-4">
                    <Users className="w-6 h-6 text-vybe-purple mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="text-xl font-bold mb-2 group-hover:text-gradient transition-colors">Creator Applications</h3>
                      <p className="text-foreground/70 mb-3">
                        Ready to monetize your expertise? Join our creator program and build your emotional tech empire.
                      </p>
                      <a 
                        href="mailto:technical@feelyourvybe.com" 
                        className="text-vybe-purple hover:text-vybe-pink transition-colors font-medium inline-flex items-center"
                      >
                        technical@feelyourvybe.com
                        <ArrowRight className="w-4 h-4 ml-1" />
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              <div className="vybe-card text-center border-glow fade-in">
                <h3 className="text-xl font-bold mb-4 text-gradient">
                  Get Started Today
                </h3>
                <p className="text-foreground/70 mb-6">
                  Ready to start creating with VYBE LOOPROOMS™? 
                  Join our community and begin your emotional tech journey.
                </p>
                <Button className="btn-glow" onClick={() => window.location.href = '/register'}>
                  Sign Up Free
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Response Time Section */}
      <section className="section-padding section-bg-tertiary">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-8 text-gradient fade-in">
            What to Expect
          </h2>
          <div className="grid md:grid-cols-3 gap-8 stagger-in">
            <div className="vybe-card text-center">
              <Clock className="w-12 h-12 text-vybe-cyan mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-4 text-gradient">Fast Response</h3>
              <p className="text-foreground/70">
                We respond to all inquiries within 24 hours, usually much faster during business hours.
              </p>
            </div>

            <div className="vybe-card text-center">
              <MessageSquare className="w-12 h-12 text-vybe-purple mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-4 text-gradient">Personal Touch</h3>
              <p className="text-foreground/70">
                Every message is read and responded to personally by our team, not automated systems.
              </p>
            </div>

            <div className="vybe-card text-center">
              <CheckCircle className="w-12 h-12 text-vybe-pink mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-4 text-gradient">Follow Through</h3>
              <p className="text-foreground/70">
                We follow up to ensure your questions are answered and you get the help you need.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Contact;