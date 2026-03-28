import type { Metadata } from "next";
import Link from "next/link";
import { services, siteConfig } from "@/lib/config";

export const metadata: Metadata = {
  title: "Services & Pricing | Mobile Car Detailing Calgary",
  description:
    "View all mobile car detailing services and pricing from Clear Line Auto Detail in Calgary. Express exterior $79, Interior detail $149, Full detail $249, Ceramic coating from $799. We come to you.",
  alternates: {
    canonical: `${siteConfig.url}/services`,
  },
};

const addOnServices = [
  { name: "Engine Bay Cleaning", price: "$49", description: "Safe, low-pressure degreasing and rinse of the engine bay." },
  { name: "Odour Elimination", price: "$49", description: "Ozone treatment to eliminate smoke, pet, and food odours." },
  { name: "Headlight Restoration", price: "$69", description: "Restore yellowed or foggy headlights to near-new clarity." },
  { name: "Paint Decontamination", price: "$79", description: "Full clay bar treatment + iron decontamination spray." },
  { name: "Leather Deep Clean & Condition", price: "$79", description: "pH-safe leather cleaner followed by premium conditioner." },
  { name: "1-Stage Paint Correction", price: "$299+", description: "Remove light scratches, swirls, and water spots from the paint." },
];

const vehicleSizing = [
  { type: "Sedan / Coupe", modifier: "Base price" },
  { type: "SUV / Crossover", modifier: "+ $20–$30" },
  { type: "Truck / Full-size SUV", modifier: "+ $40–$60" },
  { type: "Van / Sprinter", modifier: "+ $60–$100" },
];

export default function ServicesPage() {
  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Mobile Car Detailing Services Calgary",
    description: "Professional mobile car detailing services in Calgary, AB",
    itemListElement: services.map((service, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "Service",
        name: service.name,
        description: service.description,
        provider: {
          "@type": "LocalBusiness",
          name: siteConfig.name,
          address: { "@type": "PostalAddress", addressLocality: "Calgary", addressRegion: "AB" },
        },
        offers: {
          "@type": "Offer",
          price: service.price.replace(/[^0-9]/g, ""),
          priceCurrency: "CAD",
        },
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />

      {/* Hero */}
      <div className="pt-28 pb-16 px-4 sm:px-6 relative overflow-hidden">
        <div aria-hidden="true" className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-blue-600/[0.06] rounded-full blur-3xl" />
        <div className="max-w-4xl mx-auto text-center relative">
          <p className="text-blue-400 text-sm font-semibold uppercase tracking-widest mb-3">
            Calgary Mobile Detailing
          </p>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-5 text-balance">
            Services & Pricing
          </h1>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            All services performed at your location in Calgary and surrounding areas. We bring all water, equipment, and products. Prices are for standard sedan/coupe — see vehicle sizing below.
          </p>
        </div>
      </div>

      {/* Main packages */}
      <section className="pb-20 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold text-white mb-8">Detail Packages</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {services.map((service) => (
              <div
                key={service.id}
                className={`rounded-2xl border p-7 flex flex-col gap-5 ${
                  service.badge === "Most Popular"
                    ? "border-blue-500/40 bg-[#101b2e]"
                    : service.badge === "Premium"
                    ? "border-amber-500/30 bg-[#101b2e]"
                    : "border-white/[0.07] bg-[#0f1829]"
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-white font-bold text-lg">{service.name}</h3>
                      {service.badge && (
                        <span
                          className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                            service.badge === "Most Popular"
                              ? "bg-blue-600/20 text-blue-400 border border-blue-500/30"
                              : "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                          }`}
                        >
                          {service.badge}
                        </span>
                      )}
                    </div>
                    <p className="text-slate-400 text-sm">{service.description}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p
                      className={`text-2xl font-bold ${
                        service.badge === "Most Popular"
                          ? "text-blue-400"
                          : service.badge === "Premium"
                          ? "text-amber-400"
                          : "text-white"
                      }`}
                    >
                      {service.price}
                    </p>
                    <p className="text-slate-500 text-xs">{service.duration}</p>
                  </div>
                </div>

                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {service.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2">
                      <svg
                        className={`w-4 h-4 shrink-0 ${
                          service.badge === "Most Popular"
                            ? "text-blue-400"
                            : service.badge === "Premium"
                            ? "text-amber-400"
                            : "text-blue-500"
                        }`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-slate-300 text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  href="/booking"
                  className={`mt-auto py-3 rounded-xl text-sm font-semibold text-center transition-colors ${
                    service.badge === "Most Popular"
                      ? "bg-blue-600 hover:bg-blue-500 text-white"
                      : service.badge === "Premium"
                      ? "bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-400"
                      : "bg-white/[0.06] hover:bg-white/[0.1] border border-white/[0.08] text-white"
                  }`}
                >
                  Book {service.name}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Add-ons */}
      <section className="pb-20 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold text-white mb-2">Add-On Services</h2>
          <p className="text-slate-400 text-sm mb-8">
            Enhance any package with these add-on services.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {addOnServices.map((addon) => (
              <div
                key={addon.name}
                className="p-5 rounded-xl bg-[#0f1829] border border-white/[0.07] flex items-start justify-between gap-4"
              >
                <div className="flex-1">
                  <h3 className="text-white text-sm font-semibold mb-1">{addon.name}</h3>
                  <p className="text-slate-500 text-xs leading-relaxed">{addon.description}</p>
                </div>
                <span className="text-blue-400 font-bold text-sm shrink-0">{addon.price}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Vehicle sizing */}
      <section className="pb-20 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="rounded-2xl bg-[#0f1829] border border-white/[0.07] p-7">
            <h2 className="text-xl font-bold text-white mb-2">Vehicle Size Pricing</h2>
            <p className="text-slate-400 text-sm mb-6">
              Base prices listed above are for sedans and coupes. The following adjustments apply for larger vehicles:
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {vehicleSizing.map((v) => (
                <div key={v.type} className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.05] text-center">
                  <p className="text-white text-sm font-medium mb-1">{v.type}</p>
                  <p className="text-slate-400 text-xs">{v.modifier}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="pb-24 px-4 sm:px-6">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Not sure which package to choose?</h2>
          <p className="text-slate-400 mb-6">
            Send us a message and we&apos;ll recommend the best option for your vehicle and budget.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/booking"
              className="px-7 py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl transition-colors text-sm"
            >
              Get a Free Quote
            </Link>
            <a
              href={`tel:${siteConfig.phoneRaw}`}
              className="px-7 py-3.5 bg-white/[0.06] hover:bg-white/[0.1] border border-white/[0.08] text-white font-semibold rounded-xl transition-colors text-sm"
            >
              Call {siteConfig.phone}
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
