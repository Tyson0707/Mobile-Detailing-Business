import { NextResponse } from "next/server";

const ADZUNA_APP_ID = "33c5bdc4";
const ADZUNA_APP_KEY = "13bf6fb31c65ef13f6043aa66d248841";

interface Lead {
  source: string;
  title: string;
  company: string;
  date: string;
  url: string;
  reason: string;
}

export async function GET() {
  const queries = ["detailer", "auto detailer", "detail technician"];

  const seen = new Set<string>();
  const leads: Lead[] = [];

  for (const q of queries) {
    try {
      const url =
        `https://api.adzuna.com/v1/api/jobs/ca/search/1` +
        `?app_id=${ADZUNA_APP_ID}&app_key=${ADZUNA_APP_KEY}` +
        `&results_per_page=20&what=${encodeURIComponent(q)}&where=Calgary%2C+AB&sort_by=date`;

      const res = await fetch(url, { cache: "no-store" });
      if (!res.ok) continue;

      const data = await res.json();
      for (const job of data.results ?? []) {
        const jobUrl: string = job.redirect_url ?? "";
        if (!jobUrl || seen.has(jobUrl)) continue;
        seen.add(jobUrl);
        leads.push({
          source: "Adzuna",
          title: job.title ?? "",
          company: job.company?.display_name ?? "",
          date: job.created ?? "",
          url: jobUrl,
          reason: "Actively hiring a detailer",
        });
      }
    } catch {
      // skip failed query
    }
  }

  leads.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return NextResponse.json({
    leads,
    fetchedAt: new Date().toISOString(),
    indeedBlocked: false,
  });
}
