import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Shield, Eye, Lock, FileText, Users, Mail, Clock, CheckCircle, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import useGSAP from "@/hooks/useGSAP";

const PrivacyPolicy = () => {
  // Initialize GSAP animations
  useGSAP();

  return (
    <div className="min-h-screen">
      <Navbar />
      
      {/* Hero Section */}
      <section className="section-padding pt-32 particles section-bg-primary section-separator">
        <div className="max-w-4xl mx-auto text-center">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-r from-vybe-cyan to-vybe-purple flex items-center justify-center scale-in">
            <Shield className="w-10 h-10 text-background" />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 slide-in-left">
            <span className="text-gradient">Privacy Policy</span>
          </h1>
          <p className="text-xl text-foreground/80 mb-8 leading-relaxed fade-in">
            Your privacy is fundamental to everything we do at VYBE LOOPROOMS™.
            We believe transparency builds trust.
          </p>
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-green-500/20 to-vybe-cyan/20 border border-green-500/30 fade-in">
            <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
            <span className="text-sm text-foreground/60">
              Last updated: {new Date().toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </span>
          </div>
        </div>
      </section>

      {/* Quick Summary */}
      <section className="section-padding section-bg-secondary section-separator">
        <div className="max-w-4xl mx-auto">
          <div className="vybe-card border-glow fade-in">
            <div className="flex items-start space-x-4 mb-6">
              <AlertCircle className="w-6 h-6 text-vybe-cyan mt-1 flex-shrink-0" />
              <div>
                <h2 className="text-2xl font-bold mb-4 text-gradient">Quick Summary</h2>
                <div className="grid md:grid-cols-2 gap-6 text-foreground/70">
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                      <span>We collect minimal personal data</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                      <span>We never sell your information</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                      <span>You control your data</span>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                      <span>Secure encryption always</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                      <span>GDPR & CCPA compliant</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                      <span>Transparent practices</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="section-padding section-bg-tertiary section-separator">
        <div className="max-w-4xl mx-auto">
          <div className="vybe-card mb-8 slide-in-left">
            <div className="flex items-start space-x-4 mb-6">
              <FileText className="w-6 h-6 text-vybe-cyan mt-1" />
              <div>
                <h2 className="text-2xl font-bold mb-4 text-gradient">Introduction</h2>
                <p className="text-foreground/70 leading-relaxed mb-4">
                  At VYBE LOOPROOMS™, we believe that privacy is a fundamental human right. 
                  This Privacy Policy explains how we collect, use, disclose, and safeguard 
                  your information when you visit our website or use our services.
                </p>
                <p className="text-foreground/70 leading-relaxed">
                  By using VYBE LOOPROOMS™, you agree to the collection and use of information 
                  in accordance with this policy. We are committed to being transparent about 
                  our data practices and giving you control over your personal information.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-8 stagger-in">
            <div className="vybe-card">
              <div className="flex items-start space-x-4">
                <Eye className="w-6 h-6 text-vybe-purple mt-1" />
                <div>
                  <h3 className="text-xl font-bold mb-4 text-gradient-reverse">Information We Collect</h3>
                  <div className="space-y-4 text-foreground/70">
                    <div>
                      <h4 className="font-semibold text-foreground mb-2">Personal Information</h4>
                      <p className="mb-2">
                        When you join our waitlist or contact us, we may collect personal information 
                        such as your name, email address, and any other information you voluntarily provide.
                      </p>
                      <ul className="list-disc list-inside ml-4 space-y-1 text-sm">
                        <li>Name and email address (waitlist signup)</li>
                        <li>Contact information (contact forms)</li>
                        <li>Communication preferences</li>
                        <li>Any information you provide in messages</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground mb-2">Usage Data</h4>
                      <p className="mb-2">
                        We automatically collect certain information when you visit our website, 
                        including your IP address, browser type, operating system, and pages visited.
                      </p>
                      <ul className="list-disc list-inside ml-4 space-y-1 text-sm">
                        <li>Device and browser information</li>
                        <li>Pages visited and time spent</li>
                        <li>Referring websites</li>
                        <li>Geographic location (general)</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground mb-2">Cookies and Tracking</h4>
                      <p>
                        We use cookies and similar tracking technologies to enhance your experience 
                        and analyze how our website is used. You can control cookies through your browser settings.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="vybe-card">
              <div className="flex items-start space-x-4">
                <Lock className="w-6 h-6 text-vybe-cyan mt-1" />
                <div>
                  <h3 className="text-xl font-bold mb-4 text-gradient">How We Use Your Information</h3>
                  <div className="space-y-3 text-foreground/70">
                    <p>We use the information we collect to:</p>
                    <ul className="list-disc list-inside space-y-2 ml-4">
                      <li>Provide and maintain our services</li>
                      <li>Send you updates about VYBE LOOPROOMS™</li>
                      <li>Respond to your inquiries and provide support</li>
                      <li>Improve and optimize our website and services</li>
                      <li>Analyze usage patterns and preferences</li>
                      <li>Comply with legal obligations</li>
                      <li>Detect and prevent fraud or abuse</li>
                    </ul>
                    <div className="mt-4 p-4 bg-vybe-cyan/10 border border-vybe-cyan/20 rounded-lg">
                      <p className="text-sm">
                        <strong>We will never:</strong> Sell your data, share it with advertisers, 
                        or use it for purposes you haven't agreed to.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="vybe-card">
              <h3 className="text-xl font-bold mb-4 text-gradient-reverse">Information Sharing</h3>
              <div className="text-foreground/70 space-y-4">
                <p>
                  We do not sell, trade, or otherwise transfer your personal information to 
                  outside parties except in the following limited circumstances:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li><strong>With your explicit consent</strong> - We'll always ask first</li>
                  <li><strong>Service providers</strong> - Trusted partners who help us operate (email services, analytics)</li>
                  <li><strong>Legal requirements</strong> - When required by law or to protect rights</li>
                  <li><strong>Business transfers</strong> - In connection with a merger or acquisition</li>
                </ul>
                <div className="mt-4 p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
                  <p className="text-sm">
                    All third-party service providers are required to maintain the same 
                    level of data protection as we do.
                  </p>
                </div>
              </div>
            </div>

            <div className="vybe-card">
              <h3 className="text-xl font-bold mb-4 text-gradient">Data Security & Retention</h3>
              <div className="text-foreground/70 space-y-4">
                <p>
                  We implement industry-standard security measures to protect your personal information 
                  against unauthorized access, alteration, disclosure, or destruction.
                </p>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold text-foreground mb-2">Security Measures</h4>
                    <ul className="list-disc list-inside space-y-1 text-sm">
                      <li>SSL/TLS encryption</li>
                      <li>Secure data centers</li>
                      <li>Regular security audits</li>
                      <li>Access controls</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-2">Data Retention</h4>
                    <ul className="list-disc list-inside space-y-1 text-sm">
                      <li>Waitlist data: Until launch + 1 year</li>
                      <li>Contact inquiries: 3 years</li>
                      <li>Analytics data: 2 years</li>
                      <li>Marketing preferences: Until withdrawn</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div className="vybe-card">
              <h3 className="text-xl font-bold mb-4 text-gradient-reverse">Your Rights</h3>
              <div className="text-foreground/70 space-y-4">
                <p>You have the following rights regarding your personal information:</p>
                <div className="grid md:grid-cols-2 gap-4">
                  <ul className="list-disc list-inside space-y-2">
                    <li><strong>Access</strong> - View your personal data</li>
                    <li><strong>Correct</strong> - Fix inaccurate information</li>
                    <li><strong>Delete</strong> - Remove your data</li>
                    <li><strong>Opt-out</strong> - Stop marketing emails</li>
                  </ul>
                  <ul className="list-disc list-inside space-y-2">
                    <li><strong>Portability</strong> - Export your data</li>
                    <li><strong>Restrict</strong> - Limit data processing</li>
                    <li><strong>Object</strong> - Refuse certain uses</li>
                    <li><strong>Withdraw consent</strong> - At any time</li>
                  </ul>
                </div>
                <div className="mt-4 p-4 bg-vybe-purple/10 border border-vybe-purple/20 rounded-lg">
                  <p className="text-sm">
                    To exercise these rights, contact us at{" "}
                    <a href="mailto:privacy@feelyourvybe.com" className="text-vybe-cyan hover:text-vybe-blue transition-colors font-medium">
                      privacy@feelyourvybe.com
                    </a>{" "}
                    - We respond within 30 days.
                  </p>
                </div>
              </div>
            </div>

            <div className="vybe-card">
              <h3 className="text-xl font-bold mb-4 text-gradient">International Transfers</h3>
              <p className="text-foreground/70 leading-relaxed">
                Your information may be transferred to and processed in countries other than your own. 
                We ensure appropriate safeguards are in place, including standard contractual clauses 
                and adequacy decisions, to protect your data during international transfers.
              </p>
            </div>

            <div className="vybe-card">
              <h3 className="text-xl font-bold mb-4 text-gradient-reverse">Children's Privacy</h3>
              <p className="text-foreground/70 leading-relaxed">
                VYBE LOOPROOMS™ is not intended for children under 13 years of age. We do not 
                knowingly collect personal information from children under 13. If you believe 
                we have collected such information, please contact us immediately.
              </p>
            </div>

            <div className="vybe-card">
              <h3 className="text-xl font-bold mb-4 text-gradient">Changes to This Policy</h3>
              <p className="text-foreground/70 leading-relaxed mb-4">
                We may update our Privacy Policy from time to time. We will notify you of any 
                material changes by posting the new Privacy Policy on this page and updating 
                the "Last updated" date.
              </p>
              <div className="p-4 bg-vybe-pink/10 border border-vybe-pink/20 rounded-lg">
                <p className="text-sm text-foreground/70">
                  For significant changes, we'll send email notifications to our waitlist members 
                  at least 30 days before the changes take effect.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="section-padding section-bg-primary">
        <div className="max-w-4xl mx-auto">
          <div className="vybe-card text-center border-glow fade-in">
            <h3 className="text-2xl font-bold mb-4 text-gradient">Questions About Privacy?</h3>
            <p className="text-foreground/70 leading-relaxed mb-6">
              We're committed to transparency. If you have any questions about this Privacy Policy 
              or how we handle your data, we're here to help.
            </p>
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div className="space-y-2">
                <div className="flex items-center justify-center space-x-2">
                  <Mail className="w-5 h-5 text-vybe-cyan" />
                  <span className="font-medium">Email</span>
                </div>
                <a 
                  href="mailto:privacy@feelyourvybe.com" 
                  className="text-vybe-cyan hover:text-vybe-blue transition-colors"
                >
                  privacy@feelyourvybe.com
                </a>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-center space-x-2">
                  <Users className="w-5 h-5 text-vybe-purple" />
                  <span className="font-medium">General Contact</span>
                </div>
                <a 
                  href="/contact" 
                  className="text-vybe-purple hover:text-vybe-pink transition-colors"
                >
                  Contact Form
                </a>
              </div>
            </div>
            <Button className="btn-glow" onClick={() => window.location.href = '/contact'}>
              Contact Privacy Team
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default PrivacyPolicy;