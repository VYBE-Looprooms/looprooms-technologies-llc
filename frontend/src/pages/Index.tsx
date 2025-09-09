import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import HowItWorks from "@/components/HowItWorks";
import FeaturedLooprooms from "@/components/FeaturedLooprooms";
import Testimonials from "@/components/Testimonials";
import CreatorHighlight from "@/components/CreatorHighlight";
import FAQ from "@/components/FAQ";
import Footer from "@/components/Footer";
import useGSAP from "@/hooks/useGSAPFixed";

const Index = () => {
  // Initialize GSAP animations
  useGSAP();

  return (
    <div className="min-h-screen w-full">
      <Navbar />
      <Hero />
      <div className="fade-in">
        <HowItWorks />
      </div>
      <div className="fade-in">
        <FeaturedLooprooms />
      </div>
      <div className="fade-in">
        <Testimonials />
      </div>
      <div className="fade-in">
        <CreatorHighlight />
      </div>
      <div className="fade-in">
        <FAQ />
      </div>
      <Footer />
    </div>
  );
};

export default Index;