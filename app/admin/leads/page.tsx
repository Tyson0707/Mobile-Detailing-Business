"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

const ADMIN_PASSWORD = "clearline2024";

// ─── Calgary & Area Dealership Hit List ───────────────────────────────────────
const DEALERSHIPS = [
  // Luxury / import
  { name: "BMW Calgary South", area: "Macleod Trail S", type: "Luxury", maps: "BMW+Calgary+South" },
  { name: "Mercedes-Benz Calgary South", area: "Macleod Trail S", type: "Luxury", maps: "Mercedes-Benz+Calgary+South" },
  { name: "Lexus of Calgary", area: "Macleod Trail S", type: "Luxury", maps: "Lexus+of+Calgary" },
  { name: "Porsche Centre Calgary", area: "Macleod Trail S", type: "Luxury", maps: "Porsche+Centre+Calgary" },
  { name: "Audi Calgary", area: "Macleod Trail S", type: "Luxury", maps: "Audi+Calgary" },
  { name: "Land Rover Calgary", area: "Macleod Trail S", type: "Luxury", maps: "Land+Rover+Calgary" },
  { name: "Jaguar Calgary", area: "Macleod Trail S", type: "Luxury", maps: "Jaguar+Calgary" },
  { name: "Volvo Cars Calgary", area: "Macleod Trail S", type: "Luxury", maps: "Volvo+Cars+Calgary" },
  // Domestic / mass market
  { name: "Maclin Ford", area: "Macleod Trail S", type: "Dealership", maps: "Maclin+Ford+Calgary" },
  { name: "Courtesy Ford", area: "Macleod Trail S", type: "Dealership", maps: "Courtesy+Ford+Calgary" },
  { name: "Southgate Chevrolet", area: "Macleod Trail S", type: "Dealership", maps: "Southgate+Chevrolet+Calgary" },
  { name: "Southland Dodge", area: "Macleod Trail S", type: "Dealership", maps: "Southland+Dodge+Calgary" },
  { name: "Hyundai of Glenmore", area: "Glenmore Trail", type: "Dealership", maps: "Hyundai+of+Glenmore+Calgary" },
  { name: "Eastside Kia", area: "NE Calgary", type: "Dealership", maps: "Eastside+Kia+Calgary" },
  { name: "Docksteader Chev", area: "NW Calgary", type: "Dealership", maps: "Docksteader+Chevrolet+Calgary" },
  { name: "Mountain View Dodge", area: "NW Calgary", type: "Dealership", maps: "Mountain+View+Dodge+Calgary" },
  { name: "North Hill Chevrolet", area: "NW Calgary", type: "Dealership", maps: "North+Hill+Chevrolet+Calgary" },
  { name: "Crowfoot Nissan", area: "NW Calgary", type: "Dealership", maps: "Crowfoot+Nissan+Calgary" },
  { name: "Stampede Toyota", area: "SE Calgary", type: "Dealership", maps: "Stampede+Toyota+Calgary" },
  { name: "Okotoks Nissan", area: "Okotoks", type: "Dealership", maps: "Okotoks+Nissan" },
  { name: "Okotoks Ford", area: "Okotoks", type: "Dealership", maps: "Okotoks+Ford" },
  { name: "Airdrie Honda", area: "Airdrie", type: "Dealership", maps: "Airdrie+Honda" },
  { name: "Cam Clark Ford Airdrie", area: "Airdrie", type: "Dealership", maps: "Cam+Clark+Ford+Airdrie" },
  { name: "Cochrane Toyota", area: "Cochrane", type: "Dealership", maps: "Cochrane+Toyota" },
  // Used / independent lots
  { name: "AutoTrader Used Lots Calgary", area: "Various", type: "Used Lot", maps: "used+car+dealership+Calgary" },
  // Rental / fleet
  { name: "Enterprise Fleet Calgary", area: "Multiple locations", type: "Fleet/Rental", maps: "Enterprise+Fleet+Calgary" },
  { name: "Avis Budget Group Calgary", area: "Airport / Downtown", type: "Fleet/Rental", maps: "Avis+Budget+Calgary" },
  { name: "Hertz Calgary Airport", area: "YYC Airport", type: "Fleet/Rental", maps: "Hertz+Calgary+Airport" },
  { name: "National Car Rental Calgary", area: "YYC Airport", type: "Fleet/Rental", maps: "National+Car+Rental+Calgary" },
  // Auto repair with fleets
  { name: "Jiffy Lube Calgary", area: "Multiple", type: "Auto Shop", maps: "Jiffy+Lube+Calgary" },
  { name: "OK Tire Calgary", area: "Multiple", type: "Auto Shop", maps: "OK+Tire+Calgary" },
  { name: "Canadian Tire Auto Calgary", area: "Multiple", type: "Auto Shop", maps: "Canadian+Tire+Auto+Calgary" },
];

const SEARCH_LINKS = [
  { label: "Indeed — Detailer Calgary", url: "https://ca.indeed.com/jobs?q=detailer&l=Calgary%2C+AB&sort=date" },
  { label: "Indeed — Detail Technician Calgary", url: "https://ca.indeed.com/jobs?q=detail+technician&l=Calgary%2C+AB&sort=date" },
  { label: "Kijiji — Detailer Job Calgary", url: "https://www.kijiji.ca/b-jobs/calgary/detailer/k0c45l1700199" },
  { label: "LinkedIn — Detailer Calgary", url: "https://www.linkedin.com/jobs/search/?keywords=detailer&location=Calgary" },
  { label: "Google — Dealerships Hiring Detailer Calgary", url: "https://www.google.com/search?q=%22detailer%22+%22hiring%22+Calgary+site:kijiji.ca+OR+site:indeed.ca" },
  { label: "Google Maps — Car Dealerships Calgary", url: "https://www.google.com/maps/search/car+dealerships+Calgary+AB" },
  { label: "Google Maps — Auto Shops Calgary", url: "https://www.google.com/maps/search/auto+repair+shops+Calgary+AB" },
];

const TYPE_COLORS: Record<string, string> = {
  Luxury: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  Dealership: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  "Used Lot": "bg-slate-500/10 text-slate-400 border-slate-500/20",
  "Fleet/Rental": "bg-purple-500/10 text-purple-400 border-purple-500/20",
  "Auto Shop": "bg-green-500/10 text-green-400 border-green-500/20",
};

interface JobLead {
  source: string;
  title: string;
  company: string;
  date: string;
  url: string;
  reason: string;
}

function formatDate(dateStr: string) {
  if (!dateStr) return "";
  try {
    return new Date(dateStr).toLocaleDateString("en-CA", { month: "short", day: "numeric" });
  } catch {
    return dateStr;
  }
}

export default function LeadsPage() {
  const [authed, setAuthed] = useState(false);
  const [pw, setPw] = useState("");
  const [err, setErr] = useState(false);
  const [jobLeads, setJobLeads] = useState<JobLead[]>([]);
  const [loading, setLoading] = useState(false);
  const [lastFetched, setLastFetched] = useState<string | null>(null);
  const [fetchError, setFetchError] = useState(false);
  const [indeedBlocked, setIndeedBlocked] = useState(false);
  const [filter, setFilter] = useState<string>("All");
  const [contacted, setContacted] = useState<Set<string>>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("cl_contacted");
      return saved ? new Set<string>(JSON.parse(saved)) : new Set<string>();
    }
    return new Set();
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("cl_admin_authed");
      if (saved === "1") setAuthed(true);
    }
  }, []);

  const toggleContacted = (key: string) => {
    setContacted((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      localStorage.setItem("cl_contacted", JSON.stringify(Array.from(next)));
      return next;
    });
  };

  const fetchJobLeads = async () => {
    setLoading(true);
    setFetchError(false);
    setIndeedBlocked(false);
    try {
      const res = await fetch("/api/leads");
      const data = await res.json();
      setJobLeads(data.leads ?? []);
      setLastFetched(data.fetchedAt ?? new Date().toISOString());
      setIndeedBlocked(data.indeedBlocked ?? false);
    } catch {
      setFetchError(true);
    } finally {
      setLoading(false);
    }
  };

  if (!authed) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#080d1a] px-4">
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <p className="text-blue-400 text-sm font-semibold uppercase tracking-widest mb-2">Clear Line</p>
            <h1 className="text-2xl font-bold text-white">Lead Finder</h1>
          </div>
          <form onSubmit={(e) => {
            e.preventDefault();
            if (pw === ADMIN_PASSWORD) {
              setAuthed(true);
              if (typeof window !== "undefined") localStorage.setItem("cl_admin_authed", "1");
            } else { setErr(true); setPw(""); }
          }} className="space-y-3">
            <input type="password" value={pw} onChange={(e) => setPw(e.target.value)}
              placeholder="Password" autoFocus
              className="w-full px-4 py-3 rounded-xl bg-white/[0.06] border border-white/[0.1] text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 text-sm" />
            {err && <p className="text-red-400 text-xs">Incorrect password.</p>}
            <button type="submit" className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl text-sm">Enter</button>
          </form>
        </div>
      </div>
    );
  }

  const dealershipTypes = ["All", ...Array.from(new Set(DEALERSHIPS.map((d) => d.type)))];
  const filteredDealerships = filter === "All" ? DEALERSHIPS : DEALERSHIPS.filter((d) => d.type === filter);

  return (
    <div className="min-h-screen bg-[#080d1a] pt-8 pb-20 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-10 flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <Link href="/admin" className="text-slate-500 hover:text-slate-300 text-sm transition-colors">← Dashboard</Link>
            </div>
            <h1 className="text-3xl font-bold text-white">Lead Finder</h1>
            <p className="text-slate-500 text-sm mt-1">Businesses that need a detailer — updated on demand</p>
          </div>
        </div>

        {/* Job postings section */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
            <div>
              <h2 className="text-xs font-semibold uppercase tracking-widest text-slate-500 mb-0.5">Live Job Postings</h2>
              <p className="text-slate-400 text-sm">Businesses actively advertising for a detailer right now.</p>
            </div>
            <button
              onClick={fetchJobLeads}
              disabled={loading}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-sm font-semibold rounded-xl transition-colors flex items-center gap-2"
            >
              {loading ? (
                <><svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/></svg>Fetching...</>
              ) : "Refresh Leads"}
            </button>
          </div>

          {lastFetched && (
            <p className="text-slate-600 text-xs mb-4">Last fetched: {new Date(lastFetched).toLocaleString("en-CA")}</p>
          )}

          {fetchError && (
            <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm mb-4">
              Network error — couldn&apos;t reach Indeed. Try the manual links below.
            </div>
          )}

          {indeedBlocked && (
            <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-sm mb-4">
              <p className="font-semibold mb-1">Indeed is blocking automated requests from this server.</p>
              <p className="text-amber-400/80 text-xs">This is common — Indeed blocks cloud server IPs. Use the manual search links below to check for listings directly in your browser.</p>
            </div>
          )}

          {jobLeads.length === 0 && !loading && !fetchError && !indeedBlocked && (
            <div className="p-6 rounded-xl bg-[#0f1829] border border-white/[0.07] text-center">
              <p className="text-slate-400 text-sm">Hit &ldquo;Refresh Leads&rdquo; to pull live job postings from Indeed.</p>
            </div>
          )}

          {jobLeads.length > 0 && (
            <div className="space-y-3">
              {jobLeads.map((lead, i) => {
                const key = lead.url || `${lead.company}-${i}`;
                const done = contacted.has(key);
                return (
                  <div key={key} className={`flex items-start gap-4 p-4 rounded-xl border transition-all ${done ? "opacity-40 bg-white/[0.02] border-white/[0.04]" : "bg-[#0f1829] border-white/[0.07]"}`}>
                    <button
                      onClick={() => toggleContacted(key)}
                      className={`mt-0.5 w-5 h-5 rounded-full border-2 shrink-0 flex items-center justify-center transition-colors ${done ? "bg-green-500 border-green-500 text-white" : "border-slate-600 hover:border-green-500"}`}
                    >
                      {done && <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7"/></svg>}
                    </button>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-3 flex-wrap">
                        <div>
                          <p className="text-white text-sm font-semibold">{lead.company || lead.title}</p>
                          <p className="text-slate-400 text-xs">{lead.title}</p>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          {lead.date && <span className="text-slate-600 text-xs">{formatDate(lead.date)}</span>}
                          <a href={lead.url} target="_blank" rel="noopener noreferrer"
                            className="px-3 py-1 text-xs bg-blue-600/20 hover:bg-blue-600/40 text-blue-300 border border-blue-500/20 rounded-lg transition-colors">
                            View →
                          </a>
                        </div>
                      </div>
                      <p className="text-green-400 text-[10px] mt-1">● {lead.reason}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Manual search links */}
          <div className="mt-5">
            <p className="text-slate-600 text-xs mb-3 uppercase tracking-wide font-semibold">Manual Search Links</p>
            <div className="flex flex-wrap gap-2">
              {SEARCH_LINKS.map((link) => (
                <a key={link.label} href={link.url} target="_blank" rel="noopener noreferrer"
                  className="px-3 py-1.5 text-xs bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.07] text-slate-300 rounded-lg transition-colors">
                  {link.label} ↗
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* Dealership hit list */}
        <section>
          <div className="mb-4">
            <h2 className="text-xs font-semibold uppercase tracking-widest text-slate-500 mb-0.5">Calgary Dealership Hit List</h2>
            <p className="text-slate-400 text-sm">Every dealership needs detailing. These are your cold-call targets. Check them off as you go.</p>
          </div>

          {/* Type filter */}
          <div className="flex flex-wrap gap-2 mb-5">
            {dealershipTypes.map((t) => (
              <button key={t} onClick={() => setFilter(t)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${filter === t ? "bg-blue-600 text-white" : "bg-white/[0.04] border border-white/[0.07] text-slate-400 hover:text-white"}`}>
                {t}
              </button>
            ))}
          </div>

          <div className="grid sm:grid-cols-2 gap-3">
            {filteredDealerships.map((d) => {
              const key = `dealer-${d.name}`;
              const done = contacted.has(key);
              return (
                <div key={d.name} className={`flex items-center gap-3 p-4 rounded-xl border transition-all ${done ? "opacity-40 bg-white/[0.02] border-white/[0.04]" : "bg-[#0f1829] border-white/[0.07]"}`}>
                  <button
                    onClick={() => toggleContacted(key)}
                    className={`w-5 h-5 rounded-full border-2 shrink-0 flex items-center justify-center transition-colors ${done ? "bg-green-500 border-green-500 text-white" : "border-slate-600 hover:border-green-500"}`}
                  >
                    {done && <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7"/></svg>}
                  </button>
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm font-medium truncate">{d.name}</p>
                    <p className="text-slate-500 text-xs">{d.area}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${TYPE_COLORS[d.type] ?? ""}`}>{d.type}</span>
                    <a href={`https://www.google.com/maps/search/${d.maps}`} target="_blank" rel="noopener noreferrer"
                      className="text-slate-600 hover:text-blue-400 transition-colors text-xs">📍</a>
                  </div>
                </div>
              );
            })}
          </div>

          <p className="text-slate-600 text-xs mt-4 text-center">
            Check off each one as you contact them — saved locally in your browser.
          </p>
        </section>

      </div>
    </div>
  );
}
