const reasons = [
  {
    title: "Truly Mobile — We Come To You",
    description:
      "No dropping off your car, no waiting in a shop. We arrive at your home, workplace, or wherever you park — with all water, power, and equipment.",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
  },
  {
    title: "Professional-Grade Products",
    description:
      "We only use pH-balanced, paint-safe detailing products — the same brands trusted by professional detailers across Canada.",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
  },
  {
    title: "Fully Insured & Accountable",
    description:
      "We carry full liability insurance. Your vehicle is in safe hands — if something goes wrong (it won&apos;t), you&apos;re covered.",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
  },
  {
    title: "100% Satisfaction Guarantee",
    description:
      "Not happy? We come back and fix it — free of charge. Your satisfaction is the only result we'll accept.",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
    ),
  },
  {
    title: "Calgary Weather Experts",
    description:
      "We know Calgary winters. Our detailing methods protect against road salt, UV, and the extreme temperature swings that damage your paint.",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
      </svg>
    ),
  },
  {
    title: "Transparent, Flat-Rate Pricing",
    description:
      "No surprise fees. The price you see is the price you pay — with no hidden charges for standard vehicles.",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
];

export function WhyUs() {
  return (
    <section className="py-20 sm:py-28 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Left: text */}
          <div>
            <p className="text-blue-400 text-sm font-semibold uppercase tracking-widest mb-3">
              Why Clear Line
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-5 text-balance">
              Not just another car wash
            </h2>
            <p className="text-slate-400 text-lg leading-relaxed mb-8">
              We built Clear Line Auto Detail because we got tired of overpriced shops that rush cars through and leave swirl marks on your paint. Every detail we perform gets our full attention — from the first panel to the last.
            </p>

            {/* Mini quote */}
            <div className="p-5 rounded-xl bg-blue-600/[0.08] border border-blue-500/[0.15]">
              <p className="text-slate-300 text-sm leading-relaxed italic mb-3">
                &ldquo;Our goal is simple: make your car look better than it ever has — and make the whole process easier than stopping for gas.&rdquo;
              </p>
              <p className="text-blue-400 text-sm font-medium">— Clear Line Auto Detail</p>
            </div>
          </div>

          {/* Right: reasons grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {reasons.map((reason) => (
              <div
                key={reason.title}
                className="p-4 rounded-xl bg-[#0f1829] border border-white/[0.06] hover:border-blue-500/20 transition-colors"
              >
                <div className="w-9 h-9 rounded-lg bg-blue-600/[0.12] flex items-center justify-center text-blue-400 mb-3">
                  {reason.icon}
                </div>
                <h3 className="text-white text-sm font-semibold mb-1.5">
                  {reason.title}
                </h3>
                <p className="text-slate-500 text-xs leading-relaxed">
                  {reason.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
