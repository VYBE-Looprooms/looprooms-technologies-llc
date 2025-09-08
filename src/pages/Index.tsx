import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import HowItWorks from "@/components/HowItWorks";
import FeaturedLooprooms from "@/components/FeaturedLooprooms";
import CreatorHighlight from "@/components/CreatorHighlight";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <Hero />
      <HowItWorks />
      <FeaturedLooprooms />
      <CreatorHighlight />
      <Footer />
    </div>
  );
};

export default Index;