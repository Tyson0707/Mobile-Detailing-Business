import Link from "next/link";
import { siteConfig } from "@/lib/config";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-[#050a14] border-t border-white/[0.05]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 lg:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">

          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Link href="/" className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center shrink-0">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M8 1.5L13 5.5V13H3V5.5L8 1.5Z" stroke="white" strokeWidth="1.5" strokeLinejoin="round" />
                  <path d="M5.5 13V9.5H10.5V13" stroke="white" strokeWidth="1.5" strokeLinejoin="round" />
                </svg>
              </div>
              <div className="leading-none">
                <span className="text-white font-semibold text-sm block">Clearline</span>
                <span className="text-blue-400 text-[11px]">Auto Detail</span>
              </div>
            </Link>
            <p className="text-slate-500 text-sm leading-relaxed max-w-xs">
              Mobile car detailing in NW Calgary. We come to your driveway with everything we need.
            </p>
            <div className="flex items-center gap-2.5 mt-5">
              <a
                href={siteConfig.social.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="w-8 h-8 rounded-lg bg-white/[0.05] border border-white/[0.07] flex items-center justify-center text-slate-500 hover:text-blue-400 hover:border-blue-500/20 transition-colors"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>
              <a
                href={siteConfig.social.facebook}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="w-8 h-8 rounded-lg bg-white/[0.05] border border-white/[0.07] flex items-center justify-center text-slate-500 hover:text-blue-400 hover:border-blue-500/20 transition-colors"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-white text-xs font-semibold uppercase tracking-wider mb-4">Services</h3>
            <ul className="space-y-2.5">
              {["Interior Reset", "Exterior Detail", "Full Detail", "Premium Detail"].map((s) => (
                <li key={s}>
                  <Link href="/services" className="text-slate-500 hover:text-white text-sm transition-colors">
                    {s}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-white text-xs font-semibold uppercase tracking-wider mb-4">Company</h3>
            <ul className="space-y-2.5">
              {[
                { href: "/", label: "Home" },
                { href: "/services", label: "Pricing" },
                { href: "/about", label: "About" },
                { href: "/booking", label: "Book a Detail" },
              ].map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-slate-500 hover:text-white text-sm transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white text-xs font-semibold uppercase tracking-wider mb-4">Contact</h3>
            <ul className="space-y-3">
              <li>
                <a href={`tel:${siteConfig.phoneRaw}`} className="flex items-start gap-2.5 text-slate-500 hover:text-white text-sm transition-colors">
                  <svg className="w-4 h-4 mt-0.5 shrink-0 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  {siteConfig.phone}
                </a>
              </li>
              <li>
                <a href={`mailto:${siteConfig.email}`} className="flex items-start gap-2.5 text-slate-500 hover:text-white text-sm transition-colors">
                  <svg className="w-4 h-4 mt-0.5 shrink-0 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  {siteConfig.email}
                </a>
              </li>
              <li>
                <span className="flex items-start gap-2.5 text-slate-500 text-sm">
                  <svg className="w-4 h-4 mt-0.5 shrink-0 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  NW Calgary, AB — Mobile
                </span>
              </li>
            </ul>

            <div className="mt-4 p-3 rounded-lg bg-white/[0.03] border border-white/[0.05]">
              <p className="text-slate-500 text-xs leading-snug">
                <span className="text-slate-400 font-medium">Hours:</span><br />
                Mon–Fri 8am–6pm<br />
                Sat–Sun 9am–4pm
              </p>
            </div>
          </div>
        </div>

        {/* Service areas */}
        <div className="border-t border-white/[0.05] pt-8 mb-8">
          <p className="text-slate-600 text-xs text-center">
            <span className="text-slate-500">Serving: </span>
            {siteConfig.serviceAreas.join(" · ")}
          </p>
        </div>

        {/* Bottom */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-slate-600 text-xs">
          <p>&copy; {year} Clearline Auto Detail. All rights reserved.</p>
          <p>Mobile Car Detailing Calgary, AB · {siteConfig.domain}</p>
        </div>
      </div>
    </footer>
  );
}
