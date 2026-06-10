import type { Metadata } from "next";
import { siteConfig } from "@/lib/config";

export const metadata: Metadata = {
  title: "Mobile Car Detailing Prices & Packages | Clear Line Auto Detail Calgary",
  description:
    "Transparent flat-rate pricing for mobile car detailing in Calgary. Interior Reset from $180, Full Detail from $250, Ceramic Coatings from $699. No hidden fees — see exactly what's included before you book.",
  alternates: {
    canonical: `${siteConfig.url}/services`,
  },
};

export default function ServicesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
