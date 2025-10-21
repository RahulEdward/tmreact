import { Navigation } from "@/components/landing/Navigation";
import { Hero } from "@/components/landing/Hero";
import { Features } from "@/components/landing/Features";
import { Brokers } from "@/components/landing/Brokers";
import { Pricing } from "@/components/landing/Pricing";
import { Footer } from "@/components/landing/Footer";

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-slate-950">
      <Navigation />
      <Hero />
      <Features />
      <Brokers />
      <Pricing />
      <Footer />
    </main>
  );
}
