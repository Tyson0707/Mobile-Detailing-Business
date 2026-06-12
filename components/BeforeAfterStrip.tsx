const pairs = [
  { before: "/ba-22-before.jpg", after: "/ba-caip.jpg", label: "Trunk" },
  { before: "/ba-14-before.jpg", after: "/ba-105-after.jpg", label: "Floor Mats" },
  { before: "/ba-24.jpg", after: "/ba-101.jpg", label: "Wheels" },
];

const allItems = [...pairs, ...pairs, ...pairs, ...pairs];

export function BeforeAfterStrip() {
  return (
    <section className="py-14 overflow-hidden" aria-label="Before and after transformations">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 mb-10 text-center">
        <p className="text-blue-400 text-sm font-semibold uppercase tracking-widest mb-3">
          Transformations
        </p>
        <h2 className="text-3xl sm:text-4xl font-bold text-white">
          Every Detail, Before &amp; After
        </h2>
      </div>

      <div className="relative">
        {/* Edge fades */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-[#080d1a] to-transparent z-10" />
        <div aria-hidden="true" className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-[#080d1a] to-transparent z-10" />

        <div
          className="strip-track flex gap-4 lg:gap-8"
          style={{ width: "max-content" }}
        >
          {allItems.map((pair, i) => (
            <div key={i} className="flex items-center gap-2 lg:gap-4 flex-shrink-0">
              {/* Before */}
              <div className="relative overflow-hidden rounded-xl flex-shrink-0 w-[180px] h-[240px] lg:w-[300px] lg:h-[400px]">
                <img
                  src={pair.before}
                  alt={`${pair.label} before detail`}
                  className="w-full h-full object-cover"
                  draggable={false}
                />
                <span className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-full bg-black/60 text-white text-xs font-semibold backdrop-blur-sm">
                  Before
                </span>
                <span className="absolute bottom-2.5 left-2.5 px-2 py-0.5 rounded-full bg-black/50 text-slate-300 text-xs backdrop-blur-sm">
                  {pair.label}
                </span>
              </div>

              {/* Arrow */}
              <svg
                className="text-blue-500 flex-shrink-0"
                width="20"
                height="20"
                viewBox="0 0 22 22"
                fill="none"
              >
                <path
                  d="M4 11h14M11 5l6 6-6 6"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>

              {/* After */}
              <div className="relative overflow-hidden rounded-xl flex-shrink-0 w-[180px] h-[240px] lg:w-[300px] lg:h-[400px]">
                <img
                  src={pair.after}
                  alt={`${pair.label} after detail`}
                  className="w-full h-full object-cover"
                  draggable={false}
                />
                <span className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-full bg-blue-600/85 text-white text-xs font-semibold backdrop-blur-sm">
                  After
                </span>
                <span className="absolute bottom-2.5 left-2.5 px-2 py-0.5 rounded-full bg-black/50 text-slate-300 text-xs backdrop-blur-sm">
                  {pair.label}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
