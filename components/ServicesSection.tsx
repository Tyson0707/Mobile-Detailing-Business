"use client";

import { useState } from "react";
import { services, paintCorrectionServices, vehicleSizes, vehicleSizeLabels, siteConfig } from "@/lib/config";
import type { VehicleSize } from "@/lib/config";

type ServiceCardData = {
  id: string;
  name: string;
  badge: string | null;
  description: string;
  pricing: Record<VehicleSize, number>;
  features: readonly string[];
  cta?: string;
  startingAt?: boolean;
  idealFor?: string | null;
  note?: string | null;
};

export function ServicesSection() {
  const [selectedSize, setSelectedSize] = useState<VehicleSize>("Mid");

  return (
    <section id="services" className="py-20 sm:py-28 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-14">
          <p className="text-blue-400 text-sm font-semibold uppercase tracking-widest mb-3">
            Services & Pricing
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4 text-balance">
            What we offer
          </h2>
          <p className="text-slate-400 text-base max-w-xl mx-auto mb-2">
            Every service performed at your location. All pricing in CAD.
          </p>
          <p className="text-slate-600 text-sm mb-7">
            Fully mobile professional detailing serving Calgary and surrounding area.
          </p>

          {/* Vehicle size toggle */}
          <div className="inline-flex gap-2 p-1.5 rounded-2xl bg-white/[0.04] border border-white/[0.07]">
            {vehicleSizes.map((size) => (
              <button
                key={size}
                onClick={() => setSelectedSize(size)}
                className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  selectedSize === size
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                {size}
                <span className="hidden sm:inline text-xs font-normal ml-1.5 opacity-70">
                  {vehicleSizeLabels[size].split("(")[1]?.replace(")", "")}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Detail Packages */}
        <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-5">Detail Packages</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-14">
          {services.map((service) => (
            <ServiceCard key={service.id} service={service} selectedSize={selectedSize} />
          ))}
        </div>

        {/* Paint Enhancement & Protection */}
        <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-2">Paint Enhancement & Protection</h3>
        <p className="text-slate-500 text-sm mb-5">Machine polishing, decontamination, and long-term ceramic protection.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {paintCorrectionServices.map((service) => (
            <ServiceCard key={service.id} service={service} selectedSize={selectedSize} />
          ))}
        </div>

        <p className="text-center text-slate-600 text-xs mt-7">
          Prices vary by vehicle size.{" "}
          <a href="/services" className="text-blue-500 hover:text-blue-400 underline">
            View add-ons and full details →
          </a>
        </p>
      </div>
    </section>
  );
}

function badgeStyles(badge: string | null) {
  if (badge === "Most Popular") return {
    card: "border-blue-500/40 bg-[#0f1b2d] shadow-lg shadow-blue-600/10",
    badge: "bg-blue-600 text-white",
    text: "text-blue-300",
    price: "text-blue-400",
    check: "text-blue-400",
    btn: "bg-blue-600 hover:bg-blue-500 text-white",
  };
  if (badge === "Premium") return {
    card: "border-amber-500/30 bg-[#0f1b2d]",
    badge: "bg-amber-500 text-black",
    text: "text-amber-300",
    price: "text-amber-400",
    check: "text-amber-400",
    btn: "bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-400",
  };
  if (badge === "Best Value") return {
    card: "border-emerald-500/30 bg-[#0f1b2d]",
    badge: "bg-emerald-500 text-white",
    text: "text-emerald-300",
    price: "text-emerald-400",
    check: "text-emerald-400",
    btn: "bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/30 text-emerald-400",
  };
  return {
    card: "border-white/[0.07] bg-[#0f1829]",
    badge: "",
    text: "text-white",
    price: "text-white",
    check: "text-blue-500",
    btn: "bg-white/[0.06] hover:bg-white/[0.1] border border-white/[0.08] text-white",
  };
}

function ServiceCard({ service, selectedSize }: { service: ServiceCardData; selectedSize: VehicleSize }) {
  const styles = badgeStyles(service.badge);
  const others = vehicleSizes.filter((s) => s !== selectedSize);
  const cta = service.cta ?? "Book Your Detail";

  return (
    <div className={`relative rounded-2xl border flex flex-col overflow-hidden transition-all hover:-translate-y-1 hover:shadow-xl ${styles.card}`}>
      {service.badge && (
        <div className={`absolute top-0 right-0 px-3 py-1 text-xs font-semibold rounded-bl-xl ${styles.badge}`}>
          {service.badge}
        </div>
      )}

      <div className="p-5 flex flex-col flex-1">
        <div className="mb-4 pr-16">
          <h3 className={`text-base font-bold mb-1.5 ${styles.text}`}>{service.name}</h3>
          <p className="text-slate-400 text-xs leading-relaxed">{service.description}</p>
          {service.idealFor && (
            <p className="text-slate-600 text-[10px] mt-2 italic">{service.idealFor}</p>
          )}
        </div>

        {/* Pricing */}
        <div className="mb-5 rounded-lg overflow-hidden border border-white/[0.07] bg-white/[0.03]">
          <div className="px-3 py-2.5 flex items-center justify-between">
            <span className="text-slate-500 text-xs">{selectedSize}</span>
            <span className={`font-bold text-lg ${styles.price}`}>
              {service.startingAt && "From "}${service.pricing[selectedSize]}{service.startingAt && "+"}
            </span>
          </div>
          <div className="px-3 py-1.5 border-t border-white/[0.05] flex justify-between">
            {others.map((s) => (
              <span key={s} className="text-slate-600 text-[10px]">
                {s}: {service.startingAt && "From "}${service.pricing[s]}{service.startingAt && "+"}
              </span>
            ))}
          </div>
        </div>

        {/* Features */}
        <ul className="space-y-1.5 mb-5 flex-1">
          {service.features.map((feature) => (
            <li key={feature} className="flex items-start gap-2">
              <svg className={`w-3.5 h-3.5 mt-0.5 shrink-0 ${styles.check}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-slate-300 text-xs">{feature}</span>
            </li>
          ))}
        </ul>

        {service.note && (
          <p className="text-slate-600 text-[10px] italic mb-3">{service.note}</p>
        )}

        <a
          href={siteConfig.squareBookingUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={`w-full py-2.5 rounded-xl text-xs font-semibold text-center transition-colors ${styles.btn}`}
        >
          {cta}
        </a>
      </div>
    </div>
  );
}
