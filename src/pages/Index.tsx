import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { HeroSection } from "@/components/home/HeroSection";
import { DomainsSection } from "@/components/home/DomainsSection";
import { FeaturedAgents } from "@/components/home/FeaturedAgents";
import { CTASection } from "@/components/home/CTASection";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <HeroSection />
        <DomainsSection />
        <FeaturedAgents />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
