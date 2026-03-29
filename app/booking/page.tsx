import type { Metadata } from "next";
import Link from "next/link";
import { services, siteConfig } from "@/lib/config";

export const metadata: Metadata = {
  title: "Book a Detail | Clearline Auto Detail Calgary",
  description:
    "Book your mobile car detailing appointment online with Clearline Auto Detail. Serving NW Calgary, Bearspaw, Tuscany, Rocky Ridge, and Watermark.",
  alternates: {
    canonical: `${siteConfig.url}/booking`,
  },
};

export default function BookingPage() {
  return (
    <div className="min-h-screen pt-20">
      {/* Header */}
      <div className="pt-12 pb-16 px-4 sm:px-6 relative overflow-hidden">
        <div
          aria-hidden="true"
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-blue-600/[0.07] rounded-full blur-3xl"
        />
        <div className="max-w-2xl mx-auto text-center relative">
          <p className="text-blue-400 text-sm font-semibold uppercase tracking-widest mb-3">
            Online Booking
          </p>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-5 text-balance">
            Book Your Detail
          </h1>
          <p className="text-slate-400 text-lg mb-10">
            Pick your service, choose a date and time, and lock it in. We&apos;ll come to you.
          </p>

          {/* Primary CTA */}
          <a
            href={siteConfig.squareBookingUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-3 px-10 py-5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-2xl transition-all hover:shadow-xl hover:shadow-blue-600/25 text-lg w-full sm:w-auto"
          >
            Open Booking Calendar
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>

          <p className="text-slate-600 text-sm mt-4">
            Powered by Square · Secure · Card saved on file
          </p>
        </div>
      </div>

      {/* Trust bar */}
      <div className="pb-14 px-4 sm:px-6">
        <div className="max-w-2xl mx-auto">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { icon: "✓", text: "Card held on file" },
              { icon: "✓", text: "Free cancellation 24hrs+" },
              { icon: "✓", text: "We come to you" },
              { icon: "✓", text: "100% satisfaction" },
            ].map((item) => (
              <div
                key={item.text}
                className="flex flex-col items-center gap-1.5 p-4 rounded-xl bg-[#0f1829] border border-white/[0.06] text-center"
              >
                <span className="text-blue-400 font-bold text-lg">{item.icon}</span>
                <span className="text-slate-400 text-xs">{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Pricing reminder */}
      <div className="pb-16 px-4 sm:px-6">
        <div className="max-w-2xl mx-auto">
          <div className="rounded-2xl bg-[#0f1829] border border-white/[0.07] p-7">
            <h2 className="text-white font-semibold mb-5 text-center">Starting Prices</h2>
            <div className="grid grid-cols-2 gap-3">
              {services.map((s) => (
                <div
                  key={s.id}
                  className={`p-4 rounded-xl border flex items-center justify-between gap-2 ${
                    s.badge === "Most Popular"
                      ? "border-blue-500/30 bg-blue-600/[0.06]"
                      : "border-white/[0.06] bg-white/[0.02]"
                  }`}
                >
                  <div>
                    <p className="text-white text-sm font-medium">{s.name}</p>
                    {s.badge && (
                      <p className="text-blue-400 text-[10px]">{s.badge}</p>
                    )}
                  </div>
                  <p className="text-white font-bold text-sm shrink-0">
                    from ${s.pricing.Small}
                  </p>
                </div>
              ))}
            </div>
            <div className="text-center mt-5">
              <Link
                href="/services"
                className="text-blue-400 text-sm hover:text-blue-300 transition-colors"
              >
                Full pricing by vehicle size →
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Contact fallback */}
      <div className="pb-24 px-4 sm:px-6">
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-slate-500 text-sm mb-3">Prefer to reach out directly?</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href={`tel:${siteConfig.phoneRaw}`}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-white/[0.05] border border-white/[0.08] text-white text-sm font-medium hover:bg-white/[0.08] transition-colors"
            >
              <svg className="w-4 h-4 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              {siteConfig.phone}
            </a>
            <a
              href={`mailto:${siteConfig.email}`}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-white/[0.05] border border-white/[0.08] text-white text-sm font-medium hover:bg-white/[0.08] transition-colors"
            >
              <svg className="w-4 h-4 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              {siteConfig.email}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
