import Navbar from "@/components/landing/shared/Navbar";
import Hero from "@/components/landing/home/Hero";
import OurStory from "@/components/landing/home/OurStory";
import CoursePilot from "@/components/landing/home/CoursePilot";
import SupportSystem from "@/components/landing/home/SupportSystem";
import SuccessStories from "@/components/landing/home/SuccessStories";
import Pricing from "@/components/landing/home/Pricing";
import FAQ from "@/components/landing/home/FAQ";
import CTABanner from "@/components/landing/shared/CTABanner";
import Footer from "@/components/landing/shared/Footer";

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
