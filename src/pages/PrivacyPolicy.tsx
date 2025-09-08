import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Shield, Eye, Lock, FileText } from "lucide-react";

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      
      {/* Hero Section */}
      <section className="section-padding pt-32">
        <div className="max-w-4xl mx-auto text-center">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-r from-vybe-cyan to-vybe-purple flex items-center justify-center">
            <Shield className="w-10 h-10 text-background" />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            <span className="text-gradient">Privacy Policy</span>
          </h1>
          <p className="text-xl text-foreground/80 mb-8 leading-relaxed">
            Your privacy is fundamental to everything we do at VYBE LOOPROOMS™.
          </p>
          <p className="text-sm text-foreground/60">
            Last updated: {new Date().toLocaleDateString('en-US', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="section-padding">
        <div className="max-w-4xl mx-auto">
          <div className="vybe-card mb-8">
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
                  in accordance with this policy.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <div className="vybe-card">
              <div className="flex items-start space-x-4">
                <Eye className="w-6 h-6 text-vybe-purple mt-1" />
                <div>
                  <h3 className="text-xl font-bold mb-4 text-gradient-reverse">Information We Collect</h3>
                  <div className="space-y-4 text-foreground/70">
                    <div>
                      <h4 className="font-semibold text-foreground mb-2">Personal Information</h4>
                      <p>
                        When you join our waitlist or contact us, we may collect personal information 
                        such as your name, email address, and any other information you voluntarily provide.
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground mb-2">Usage Data</h4>
                      <p>
                        We automatically collect certain information when you visit our website, 
                        including your IP address, browser type, operating system, and pages visited.
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground mb-2">Cookies and Tracking</h4>
                      <p>
                        We use cookies and similar tracking technologies to enhance your experience 
                        and analyze how our website is used.
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
                      <li>Notify you about changes to our services</li>
                      <li>Communicate with you about our platform and updates</li>
                      <li>Provide customer support</li>
                      <li>Improve and optimize our website and services</li>
                      <li>Comply with legal obligations</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div className="vybe-card">
              <h3 className="text-xl font-bold mb-4 text-gradient-reverse">Information Sharing</h3>
              <div className="text-foreground/70 space-y-4">
                <p>
                  We do not sell, trade, or otherwise transfer your personal information to 
                  outside parties except in the following circumstances:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>With your explicit consent</li>
                  <li>To trusted service providers who assist us in operating our website</li>
                  <li>When required by law or to protect our rights</li>
                  <li>In connection with a merger, acquisition, or asset sale</li>
                </ul>
              </div>
            </div>

            <div className="vybe-card">
              <h3 className="text-xl font-bold mb-4 text-gradient">Data Security</h3>
              <p className="text-foreground/70 leading-relaxed">
                We implement appropriate security measures to protect your personal information 
                against unauthorized access, alteration, disclosure, or destruction. However, 
                no method of transmission over the Internet is 100% secure, and we cannot 
                guarantee absolute security.
              </p>
            </div>

            <div className="vybe-card">
              <h3 className="text-xl font-bold mb-4 text-gradient-reverse">Your Rights</h3>
              <div className="text-foreground/70 space-y-4">
                <p>Depending on your location, you may have the following rights:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Access to your personal information</li>
                  <li>Correction of inaccurate information</li>
                  <li>Deletion of your personal information</li>
                  <li>Opt-out of marketing communications</li>
                  <li>Data portability</li>
                </ul>
                <p>
                  To exercise these rights, please contact us at{" "}
                  <a href="mailto:privacy@vybelooprooms.com" className="text-vybe-cyan hover:text-vybe-blue transition-colors">
                    privacy@vybelooprooms.com
                  </a>
                </p>
              </div>
            </div>

            <div className="vybe-card">
              <h3 className="text-xl font-bold mb-4 text-gradient">Changes to This Policy</h3>
              <p className="text-foreground/70 leading-relaxed">
                We may update our Privacy Policy from time to time. We will notify you of any 
                changes by posting the new Privacy Policy on this page and updating the "Last updated" 
                date. You are advised to review this Privacy Policy periodically for any changes.
              </p>
            </div>

            <div className="vybe-card">
              <h3 className="text-xl font-bold mb-4 text-gradient-reverse">Contact Us</h3>
              <p className="text-foreground/70 leading-relaxed mb-4">
                If you have any questions about this Privacy Policy, please contact us:
              </p>
              <div className="space-y-2 text-foreground/70">
                <p>Email: <a href="mailto:privacy@vybelooprooms.com" className="text-vybe-cyan hover:text-vybe-blue transition-colors">privacy@vybelooprooms.com</a></p>
                <p>Website: <a href="/contact" className="text-vybe-cyan hover:text-vybe-blue transition-colors">Contact Form</a></p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default PrivacyPolicy;