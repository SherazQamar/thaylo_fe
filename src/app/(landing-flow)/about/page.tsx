import AboutHero from "@/components/landing/about/AboutHero";
import WhoWeAre from "@/components/landing/about/WhoWeAre";
import MilestonePath from "@/components/landing/about/MilestonePath";
import GuidingPrinciples from "@/components/landing/about/GuidingPrinciples";
import Trainers from "@/components/landing/about/Trainers";
import CTABanner from "@/components/landing/shared/CTABanner";
import Footer from "@/components/landing/shared/Footer";

export default function AboutPage() {
  return (
    <main>
      <AboutHero />
      <WhoWeAre />
      <MilestonePath />
      <GuidingPrinciples />
      <Trainers />
      <CTABanner />
      <Footer />
    </main>
  );
}
