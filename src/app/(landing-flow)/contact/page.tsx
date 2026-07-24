import ContactHero from "@/components/landing/contact/ContactHero";
import ContactFormSection from "@/components/landing/contact/ContactFormSection";
import FAQ, { contactFaqs } from "@/components/landing/home/FAQ";
import CTABanner from "@/components/landing/shared/CTABanner";
import Footer from "@/components/landing/shared/Footer";

export default function ContactPage() {
  return (
    <main>
      <ContactHero />
      <ContactFormSection />
      <FAQ items={contactFaqs} label="faqs" labelUppercase={false} />
      <CTABanner />
      <Footer />
    </main>
  );
}
