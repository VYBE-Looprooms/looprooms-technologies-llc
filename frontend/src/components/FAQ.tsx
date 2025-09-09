import { useState } from "react";
import { ChevronDown, ChevronUp, HelpCircle } from "lucide-react";

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      question: "What exactly are VYBE LOOPROOMS™?",
      answer: "VYBE LOOPROOMS™ are specialized digital environments designed for emotional growth and well-being. Each Looproom focuses on specific areas like Recovery, Fitness, Meditation, and Music, connecting users through our proprietary Loopchain™ technology for personalized growth journeys."
    },
    {
      question: "How does the Loopchain™ technology work?",
      answer: "Loopchain™ creates interconnected pathways between different experiences and communities. It learns from your interactions and guides you through personalized journeys that adapt to your emotional needs, connecting you with relevant content, people, and experiences across the ecosystem."
    },
    {
      question: "When will VYBE LOOPROOMS™ be available?",
      answer: "We're planning a phased launch throughout 2025, starting with our core Looprooms in Q1-Q3. Beta access will be available to waitlist members first, followed by general availability. Join our waitlist to be among the first to experience the platform."
    },
    {
      question: "Is VYBE LOOPROOMS™ free to use?",
      answer: "We'll offer both free and premium tiers. Basic access to certain Looprooms will be free, while premium features, advanced Loopchains, and exclusive creator content will be available through subscription plans. Early adopters will receive special pricing."
    },
    {
      question: "How can I become a creator on the platform?",
      answer: "We're actively recruiting creators in wellness, fitness, therapy, and mindfulness. Apply through our creator program to monetize your expertise while making a positive impact. We provide tools, support, and revenue sharing opportunities for qualified creators."
    },
    {
      question: "Is my data and privacy protected?",
      answer: "Absolutely. We're committed to the highest standards of data protection and privacy. All personal information is encrypted, we're HIPAA compliant where applicable, and we never sell personal data. Your emotional well-being journey remains private and secure."
    }
  ];

  return (
    <section className="section-padding section-bg-secondary section-separator relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-vybe-cyan/5 rounded-full blur-3xl animate-float"></div>
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-vybe-purple/5 rounded-full blur-3xl animate-float" style={{ animationDelay: '3s' }}></div>
      
      <div className="max-w-4xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 bg-card/50 backdrop-blur-sm border border-vybe-cyan/30 rounded-full px-6 py-3 mb-6">
            <HelpCircle className="w-5 h-5 text-vybe-cyan" />
            <span className="text-sm font-medium">Frequently Asked</span>
          </div>
          
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
            <span className="text-gradient">Got Questions?</span>
          </h2>
          <p className="text-xl text-foreground/70 max-w-2xl mx-auto">
            Everything you need to know about VYBE LOOPROOMS™ and how we're revolutionizing emotional technology
          </p>
        </div>

        {/* FAQ Items */}
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="vybe-card transition-all duration-300 hover:border-vybe-cyan/40">
              <button
                className="w-full text-left focus:outline-none"
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-foreground pr-4">
                    {faq.question}
                  </h3>
                  <div className="flex-shrink-0">
                    {openIndex === index ? (
                      <ChevronUp className="w-5 h-5 text-vybe-cyan transition-transform duration-200" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-vybe-cyan transition-transform duration-200" />
                    )}
                  </div>
                </div>
                
                <div className={`transition-all duration-300 overflow-hidden ${openIndex === index ? 'max-h-96 opacity-100 mt-4' : 'max-h-0 opacity-0'}`}>
                  <p className="text-foreground/70 leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              </button>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-12">
          <p className="text-foreground/60 mb-4">
            Still have questions? We're here to help!
          </p>
          <a
            href="/contact"
            className="inline-flex items-center text-vybe-cyan hover:text-vybe-purple transition-colors font-medium"
          >
            Get in touch with our team
          </a>
        </div>
      </div>
    </section>
  );
};

export default FAQ;
