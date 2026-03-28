"use client";

import type { Metadata } from "next";
import { useState } from "react";
import Link from "next/link";
import { services, siteConfig } from "@/lib/config";

// Note: metadata export doesn't work in "use client" files.
// Move metadata to a parent layout or use a separate server component wrapper if needed.

const vehicleTypes = ["Sedan / Coupe", "SUV / Crossover", "Truck", "Full-size SUV / Van", "Other"];

export default function BookingPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    service: "",
    vehicleType: "",
    vehicleYear: "",
    vehicleMake: "",
    preferredDate: "",
    address: "",
    message: "",
  });
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("submitting");

    // Compose mailto link as fallback — replace with API route / Square when ready
    const subject = encodeURIComponent(`Booking Request — ${formData.service || "Detailing"}`);
    const body = encodeURIComponent(
      `Name: ${formData.name}\nEmail: ${formData.email}\nPhone: ${formData.phone}\n\nService: ${formData.service}\nVehicle: ${formData.vehicleYear} ${formData.vehicleMake} (${formData.vehicleType})\nPreferred Date: ${formData.preferredDate}\nAddress: ${formData.address}\n\nNotes:\n${formData.message}`
    );
    window.location.href = `mailto:${siteConfig.email}?subject=${subject}&body=${body}`;
    setStatus("success");
  };

  const inputClass =
    "w-full bg-[#0f1829] border border-white/[0.08] rounded-xl px-4 py-3 text-white text-sm placeholder-slate-600 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/30 transition-colors";
  const labelClass = "block text-slate-300 text-xs font-medium mb-1.5";

  return (
    <div className="min-h-screen pt-20">
      {/* Header */}
      <div className="pt-10 pb-12 px-4 sm:px-6 relative overflow-hidden">
        <div aria-hidden="true" className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-blue-600/[0.06] rounded-full blur-3xl" />
        <div className="max-w-3xl mx-auto text-center relative">
          <p className="text-blue-400 text-sm font-semibold uppercase tracking-widest mb-3">
            Step 1 of 1
          </p>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            Book Your Detail
          </h1>
          <p className="text-slate-400 text-lg">
            Fill out the form below and we&apos;ll confirm your booking within a few hours. Takes less than 2 minutes.
          </p>
        </div>
      </div>

      <div className="pb-24 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-3 gap-8 items-start">

          {/* Form */}
          <div className="lg:col-span-2">
            {status === "success" ? (
              <div className="rounded-2xl bg-[#0f1829] border border-green-500/30 p-10 text-center">
                <div className="w-16 h-16 rounded-full bg-green-500/10 border border-green-500/30 flex items-center justify-center mx-auto mb-5">
                  <svg className="w-8 h-8 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h2 className="text-white text-2xl font-bold mb-3">Booking Request Sent!</h2>
                <p className="text-slate-400 mb-6">
                  We&apos;ll confirm your appointment within a few hours. Check your email for a confirmation.
                </p>
                <Link
                  href="/"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-sm font-semibold transition-colors"
                >
                  Back to Home
                </Link>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="rounded-2xl bg-[#0f1829] border border-white/[0.07] p-7 sm:p-9 space-y-6"
              >
                {/* Contact info */}
                <div>
                  <h2 className="text-white font-semibold mb-5 flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center text-xs font-bold">1</span>
                    Your Contact Info
                  </h2>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className={labelClass} htmlFor="name">Full Name *</label>
                      <input
                        id="name"
                        name="name"
                        type="text"
                        required
                        className={inputClass}
                        placeholder="John Smith"
                        value={formData.name}
                        onChange={handleChange}
                      />
                    </div>
                    <div>
                      <label className={labelClass} htmlFor="phone">Phone *</label>
                      <input
                        id="phone"
                        name="phone"
                        type="tel"
                        required
                        className={inputClass}
                        placeholder="(587) 000-0000"
                        value={formData.phone}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className={labelClass} htmlFor="email">Email *</label>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        required
                        className={inputClass}
                        placeholder="you@email.com"
                        value={formData.email}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </div>

                {/* Vehicle */}
                <div className="border-t border-white/[0.06] pt-6">
                  <h2 className="text-white font-semibold mb-5 flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center text-xs font-bold">2</span>
                    Your Vehicle
                  </h2>
                  <div className="grid sm:grid-cols-3 gap-4">
                    <div>
                      <label className={labelClass} htmlFor="vehicleYear">Year</label>
                      <input
                        id="vehicleYear"
                        name="vehicleYear"
                        type="text"
                        className={inputClass}
                        placeholder="2022"
                        value={formData.vehicleYear}
                        onChange={handleChange}
                      />
                    </div>
                    <div>
                      <label className={labelClass} htmlFor="vehicleMake">Make & Model</label>
                      <input
                        id="vehicleMake"
                        name="vehicleMake"
                        type="text"
                        className={inputClass}
                        placeholder="Toyota RAV4"
                        value={formData.vehicleMake}
                        onChange={handleChange}
                      />
                    </div>
                    <div>
                      <label className={labelClass} htmlFor="vehicleType">Vehicle Type</label>
                      <select
                        id="vehicleType"
                        name="vehicleType"
                        className={inputClass}
                        value={formData.vehicleType}
                        onChange={handleChange}
                      >
                        <option value="">Select type</option>
                        {vehicleTypes.map((t) => (
                          <option key={t} value={t}>{t}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Service */}
                <div className="border-t border-white/[0.06] pt-6">
                  <h2 className="text-white font-semibold mb-5 flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center text-xs font-bold">3</span>
                    Service & Scheduling
                  </h2>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className={labelClass} htmlFor="service">Service *</label>
                      <select
                        id="service"
                        name="service"
                        required
                        className={inputClass}
                        value={formData.service}
                        onChange={handleChange}
                      >
                        <option value="">Select a service</option>
                        {services.map((s) => (
                          <option key={s.id} value={s.name}>
                            {s.name} — {s.price}
                          </option>
                        ))}
                        <option value="Not sure — need recommendation">
                          Not sure — need a recommendation
                        </option>
                      </select>
                    </div>
                    <div>
                      <label className={labelClass} htmlFor="preferredDate">Preferred Date</label>
                      <input
                        id="preferredDate"
                        name="preferredDate"
                        type="date"
                        className={inputClass}
                        value={formData.preferredDate}
                        onChange={handleChange}
                        min={new Date().toISOString().split("T")[0]}
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className={labelClass} htmlFor="address">Service Location (Address) *</label>
                      <input
                        id="address"
                        name="address"
                        type="text"
                        required
                        className={inputClass}
                        placeholder="123 Main St NW, Calgary, AB"
                        value={formData.address}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </div>

                {/* Notes */}
                <div className="border-t border-white/[0.06] pt-6">
                  <label className={labelClass} htmlFor="message">Additional Notes (optional)</label>
                  <textarea
                    id="message"
                    name="message"
                    rows={4}
                    className={`${inputClass} resize-none`}
                    placeholder="Any specific concerns, pet hair, heavy staining, or questions..."
                    value={formData.message}
                    onChange={handleChange}
                  />
                </div>

                <button
                  type="submit"
                  disabled={status === "submitting"}
                  className="w-full py-4 bg-blue-600 hover:bg-blue-500 disabled:opacity-70 text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2"
                >
                  {status === "submitting" ? (
                    <>
                      <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Sending...
                    </>
                  ) : (
                    <>
                      Send Booking Request
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </>
                  )}
                </button>

                <p className="text-slate-500 text-xs text-center">
                  We&apos;ll confirm your booking within a few hours. Secure payment collected after service via Square.
                </p>
              </form>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-5">
            {/* Contact card */}
            <div className="rounded-2xl bg-[#0f1829] border border-white/[0.07] p-6">
              <h3 className="text-white font-semibold mb-4">Prefer to call?</h3>
              <a
                href={`tel:${siteConfig.phoneRaw}`}
                className="flex items-center gap-3 text-blue-400 font-medium hover:text-blue-300 transition-colors mb-4"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                {siteConfig.phone}
              </a>
              <p className="text-slate-500 text-sm">Mon–Fri: 8am–6pm<br />Sat–Sun: 9am–4pm</p>
            </div>

            {/* Pricing quick ref */}
            <div className="rounded-2xl bg-[#0f1829] border border-white/[0.07] p-6">
              <h3 className="text-white font-semibold mb-4">Quick Pricing</h3>
              <ul className="space-y-3">
                {services.map((s) => (
                  <li key={s.id} className="flex items-center justify-between gap-2">
                    <span className="text-slate-400 text-sm">{s.name}</span>
                    <span className="text-white font-semibold text-sm">{s.price}</span>
                  </li>
                ))}
              </ul>
              <Link href="/services" className="block text-center mt-4 text-blue-400 text-sm hover:text-blue-300 transition-colors">
                View full pricing →
              </Link>
            </div>

            {/* Trust */}
            <div className="rounded-2xl bg-blue-600/[0.07] border border-blue-500/[0.15] p-6">
              <h3 className="text-white font-semibold mb-4">Our Promise</h3>
              <ul className="space-y-3">
                {[
                  "100% satisfaction guarantee",
                  "We bring all equipment",
                  "Secure Square payment",
                  "Fully insured",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-2.5">
                    <svg className="w-4 h-4 text-blue-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-slate-300 text-sm">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
