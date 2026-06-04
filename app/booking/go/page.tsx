"use client";

import { useEffect } from "react";
import { siteConfig } from "@/lib/config";

export default function BookingGoPage() {
  useEffect(() => {
    window.location.href = siteConfig.squareBookingUrl;
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="w-10 h-10 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-slate-400 text-sm">Opening booking calendar...</p>
      </div>
    </div>
  );
}
