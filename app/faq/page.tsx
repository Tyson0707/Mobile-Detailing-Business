import type { Metadata } from "next";
import { FAQ } from "@/components/FAQ";
import { BookingCTA } from "@/components/BookingCTA";
import { siteConfig } from "@/lib/config";

export const metadata: Metadata = {
  title: "FAQ | Clear Line Auto Detail",
  description:
    "Common questions about Clear Line Auto Detail — what's included, how long it takes, where we service, and how to book.",
  alternates: {
    canonical: `${siteConfig.url}/faq`,
  },
};

export default function FAQPage() {
  return (
    <>
      <FAQ />
      <BookingCTA />
    </>
  );
}
