import type { Metadata } from "next";
import Link from "next/link";
import { services, addOns, vehicleSizes, vehicleSizeLabels, siteConfig } from "@/lib/config";

export const metadata: Metadata = {
  title: "Services & Pricing | Mobile Car Detailing NW Calgary",
  description:
    "Full pricing for Clearline Auto Detail's mobile car detailing services in NW Calgary. Interior Reset from $170, Exterior Detail from $110, Full Detail from $240, Premium Detail from $300. We come to you.",
  alternates: {
    canonical: `${siteConfig.url}/services`,
  },
};

export default function ServicesPage() {
  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Mobile Car Detailing Services Calgary",
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
          price: service.pricing.Small,
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
      <div className="pt-28 pb-14 px-4 sm:px-6 relative overflow-hidden">
        <div aria-hidden="true" className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-blue-600/[0.06] rounded-full blur-3xl" />
        <div className="max-w-4xl mx-auto text-center relative">
          <p className="text-blue-400 text-sm font-semibold uppercase tracking-widest mb-3">
            NW Calgary Mobile Detailing
          </p>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-5 text-balance">
            Services & Pricing
          </h1>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            All services performed at your location. We bring our equipment and products — all we need is a tap and an outlet. Prices shown are for each vehicle size.
          </p>

          {/* Size legend */}
          <div className="flex flex-wrap justify-center gap-4 mt-7">
            {vehicleSizes.map((size) => (
              <div key={size} className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.04] border border-white/[0.07]">
                <span className="text-white text-sm font-semibold">{size}</span>
                <span className="text-slate-500 text-xs">{vehicleSizeLabels[size].split("(")[1]?.replace(")", "") ?? ""}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main packages */}
      <section className="pb-16 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold text-white mb-8">Detail Packages</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {services.map((service) => (
              <div
                key={service.id}
                className={`rounded-2xl border p-7 flex flex-col gap-6 ${
                  service.badge === "Most Popular"
                    ? "border-blue-500/40 bg-[#0f1b2d]"
                    : service.badge === "Premium"
                    ? "border-amber-500/30 bg-[#0f1b2d]"
                    : "border-white/[0.07] bg-[#0f1829]"
                }`}
              >
                {/* Header row */}
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap mb-2">
                      <h2 className="text-white font-bold text-xl">{service.name}</h2>
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
                    <p className="text-slate-400 text-sm leading-relaxed">{service.description}</p>
                  </div>
                </div>

                {/* Pricing table */}
                <div className="rounded-xl overflow-hidden border border-white/[0.07]">
                  <div className="grid grid-cols-3 bg-white/[0.03]">
                    {vehicleSizes.map((size) => (
                      <div key={size} className="px-3 py-2 text-center border-r border-white/[0.05] last:border-0">
                        <p className="text-slate-500 text-xs mb-0.5">{size}</p>
                        <p
                          className={`text-xl font-bold ${
                            service.badge === "Most Popular"
                              ? "text-blue-400"
                              : service.badge === "Premium"
                              ? "text-amber-400"
                              : "text-white"
                          }`}
                        >
                          ${service.pricing[size]}
                        </p>
                      </div>
                    ))}
                  </div>
                  <div className="px-3 py-1.5 bg-white/[0.02] text-center">
                    <span className="text-slate-600 text-[10px]">sedan/coupe · SUV/truck · 3-row SUV/van</span>
                  </div>
                </div>

                {/* Features */}
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                  {service.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2">
                      <svg
                        className={`w-4 h-4 mt-0.5 shrink-0 ${
                          service.badge === "Most Popular" ? "text-blue-400" : service.badge === "Premium" ? "text-amber-400" : "text-blue-500"
                        }`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
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
      <section className="pb-16 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold text-white mb-2">Add-Ons</h2>
          <p className="text-slate-400 text-sm mb-8">Add any of these to your booking.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {addOns.map((addon) => (
              <div
                key={addon.name}
                className="p-5 rounded-xl bg-[#0f1829] border border-white/[0.07] flex gap-4 justify-between items-start"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <h3 className="text-white text-sm font-semibold">{addon.name}</h3>
                    {addon.note && (
                      <span className="text-slate-600 text-[10px] border border-white/[0.08] px-1.5 py-0.5 rounded">
                        {addon.note}
                      </span>
                    )}
                  </div>
                  <p className="text-slate-500 text-xs leading-relaxed">{addon.description}</p>
                </div>
                <span className="text-blue-400 font-bold text-sm shrink-0">{addon.price}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="pb-24 px-4 sm:px-6">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Not sure what you need?</h2>
          <p className="text-slate-400 mb-6 text-sm">
            Message us and we&apos;ll recommend the right package for your vehicle and budget.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/booking"
              className="px-7 py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl transition-colors text-sm"
            >
              Book or Get a Quote
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
