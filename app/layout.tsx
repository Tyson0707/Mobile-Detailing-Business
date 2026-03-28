import type { Metadata } from "next";
import "./globals.css";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { siteConfig } from "@/lib/config";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: "Clearline Auto Detail | Mobile Car Detailing Calgary",
    template: "%s | Clearline Auto Detail",
  },
  description: siteConfig.description,
  keywords: [
    "mobile car detailing Calgary",
    "car detailing Calgary",
    "interior car cleaning Calgary",
    "mobile auto detailing Calgary",
    "mobile detailing NW Calgary",
    "car detailing NW Calgary",
    "auto detailing Bearspaw",
    "car detailing Tuscany Calgary",
    "mobile car wash Calgary",
    "interior detail Calgary",
    "full detail Calgary",
    "ceramic coating Calgary",
    "Clearline Auto Detail",
    "clearlineautodetail.ca",
  ],
  authors: [{ name: "Clearline Auto Detail" }],
  creator: "Clearline Auto Detail",
  openGraph: {
    type: "website",
    locale: "en_CA",
    url: siteConfig.url,
    siteName: siteConfig.name,
    title: "Clearline Auto Detail | Mobile Car Detailing Calgary",
    description: siteConfig.description,
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Clearline Auto Detail — Mobile Car Detailing NW Calgary",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Clearline Auto Detail | Mobile Car Detailing Calgary",
    description: siteConfig.description,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: siteConfig.url,
  },
};

const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "AutoDealer",
  "@id": `${siteConfig.url}/#business`,
  name: "Clearline Auto Detail",
  description: siteConfig.description,
  url: siteConfig.url,
  telephone: siteConfig.phone,
  email: siteConfig.email,
  address: {
    "@type": "PostalAddress",
    addressLocality: "Calgary",
    addressRegion: "AB",
    addressCountry: "CA",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: 51.1507,
    longitude: -114.1916,
  },
  areaServed: siteConfig.serviceAreas.map((area) => ({
    "@type": "City",
    name: area,
  })),
  priceRange: "$$",
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "08:00",
      closes: "18:00",
    },
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Saturday", "Sunday"],
      opens: "09:00",
      closes: "16:00",
    },
  ],
  sameAs: [siteConfig.social.instagram, siteConfig.social.facebook],
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Mobile Car Detailing Services",
    itemListElement: [
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Interior Reset" }, price: "170", priceCurrency: "CAD" },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Exterior Detail" }, price: "110", priceCurrency: "CAD" },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Full Detail" }, price: "240", priceCurrency: "CAD" },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Premium Detail" }, price: "300", priceCurrency: "CAD" },
    ],
  },
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "5",
    reviewCount: "47",
    bestRating: "5",
    worstRating: "1",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-CA">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
        />
        <meta name="theme-color" content="#080d1a" />
      </head>
      <body>
        <Navigation />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
