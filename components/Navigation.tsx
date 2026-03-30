"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { siteConfig } from "@/lib/config";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services & Pricing" },
  { href: "/about", label: "About" },
  { href: siteConfig.squareBookingUrl, label: "Book Now", cta: true, external: true },
];

export function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled || mobileOpen
          ? "glass border-b border-white/[0.06]"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center shrink-0 overflow-hidden" style={{height: '80px', width: '320px'}}>
            <img src="/logo.png" alt="Clear Line Auto Detail" style={{height: '320px', width: 'auto', marginTop: '-115px', marginLeft: '-40px'}} />
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) =>
              link.cta ? (
                <a
                  key={link.href}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ml-2 px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold rounded-lg transition-colors"
                >
                  {link.label}
                </a>
              ) : (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-4 py-2 text-sm transition-colors rounded-lg ${
                    pathname === link.href
                      ? "text-white bg-white/[0.07]"
                      : "text-slate-400 hover:text-white hover:bg-white/[0.05]"
                  }`}
                >
                  {link.label}
                </Link>
              )
            )}
          </nav>

          {/* Mobile: phone + hamburger */}
          <div className="flex md:hidden items-center gap-3">
            <a
              href={`tel:${siteConfig.phoneRaw}`}
              className="text-blue-400 text-sm font-medium hidden xs:block"
            >
              {siteConfig.phone}
            </a>
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="p-2 text-slate-300 hover:text-white"
              aria-label="Toggle menu"
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? (
                <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-white/[0.06]">
          <nav className="px-4 py-4 flex flex-col gap-1.5">
            {navLinks.map((link) =>
              link.cta ? (
                <a
                  key={link.href}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-3 rounded-xl text-sm font-medium transition-colors bg-blue-600 text-white text-center"
                >
                  {link.label}
                </a>
              ) : (
              <Link
                key={link.href}
                href={link.href}
                className={`px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                  pathname === link.href
                    ? "bg-white/[0.08] text-white"
                    : "text-slate-300 hover:text-white hover:bg-white/[0.05]"
                }`}
              >
                {link.label}
              </Link>
              )
            )}
            <a
              href={`tel:${siteConfig.phoneRaw}`}
              className="mt-1 px-4 py-3 rounded-xl text-sm text-center text-blue-400 border border-blue-500/20 bg-blue-600/[0.06]"
            >
              Call {siteConfig.phone}
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
