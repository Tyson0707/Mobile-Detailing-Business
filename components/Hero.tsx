import Link from "next/link";
import { siteConfig } from "@/lib/config";

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden pt-16">
      {/* Background gradients */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
      >
        {/* Main radial glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[600px] bg-blue-600/[0.07] rounded-full blur-3xl" />
        {/* Bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-[#080d1a] to-transparent" />
        {/* Grid */}
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-20 sm:py-28 w-full">
        <div className="max-w-3xl">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-600/[0.12] border border-blue-500/[0.2] mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
            <span className="text-blue-300 text-xs font-medium">
              Now serving Calgary & surrounding areas
            </span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-[1.1] tracking-tight mb-6 text-balance">
            Premium Mobile Car Detailing{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-300">
              That Comes To You
            </span>
          </h1>

          <p className="text-slate-300 text-lg sm:text-xl leading-relaxed mb-8 max-w-xl">
            Calgary&apos;s top-rated mobile detailing service. We bring professional-grade equipment and detailing expertise straight to your driveway — no drop-off, no waiting.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-3 mb-12">
            <Link
              href="/booking"
              className="inline-flex items-center justify-center gap-2 px-7 py-4 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl transition-all hover:shadow-lg hover:shadow-blue-600/25 text-base"
            >
              Book Your Detail
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
            <Link
              href="/services"
              className="inline-flex items-center justify-center gap-2 px-7 py-4 bg-white/[0.06] hover:bg-white/[0.1] border border-white/[0.1] text-white font-semibold rounded-xl transition-colors text-base"
            >
              See Pricing
            </Link>
          </div>

          {/* Quick trust signals */}
          <div className="flex flex-wrap gap-x-6 gap-y-3">
            {[
              { icon: "✓", text: "We bring everything — water, equipment, products" },
              { icon: "✓", text: "100% satisfaction guarantee" },
              { icon: "✓", text: "Fully insured" },
            ].map((item) => (
              <div key={item.text} className="flex items-center gap-2">
                <span className="text-blue-400 font-bold">{item.icon}</span>
                <span className="text-slate-400 text-sm">{item.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Stats card — bottom right on desktop */}
        <div className="mt-14 lg:mt-0 lg:absolute lg:right-0 lg:top-1/2 lg:-translate-y-1/2 grid grid-cols-2 gap-3 max-w-xs">
          {siteConfig.stats.map((stat) => (
            <div
              key={stat.label}
              className="glass rounded-xl p-4 text-center"
            >
              <div className="text-2xl font-bold text-white mb-0.5">
                {stat.value}
              </div>
              <div className="text-slate-400 text-xs leading-snug">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Scroll hint */}
        <div className="hidden sm:flex flex-col items-center gap-2 absolute bottom-8 left-1/2 -translate-x-1/2">
          <span className="text-slate-600 text-xs">Scroll to explore</span>
          <div className="w-5 h-8 rounded-full border border-slate-700 flex items-start justify-center p-1">
            <div className="w-1 h-2 bg-blue-500 rounded-full animate-bounce" />
          </div>
        </div>
      </div>
    </section>
  );
}
