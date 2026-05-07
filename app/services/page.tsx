"use client";

import { useState } from "react";
import Link from "next/link";
import { services, paintCorrectionServices, addOns, vehicleSizes, vehicleSizeLabels, siteConfig } from "@/lib/config";
import type { VehicleSize } from "@/lib/config";

function PricingDisplay({
  pricing,
  selectedSize,
  note,
  accentClass = "text-white",
}: {
  pricing: Record<VehicleSize, number>;
  selectedSize: VehicleSize;
  note?: string | null;
  accentClass?: string;
}) {
  const others = vehicleSizes.filter((s) => s !== selectedSize);
  return (
    <div className="rounded-xl border border-white/[0.07] bg-white/[0.03] px-5 py-4">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-slate-500 text-xs mb-0.5">{vehicleSizeLabels[selectedSize]}</p>
          <p className={`text-3xl font-bold ${accentClass}`}>${pricing[selectedSize]}</p>
          {note && <p className="text-slate-600 text-[10px] mt-1 italic">{note}</p>}
        </div>
        <div className="flex gap-4">
          {others.map((s) => (
            <div key={s} className="text-center">
              <p className="text-slate-600 text-[10px]">{s}</p>
              <p className="text-slate-500 text-sm font-medium">${pricing[s]}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function ServicesPage() {
  const [selectedSize, setSelectedSize] = useState<VehicleSize>("Mid");

  return (
    <>
      {/* Hero */}
      <div className="pt-28 pb-14 px-4 sm:px-6 relative overflow-hidden">
        <div aria-hidden="true" className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-blue-600/[0.06] rounded-full blur-3xl" />
        <div className="max-w-4xl mx-auto text-center relative">
          <p className="text-blue-400 text-sm font-semibold uppercase tracking-widest mb-3">
            Calgary Mobile Detailing
          </p>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-5 text-balance">
            Services & Pricing
          </h1>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto mb-8">
            All services performed at your location. We bring everything — all we need is a tap and an outlet.
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
      </div>

      {/* Detail Packages */}
      <section className="pb-16 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold text-white mb-8">Detail Packages</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {services.map((service) => (
              <div
                key={service.id}
                className={`rounded-2xl border p-7 flex flex-col gap-5 ${
                  service.badge === "Most Popular"
                    ? "border-blue-500/40 bg-[#0f1b2d]"
                    : service.badge === "Premium"
                    ? "border-amber-500/30 bg-[#0f1b2d]"
                    : "border-white/[0.07] bg-[#0f1829]"
                }`}
              >
                <div>
                  <div className="flex items-center gap-2 flex-wrap mb-2">
                    <h3 className="text-white font-bold text-xl">{service.name}</h3>
                    {service.badge && (
                      <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                        service.badge === "Most Popular"
                          ? "bg-blue-600/20 text-blue-400 border border-blue-500/30"
                          : "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                      }`}>
                        {service.badge}
                      </span>
                    )}
                  </div>
                  <p className="text-slate-400 text-sm leading-relaxed">{service.description}</p>
                </div>

                <PricingDisplay
                  pricing={service.pricing}
                  selectedSize={selectedSize}
                  accentClass={service.badge === "Most Popular" ? "text-blue-400" : service.badge === "Premium" ? "text-amber-400" : "text-white"}
                />

                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                  {service.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2">
                      <svg className={`w-4 h-4 mt-0.5 shrink-0 ${
                        service.badge === "Most Popular" ? "text-blue-400" : service.badge === "Premium" ? "text-amber-400" : "text-blue-500"
                      }`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
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

      {/* Paint Correction & Ceramic Coating */}
      <section className="pb-16 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold text-white mb-2">Paint Correction & Ceramic Coating</h2>
          <p className="text-slate-400 text-sm mb-8">Machine polishing, paint decontamination, and long-term ceramic protection.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {paintCorrectionServices.map((service) => (
              <div
                key={service.id}
                className={`rounded-2xl border p-7 flex flex-col gap-5 ${
                  service.badge === "Premium"
                    ? "border-amber-500/30 bg-[#0f1b2d]"
                    : "border-white/[0.07] bg-[#0f1829]"
                }`}
              >
                <div>
                  <div className="flex items-center gap-2 flex-wrap mb-2">
                    <h3 className="text-white font-bold text-xl">{service.name}</h3>
                    {service.badge && (
                      <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-400 border border-amber-500/30">
                        {service.badge}
                      </span>
                    )}
                  </div>
                  <p className="text-slate-400 text-sm leading-relaxed">{service.description}</p>
                </div>

                <PricingDisplay
                  pricing={service.pricing}
                  selectedSize={selectedSize}
                  note={service.note}
                  accentClass={service.badge === "Premium" ? "text-amber-400" : "text-white"}
                />

                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                  {service.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2">
                      <svg className={`w-4 h-4 mt-0.5 shrink-0 ${service.badge === "Premium" ? "text-amber-400" : "text-blue-500"}`}
                        fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-slate-300 text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  href="/booking"
                  className={`mt-auto py-3 rounded-xl text-sm font-semibold text-center transition-colors ${
                    service.badge === "Premium"
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
