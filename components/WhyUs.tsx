const reasons = [
  {
    title: "We Come To Your Driveway",
    description:
      "No dropping off. No waiting at a shop. We arrive with our pressure washer, compressed air, vacuums, extractors, and all professional products. All we need from you is access to a tap and an outlet.",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
  {
    title: "Built for Busy People",
    description:
      "Work from home while we detail your car in the driveway. Run errands. Do anything. We're done in 3–4 hours and your car is ready.",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    title: "High Attention to Detail",
    description:
      "We don't rush. Every crevice, vent, and panel gets proper attention. This isn't a quick clean — it's a professional reset.",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
  },
  {
    title: "Professional-Grade Products",
    description:
      "pH-balanced, paint-safe detailing chemicals used by professionals — not the stuff you find at a gas station.",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
      </svg>
    ),
  },
  {
    title: "Flat-Rate Pricing",
    description:
      "The price you see is the price you pay. No surprise charges on the day, no upsells you didn't ask for.",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
  },
  {
    title: "100% Satisfaction Guarantee",
    description:
      "If something isn&apos;t right, we come back and fix it. No arguing, no fees. That&apos;s the deal.",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
    ),
  },
];

export function WhyUs() {
  return (
    <section className="py-20 sm:py-28 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-14 items-start">
          {/* Left */}
          <div>
            <p className="text-blue-400 text-sm font-semibold uppercase tracking-widest mb-3">
              Why Clearline
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-5 text-balance">
              Not a car wash. A proper detail.
            </h2>
            <p className="text-slate-400 text-lg leading-relaxed mb-8">
              We&apos;re not a drive-through. We don&apos;t rush 30 cars a day. Every booking gets our full attention — the right products, the right technique, and enough time to do it properly.
            </p>
            <div className="p-5 rounded-xl bg-blue-600/[0.08] border border-blue-500/[0.15]">
              <p className="text-slate-300 text-sm leading-relaxed italic mb-3">
                &ldquo;We built Clearline because every time we took a car to a shop, it came back with rushed work and swirl marks on the paint. There&apos;s a better way — and it starts in your driveway.&rdquo;
              </p>
              <p className="text-blue-400 text-sm font-medium">— Clearline Auto Detail</p>
            </div>
          </div>

          {/* Right: grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {reasons.map((reason) => (
              <div
                key={reason.title}
                className="p-4 rounded-xl bg-[#0f1829] border border-white/[0.06] hover:border-blue-500/20 transition-colors"
              >
                <div className="w-9 h-9 rounded-lg bg-blue-600/[0.12] flex items-center justify-center text-blue-400 mb-3">
                  {reason.icon}
                </div>
                <h3 className="text-white text-sm font-semibold mb-1.5">{reason.title}</h3>
                <p className="text-slate-500 text-xs leading-relaxed">{reason.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
