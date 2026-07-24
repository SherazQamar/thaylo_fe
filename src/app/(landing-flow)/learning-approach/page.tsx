import LearningHero from "@/components/landing/learning-approach/LearningHero";
import NotOneSize from "@/components/landing/learning-approach/NotOneSize";
import PersonalizedMeans from "@/components/landing/learning-approach/PersonalizedMeans";
import HowPersonalizes from "@/components/landing/learning-approach/HowPersonalizes";
import StrongFoundations from "@/components/landing/learning-approach/StrongFoundations";
import CTABanner from "@/components/landing/shared/CTABanner";
import Footer from "@/components/landing/shared/Footer";

export default function LearningApproach() {
  return (
    <main>
      <LearningHero />
      <NotOneSize />
      <PersonalizedMeans />
      <HowPersonalizes />
      <StrongFoundations />
      <CTABanner />
      <Footer />
    </main>
  );
}
