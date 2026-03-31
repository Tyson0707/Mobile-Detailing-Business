"use client";

import { useState, useRef, useCallback } from "react";

const galleryItems = [
  { id: 1, before: "/before1.jpg", after: "/after1.png" },
];

function BeforeAfterSlider({ before, after }: { before: string; after: string }) {
  const [position, setPosition] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

  const updatePosition = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    setPosition((x / rect.width) * 100);
  }, []);

  const onMouseDown = () => {
    dragging.current = true;
    const onMove = (e: MouseEvent) => { if (dragging.current) updatePosition(e.clientX); };
    const onUp = () => { dragging.current = false; window.removeEventListener("mousemove", onMove); window.removeEventListener("mouseup", onUp); };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
  };

  const onTouchMove = (e: React.TouchEvent) => updatePosition(e.touches[0].clientX);

  return (
    <div
      ref={containerRef}
      className="relative aspect-[4/3] overflow-hidden rounded-2xl cursor-col-resize select-none"
      onMouseDown={onMouseDown}
      onTouchMove={onTouchMove}
    >
      {/* Before image — left side, clipped from the right */}
      <img
        src={before}
        alt="Before"
        className="absolute inset-0 w-full h-full object-cover"
        style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}
        draggable={false}
      />

      {/* After image — right side, clipped from the left */}
      <img
        src={after}
        alt="After"
        className="absolute inset-0 w-full h-full object-cover"
        style={{ clipPath: `inset(0 0 0 ${position}%)` }}
        draggable={false}
      />

      {/* Divider line */}
      <div className="absolute top-0 bottom-0 w-0.5 bg-white shadow-lg" style={{ left: `${position}%` }}>
        {/* Handle */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white shadow-xl flex items-center justify-center">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M6 4L2 9L6 14M12 4L16 9L12 14" stroke="#1e293b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </div>

      {/* Labels */}
      <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-black/50 text-white text-xs font-semibold backdrop-blur-sm">Before</div>
      <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-black/50 text-white text-xs font-semibold backdrop-blur-sm">After</div>
    </div>
  );
}

export function Gallery() {
  return (
    <section className="py-20 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-blue-400 text-sm font-semibold uppercase tracking-widest mb-3">Results</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Before & After</h2>
          <p className="text-slate-400 max-w-xl mx-auto">Real cars. Real results. No filters, no staging.</p>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          {galleryItems.map((item) => (
            <BeforeAfterSlider key={item.id} before={item.before} after={item.after} />
          ))}
        </div>
      </div>
    </section>
  );
}
