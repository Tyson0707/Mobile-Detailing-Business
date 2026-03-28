import type { Metadata } from "next";
import { Hero } from "@/components/Hero";
import { ServicesSection } from "@/components/ServicesSection";
import { HowItWorks } from "@/components/HowItWorks";
import { WhyUs } from "@/components/WhyUs";
import { Testimonials } from "@/components/Testimonials";
import { FAQ } from "@/components/FAQ";
import { BookingCTA } from "@/components/BookingCTA";
import { siteConfig } from "@/lib/config";

export const metadata: Metadata = {
  title: "Mobile Car Detailing Calgary | Clear Line Auto Detail",
  description:
    "Calgary's #1 mobile car detailing service. We come to your home or office with all equipment. Expert interior & exterior detailing, ceramic coatings, paint correction. Book online today.",
  alternates: {
    canonical: siteConfig.url,
  },
};

export default function HomePage() {
  return (
    <>
      <Hero />
      <ServicesSection />
      <HowItWorks />
      <WhyUs />
      <Testimonials />
      <FAQ />
      <BookingCTA />
    </>
  );
}
