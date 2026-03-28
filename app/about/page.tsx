import type { Metadata } from "next";
import Link from "next/link";
import { siteConfig } from "@/lib/config";

export const metadata: Metadata = {
  title: "About | Clearline Auto Detail — NW Calgary Mobile Detailing",
  description:
    "Clearline Auto Detail is a mobile car detailing service based in NW Calgary. We come to your driveway with everything we need — no shop, no drop-off, just professional results.",
  alternates: {
    canonical: `${siteConfig.url}/about`,
  },
};

const values = [
  {
    title: "We don't rush",
    description:
      "Every booking is given proper time. We're not processing 30 cars a day — we focus on the vehicle in front of us.",
  },
  {
    title: "Right products, right technique",
    description:
      "pH-balanced, paint-safe chemicals. Proper wash method. No shortcuts that damage your paint over time.",
  },
  {
    title: "We leave no trace",
    description:
      "All wastewater is managed, products are cleaned up, and your driveway is left exactly as we found it.",
  },
  {
    title: "Straightforward pricing",
    description:
      "What you see is what you pay. No surprise charges on the day of service.",
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen pt-20">
      {/* Hero */}
      <div className="pt-12 pb-16 px-4 sm:px-6 relative overflow-hidden">
        <div aria-hidden="true" className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-blue-600/[0.06] rounded-full blur-3xl" />
        <div className="max-w-3xl mx-auto text-center relative">
          <p className="text-blue-400 text-sm font-semibold uppercase tracking-widest mb-3">
            About Us
          </p>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6 text-balance">
            We detail cars the way they should be detailed.
          </h1>
          <p className="text-slate-400 text-lg leading-relaxed">
            Clearline Auto Detail is a mobile car detailing service serving NW Calgary and surrounding areas. We come to you — fully equipped, fully prepared, and focused on one thing: making your car look its best.
          </p>
        </div>
      </div>

      {/* Our Story */}
      <section className="pb-20 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-10 items-start">
            <div>
              <h2 className="text-2xl font-bold text-white mb-5">Why we started</h2>
              <div className="space-y-4 text-slate-400 text-base leading-relaxed">
                <p>
                  We got tired of paying for details that weren&apos;t actually detailed. Cars coming back from shops with missed spots, swirl marks in the paint, and interiors that looked wiped down rather than cleaned.
                </p>
                <p>
                  We built Clearline to do it differently — mobile, focused, and done right. No rushed shop rotations. We come to your driveway, take the time the vehicle needs, and don&apos;t leave until the result is genuinely good.
                </p>
                <p>
                  Our clients are homeowners in NW Calgary and surrounding communities who value their vehicles and their time. They want a clean car and they don&apos;t want to deal with the hassle of getting it there.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="p-6 rounded-2xl bg-[#0f1829] border border-white/[0.07]">
                <h3 className="text-white font-semibold mb-3">Who we serve</h3>
                <ul className="space-y-2">
                  {[
                    "Homeowners in NW Calgary, Bearspaw, Watermark, Rocky Ridge, Tuscany",
                    "Busy professionals and families who value convenience",
                    "People who want their car properly cleaned — not just wiped down",
                    "Anyone who&apos;s been disappointed by a shop or automated car wash",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2.5">
                      <svg className="w-4 h-4 mt-0.5 text-blue-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-slate-400 text-sm">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-6 rounded-2xl bg-blue-600/[0.08] border border-blue-500/[0.15]">
                <p className="text-slate-300 text-sm leading-relaxed italic mb-3">
                  &ldquo;We come prepared, we work carefully, and we don&apos;t leave until you&apos;re satisfied with what you see. That&apos;s the standard we hold ourselves to on every booking.&rdquo;
                </p>
                <p className="text-blue-400 text-sm font-medium">— Clearline Auto Detail</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="pb-20 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-white mb-8 text-center">How we work</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {values.map((value) => (
              <div
                key={value.title}
                className="p-5 rounded-xl bg-[#0f1829] border border-white/[0.07]"
              >
                <h3 className="text-white font-semibold mb-2">{value.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Service area */}
      <section className="pb-20 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <div className="rounded-2xl bg-[#0f1829] border border-white/[0.07] p-7">
            <h2 className="text-xl font-bold text-white mb-2">Where we work</h2>
            <p className="text-slate-400 text-sm mb-5">
              We&apos;re based in NW Calgary and cover the following areas. Not sure if you&apos;re in range? Just ask.
            </p>
            <div className="flex flex-wrap gap-2">
              {siteConfig.serviceAreas.map((area) => (
                <span
                  key={area}
                  className="px-3 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.07] text-slate-300 text-sm"
                >
                  {area}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="pb-24 px-4 sm:px-6">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-white mb-4">
            Ready to see what a proper detail looks like?
          </h2>
          <p className="text-slate-400 mb-6 text-sm">
            Book online in 2 minutes. We&apos;ll confirm within a few hours.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/booking"
              className="px-7 py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl transition-colors text-sm"
            >
              Book Now
            </Link>
            <Link
              href="/services"
              className="px-7 py-3.5 bg-white/[0.06] hover:bg-white/[0.1] border border-white/[0.08] text-white font-semibold rounded-xl transition-colors text-sm"
            >
              View Services
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
