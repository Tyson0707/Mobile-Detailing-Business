"use client";

import { useState } from "react";

const galleryItems = [
  {
    id: 1,
    before: "/before1.jpg",
    after: "/after1.png",
    label: "Toyota RAV4 — Interior Reset",
    description: "Floor mats, carpet, dash, doors — full interior clean.",
  },
];

export function Gallery() {
  const [active, setActive] = useState<{ [key: number]: "before" | "after" }>({
    1: "before",
  });

  return (
    <section className="py-20 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <p className="text-blue-400 text-sm font-semibold uppercase tracking-widest mb-3">
            Results
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Before & After
          </h2>
          <p className="text-slate-400 max-w-xl mx-auto">
            Real cars. Real results. No filters, no staging.
          </p>
        </div>

        {/* Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {galleryItems.map((item) => (
            <div
              key={item.id}
              className="rounded-2xl overflow-hidden bg-[#0f1829] border border-white/[0.07]"
            >
              {/* Image */}
              <div className="relative aspect-[4/3] overflow-hidden">
                <img
                  src={active[item.id] === "before" ? item.before : item.after}
                  alt={`${active[item.id] === "before" ? "Before" : "After"} — ${item.label}`}
                  className="w-full h-full object-cover transition-opacity duration-300"
                />
                {/* Before/After badge */}
                <div className="absolute top-3 left-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${
                    active[item.id] === "before"
                      ? "bg-red-500/80 text-white"
                      : "bg-green-500/80 text-white"
                  }`}>
                    {active[item.id] === "before" ? "Before" : "After"}
                  </span>
                </div>
              </div>

              {/* Toggle + Info */}
              <div className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="text-white font-semibold text-sm">{item.label}</p>
                    <p className="text-slate-500 text-xs mt-0.5">{item.description}</p>
                  </div>
                  {/* Toggle */}
                  <div className="flex rounded-lg overflow-hidden border border-white/[0.08] shrink-0">
                    <button
                      onClick={() => setActive((p) => ({ ...p, [item.id]: "before" }))}
                      className={`px-4 py-1.5 text-xs font-semibold transition-colors ${
                        active[item.id] === "before"
                          ? "bg-white/10 text-white"
                          : "text-slate-400 hover:text-white"
                      }`}
                    >
                      Before
                    </button>
                    <button
                      onClick={() => setActive((p) => ({ ...p, [item.id]: "after" }))}
                      className={`px-4 py-1.5 text-xs font-semibold transition-colors ${
                        active[item.id] === "after"
                          ? "bg-white/10 text-white"
                          : "text-slate-400 hover:text-white"
                      }`}
                    >
                      After
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
