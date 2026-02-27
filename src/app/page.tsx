import Navbar from "@/components/landing/Navbar";
import Hero from "@/components/landing/Hero";
import OurStory from "@/components/landing/OurStory";
import CoursePilot from "@/components/landing/CoursePilot";
import SupportSystem from "@/components/landing/SupportSystem";
import SuccessStories from "@/components/landing/SuccessStories";
import Pricing from "@/components/landing/Pricing";
import FAQ from "@/components/landing/FAQ";
import CTABanner from "@/components/landing/CTABanner";
import Footer from "@/components/landing/Footer";

export default function Home() {
  return (
    <main>
      <Navbar />
      <Hero />
      <OurStory />
      <CoursePilot />
      <SupportSystem />
      <SuccessStories />
      <Pricing />
      <FAQ />
      <CTABanner />
      <Footer />
    </main>
  );
}
