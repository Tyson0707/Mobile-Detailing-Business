"use client";

import { useState } from "react";
import { siteConfig } from "@/lib/config";

const ADMIN_PASSWORD = "clearline2024";

const UTM_SOURCES = [
  { id: "nextdoor", label: "Nextdoor", icon: "🏘️", medium: "social" },
  { id: "instagram", label: "Instagram", icon: "📸", medium: "social" },
  { id: "facebook", label: "Facebook", icon: "👥", medium: "social" },
  { id: "google", label: "Google Search", icon: "🔍", medium: "organic" },
  { id: "text", label: "Text / Word of Mouth", icon: "💬", medium: "referral" },
  { id: "business-card", label: "Business Card", icon: "🪪", medium: "offline" },
  { id: "referral", label: "Customer Referral", icon: "🤝", medium: "referral" },
];

function buildUTMUrl(base: string, source: string, medium: string, campaign = "local") {
  const url = new URL(base);
  url.searchParams.set("utm_source", source);
  url.searchParams.set("utm_medium", medium);
  url.searchParams.set("utm_campaign", campaign);
  return url.toString();
}

function buildBookingUTMUrl(source: string, medium: string) {
  const base = siteConfig.squareBookingUrl;
  // Square URLs can't use UTM params for GA4, so we route through the site first
  const siteUrl = new URL(siteConfig.url + "/booking");
  siteUrl.searchParams.set("utm_source", source);
  siteUrl.searchParams.set("utm_medium", medium);
  siteUrl.searchParams.set("utm_campaign", "local");
  return siteUrl.toString();
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button
      onClick={copy}
      className="text-xs px-3 py-1.5 rounded-lg bg-blue-600/20 hover:bg-blue-600/40 text-blue-300 border border-blue-500/20 transition-colors shrink-0"
    >
      {copied ? "Copied!" : "Copy"}
    </button>
  );
}

function StatCard({ value, label, sublabel, href }: { value: string; label: string; sublabel?: string; href?: string }) {
  const inner = (
    <div className="p-5 rounded-2xl bg-[#0f1829] border border-white/[0.07] hover:border-blue-500/30 transition-colors">
      <div className="text-2xl font-bold text-white mb-0.5">{value}</div>
      <div className="text-sm text-slate-300">{label}</div>
      {sublabel && <div className="text-xs text-slate-500 mt-1">{sublabel}</div>}
    </div>
  );
  if (href) return <a href={href} target="_blank" rel="noopener noreferrer">{inner}</a>;
  return inner;
}

export default function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [pw, setPw] = useState("");
  const [err, setErr] = useState(false);
  const [activeSource, setActiveSource] = useState(UTM_SOURCES[0]);

  if (!authed) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#080d1a] px-4">
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <p className="text-blue-400 text-sm font-semibold uppercase tracking-widest mb-2">Clear Line</p>
            <h1 className="text-2xl font-bold text-white">Business Dashboard</h1>
            <p className="text-slate-500 text-sm mt-1">Enter your password to continue</p>
          </div>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (pw === ADMIN_PASSWORD) { setAuthed(true); setErr(false); }
              else { setErr(true); setPw(""); }
            }}
            className="space-y-3"
          >
            <input
              type="password"
              value={pw}
              onChange={(e) => setPw(e.target.value)}
              placeholder="Password"
              className="w-full px-4 py-3 rounded-xl bg-white/[0.06] border border-white/[0.1] text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 text-sm"
              autoFocus
            />
            {err && <p className="text-red-400 text-xs">Incorrect password.</p>}
            <button
              type="submit"
              className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl transition-colors text-sm"
            >
              Enter
            </button>
          </form>
        </div>
      </div>
    );
  }

  const siteLink = buildUTMUrl(siteConfig.url, activeSource.id, activeSource.medium);
  const bookingLink = buildBookingUTMUrl(activeSource.id, activeSource.medium);

  return (
    <div className="min-h-screen bg-[#080d1a] pt-8 pb-20 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="mb-10">
          <p className="text-blue-400 text-sm font-semibold uppercase tracking-widest mb-1">Clear Line Auto Detail</p>
          <h1 className="text-3xl font-bold text-white">Business Dashboard</h1>
          <p className="text-slate-500 text-sm mt-1">Track your traffic, leads, and bookings</p>
          <a href="/admin/leads" className="inline-flex items-center gap-2 mt-4 px-4 py-2 bg-green-600/20 hover:bg-green-600/30 border border-green-500/30 text-green-400 text-sm font-semibold rounded-xl transition-colors">
            🎯 Find New Leads →
          </a>
        </div>

        {/* External dashboards */}
        <section className="mb-10">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-slate-500 mb-4">Your Dashboards</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <StatCard value="↗" label="Vercel Analytics" sublabel="Visitors & pages" href="https://vercel.com/dashboard" />
            <StatCard value="↗" label="Google Analytics" sublabel="Traffic & sources" href="https://analytics.google.com" />
            <StatCard value="↗" label="Square Bookings" sublabel="Appointments" href="https://squareup.com/dashboard/appointments/overview" />
            <StatCard value="↗" label="Google Reviews" sublabel="10 reviews · 5★" href="https://share.google/fAlXdJXqXrLGsUCiZ" />
          </div>
        </section>

        {/* UTM Link Generator */}
        <section className="mb-10">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-slate-500 mb-1">Tracking Links</h2>
          <p className="text-slate-400 text-sm mb-4">
            Use a different link for each place you share your business. Analytics will show you exactly where each visitor came from.
          </p>

          {/* Source picker */}
          <div className="flex flex-wrap gap-2 mb-5">
            {UTM_SOURCES.map((s) => (
              <button
                key={s.id}
                onClick={() => setActiveSource(s)}
                className={`px-3 py-2 rounded-xl text-sm font-medium transition-colors border ${
                  activeSource.id === s.id
                    ? "bg-blue-600 border-blue-500 text-white"
                    : "bg-white/[0.04] border-white/[0.08] text-slate-400 hover:text-white"
                }`}
              >
                {s.icon} {s.label}
              </button>
            ))}
          </div>

          {/* Generated links */}
          <div className="space-y-3">
            <div className="p-4 rounded-xl bg-[#0f1829] border border-white/[0.07]">
              <div className="flex items-center justify-between gap-3 mb-2">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Website Link</span>
                <CopyButton text={siteLink} />
              </div>
              <p className="text-slate-300 text-sm font-mono break-all">{siteLink}</p>
              <p className="text-slate-500 text-xs mt-2">Use this when sharing your website. GA4 will show this visitor came from {activeSource.label}.</p>
            </div>

            <div className="p-4 rounded-xl bg-[#0f1829] border border-white/[0.07]">
              <div className="flex items-center justify-between gap-3 mb-2">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Direct Booking Link</span>
                <CopyButton text={bookingLink} />
              </div>
              <p className="text-slate-300 text-sm font-mono break-all">{bookingLink}</p>
              <p className="text-slate-500 text-xs mt-2">Use this when you want to send someone straight to booking. Tracks source before redirecting to Square.</p>
            </div>
          </div>
        </section>

        {/* Setup checklist */}
        <section className="mb-10">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-slate-500 mb-4">Analytics Setup</h2>
          <div className="space-y-3">
            {[
              {
                done: true,
                title: "Vercel Analytics enabled",
                desc: "Tracking pageviews, unique visitors, and top pages. Enable it in your Vercel project settings → Analytics tab.",
              },
              {
                done: true,
                title: "Google Analytics 4 (G-N7S8SLHR7T)",
                desc: "Tracking all traffic, sources, and behaviour. View your reports at analytics.google.com.",
              },
              {
                done: true,
                title: "GA4 Book Now conversion events",
                desc: "Every 'Book Now' click is tracked as a conversion event in GA4. Check Conversions in your GA4 dashboard.",
              },
            ].map((item) => (
              <div key={item.title} className="flex gap-3 p-4 rounded-xl bg-[#0f1829] border border-white/[0.07]">
                <div className={`w-5 h-5 rounded-full shrink-0 mt-0.5 flex items-center justify-center text-xs ${item.done ? "bg-green-500/20 text-green-400" : "bg-white/[0.06] text-slate-600"}`}>
                  {item.done ? "✓" : "○"}
                </div>
                <div>
                  <p className={`text-sm font-medium ${item.done ? "text-green-400" : "text-slate-300"}`}>{item.title}</p>
                  <p className="text-slate-500 text-xs mt-0.5">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Quick actions */}
        <section>
          <h2 className="text-xs font-semibold uppercase tracking-widest text-slate-500 mb-4">Quick Actions</h2>
          <div className="grid sm:grid-cols-2 gap-3">
            <a
              href={siteConfig.squareBookingUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-4 rounded-xl bg-[#0f1829] border border-white/[0.07] hover:border-blue-500/30 transition-colors"
            >
              <span className="text-2xl">📅</span>
              <div>
                <p className="text-sm font-medium text-white">Open Square Bookings</p>
                <p className="text-xs text-slate-500">View and manage appointments</p>
              </div>
            </a>
            <a
              href={`tel:${siteConfig.phoneRaw}`}
              className="flex items-center gap-3 p-4 rounded-xl bg-[#0f1829] border border-white/[0.07] hover:border-blue-500/30 transition-colors"
            >
              <span className="text-2xl">📞</span>
              <div>
                <p className="text-sm font-medium text-white">{siteConfig.phone}</p>
                <p className="text-xs text-slate-500">Your business number</p>
              </div>
            </a>
            <a
              href={`mailto:${siteConfig.email}`}
              className="flex items-center gap-3 p-4 rounded-xl bg-[#0f1829] border border-white/[0.07] hover:border-blue-500/30 transition-colors"
            >
              <span className="text-2xl">✉️</span>
              <div>
                <p className="text-sm font-medium text-white">{siteConfig.email}</p>
                <p className="text-xs text-slate-500">Business email</p>
              </div>
            </a>
            <a
              href="https://share.google/fAlXdJXqXrLGsUCiZ"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-4 rounded-xl bg-[#0f1829] border border-white/[0.07] hover:border-blue-500/30 transition-colors"
            >
              <span className="text-2xl">⭐</span>
              <div>
                <p className="text-sm font-medium text-white">Google Reviews</p>
                <p className="text-xs text-slate-500">10 reviews · Send this link to clients</p>
              </div>
            </a>
          </div>
        </section>

      </div>
    </div>
  );
}
