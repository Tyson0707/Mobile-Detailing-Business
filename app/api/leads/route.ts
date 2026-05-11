import { NextResponse } from "next/server";

interface Lead {
  source: string;
  title: string;
  company: string;
  date: string;
  url: string;
  reason: string;
}

function parseRSS(xml: string, source: string): Lead[] {
  const items = xml.match(/<item>([\s\S]*?)<\/item>/g) ?? [];
  return items.map((item) => {
    const title =
      item.match(/<title><!\[CDATA\[(.*?)\]\]><\/title>/)?.[1] ??
      item.match(/<title>(.*?)<\/title>/)?.[1] ??
      "";
    const link =
      item.match(/<link>(.*?)<\/link>/)?.[1] ??
      item.match(/<guid[^>]*>(.*?)<\/guid>/)?.[1] ??
      "";
    const pubDate = item.match(/<pubDate>(.*?)<\/pubDate>/)?.[1] ?? "";

    const dashIdx = title.lastIndexOf(" - ");
    const jobTitle = dashIdx > 0 ? title.substring(0, dashIdx) : title;
    const company = dashIdx > 0 ? title.substring(dashIdx + 3) : "";

    return {
      source,
      title: jobTitle.trim(),
      company: company.trim(),
      date: pubDate,
      url: link.trim(),
      reason: "Actively hiring a detailer",
    };
  });
}

export async function GET() {
  const queries = [
    { q: "detailer", label: "Indeed" },
    { q: "auto+detailer", label: "Indeed" },
    { q: "detail+technician", label: "Indeed" },
  ];

  const seen = new Set<string>();
  const leads: Lead[] = [];

  for (const { q, label } of queries) {
    try {
      const url = `https://ca.indeed.com/rss?q=${q}&l=Calgary%2C+AB&sort=date&limit=20`;
      const res = await fetch(url, {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36",
          Accept: "application/rss+xml, application/xml, text/xml, */*",
        },
        next: { revalidate: 1800 },
      });
      if (!res.ok) continue;
      const xml = await res.text();
      for (const lead of parseRSS(xml, label)) {
        if (lead.url && !seen.has(lead.url)) {
          seen.add(lead.url);
          leads.push(lead);
        }
      }
    } catch {
      // silently skip failed fetches
    }
  }

  leads.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return NextResponse.json({ leads, fetchedAt: new Date().toISOString() });
}
