import { siteConfig } from "@/lib/config";

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* ─── HERO BACKGROUND ──────────────────────────────────────────────
          When your photo or video is ready, replace the gradient placeholder
          below with one of these and delete the placeholder div.

          Landscape photo:
            <img
              src="/hero.jpg"
              alt="Clear Line Auto Detail"
              className="absolute inset-0 w-full h-full object-cover object-center"
            />

          Looping video / GIF-style clip:
            <video autoPlay muted loop playsInline
              className="absolute inset-0 w-full h-full object-cover object-center">
              <source src="/hero.mp4" type="video/mp4" />
            </video>
      ──────────────────────────────────────────────────────────────────── */}

      {/* Gradient placeholder — remove once real media is added above */}
      <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-b from-[#060b18] via-[#080d1a] to-[#080d1a]">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[700px] bg-blue-600/[0.07] rounded-full blur-3xl" />
        <div
          className="absolute inset-0 opacity-[0.015]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)",
            backgroundSize: "64px 64px",
          }}
        />
      </div>

      {/* Dark overlay — keeps text legible over any photo or video background */}
      <div aria-hidden="true" className="absolute inset-0 bg-black/45" />

      {/* Bottom fade to page background */}
      <div aria-hidden="true" className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-[#080d1a] to-transparent" />

      {/* Content */}
      <div className="relative z-10 w-full max-w-4xl mx-auto px-4 sm:px-6 py-32 sm:py-40 text-center">
        {/* Google rating badge */}
        <a
          href={siteConfig.social.google}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-white/[0.08] border border-white/[0.12] backdrop-blur-sm mb-5 hover:bg-white/[0.13] transition-colors"
        >
          {/* Google G logo */}
          <svg width="15" height="15" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="shrink-0">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          <span className="text-yellow-400 text-sm font-bold tracking-wide">★★★★★</span>
          <span className="text-white/80 text-xs font-medium">5.0 · 10 Google Reviews</span>
        </a>

        {/* Location tag */}
        <div className="flex items-center justify-center gap-2 mb-6">
          <svg className="w-3.5 h-3.5 text-blue-400 shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
          </svg>
          <span className="text-blue-300 text-xs font-medium">
            Calgary · Airdrie · Cochrane · Chestermere · Okotoks
          </span>
        </div>

        {/* Headline */}
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-[1.08] tracking-tight mb-5 text-balance">
          Your car deserves{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-sky-300">
            better than a drive-through wash.
          </span>
        </h1>

        <p className="text-slate-300 text-lg sm:text-xl leading-relaxed mb-8 max-w-2xl mx-auto">
          We come to your driveway with everything we need — professional products, expert technique, and a full reset at your door. No drop-off. No hassle.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center mb-10">
          <a
            href={siteConfig.squareBookingUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl transition-all hover:shadow-lg hover:shadow-blue-600/30 text-base"
          >
            Book Now
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
          <a
            href={`tel:${siteConfig.phoneRaw}`}
            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/[0.08] hover:bg-white/[0.13] border border-white/[0.15] text-white font-semibold rounded-xl transition-colors text-base backdrop-blur-sm"
          >
            <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
            {siteConfig.phone}
          </a>
        </div>

        {/* Trust signals */}
        <div className="flex flex-wrap gap-x-6 gap-y-2.5 justify-center">
          {[
            "All you need is a tap & outlet",
            "100% satisfaction guarantee",
            "Flat-rate pricing, no surprises",
          ].map((item) => (
            <div key={item} className="flex items-center gap-2">
              <svg className="w-4 h-4 text-blue-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-slate-300 text-sm">{item}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll hint */}
      <div className="hidden sm:flex flex-col items-center gap-2 absolute bottom-10 left-1/2 -translate-x-1/2 z-10">
        <span className="text-slate-500 text-xs">Scroll</span>
        <div className="w-5 h-8 rounded-full border border-slate-700 flex items-start justify-center p-1.5">
          <div className="w-1 h-1.5 bg-blue-500 rounded-full animate-bounce" />
        </div>
      </div>
    </section>
  );
}
