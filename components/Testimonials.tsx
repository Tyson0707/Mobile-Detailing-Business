"use client";

import { useState } from "react";
import { testimonials } from "@/lib/config";

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          className={`w-4 h-4 ${i < rating ? "text-amber-400" : "text-slate-600"}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

export function Testimonials() {
  const [index, setIndex] = useState(0);
  const total = testimonials.length;

  const prev = () => setIndex((i) => (i - 1 + total) % total);
  const next = () => setIndex((i) => (i + 1) % total);

  const review = testimonials[index];

  return (
    <section className="py-20 sm:py-28 px-4 sm:px-6 relative">
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[#0a0f1e]/50" />
      </div>

      <div className="max-w-3xl mx-auto relative">
        {/* Header */}
        <div className="text-center mb-14">
          <p className="text-blue-400 text-sm font-semibold uppercase tracking-widest mb-3">
            Reviews
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4 text-balance">
            What Calgary Drivers Say
          </h2>
          {/* Aggregate */}
          <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-amber-500/[0.08] border border-amber-500/20">
            <div className="flex gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <svg key={i} className="w-4 h-4 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <span className="text-amber-300 text-sm font-semibold">5.0</span>
            <span className="text-slate-400 text-sm">· 14 Google reviews</span>
          </div>
        </div>

        {/* Carousel */}
        <div className="relative">
          {/* Card */}
          <div className="glass rounded-2xl p-8 sm:p-10 flex flex-col gap-6 min-h-[260px]">
            <StarRating rating={review.rating} />
            <p className="text-slate-300 text-base sm:text-lg leading-relaxed flex-1">
              &ldquo;{review.text}&rdquo;
            </p>
            <div className="border-t border-white/[0.06] pt-5">
              <p className="text-white text-sm font-semibold">{review.name}</p>
              <p className="text-slate-500 text-xs mt-0.5">{review.location}</p>
            </div>
          </div>

          {/* Arrows */}
          <button
            onClick={prev}
            aria-label="Previous review"
            className="absolute -left-4 sm:-left-6 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/[0.06] border border-white/[0.10] flex items-center justify-center text-white hover:bg-white/[0.12] transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={next}
            aria-label="Next review"
            className="absolute -right-4 sm:-right-6 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/[0.06] border border-white/[0.10] flex items-center justify-center text-white hover:bg-white/[0.12] transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* Dot indicators */}
        <div className="flex justify-center gap-2 mt-6">
          {testimonials.map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              aria-label={`Go to review ${i + 1}`}
              className={`w-2 h-2 rounded-full transition-colors ${
                i === index ? "bg-blue-400" : "bg-white/20"
              }`}
            />
          ))}
        </div>

        {/* Google CTA */}
        <div className="text-center mt-10 flex flex-col sm:flex-row gap-3 justify-center">
          <a
            href="https://www.google.com/maps?cid=0x8c9be2722faee599:0xf8e16a59b7838f60"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-white/[0.06] border border-white/[0.08] text-white text-sm font-medium hover:bg-white/[0.1] transition-colors"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            View Google Reviews
          </a>
          <a
            href="https://search.google.com/local/writereview?placeid=0x8c9be2722faee599:0xf8e16a59b7838f60"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-blue-600/20 border border-blue-500/30 text-blue-300 text-sm font-medium hover:bg-blue-600/30 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
            </svg>
            Leave a Review
          </a>
        </div>
      </div>
    </section>
  );
}
