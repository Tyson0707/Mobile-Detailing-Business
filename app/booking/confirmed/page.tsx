import type { Metadata } from "next";
import Link from "next/link";
import { siteConfig } from "@/lib/config";

export const metadata: Metadata = {
  title: "Booking Confirmed | Clear Line Auto Detail",
  description: "Your detailing appointment is confirmed. We'll see you soon.",
  alternates: {
    canonical: `${siteConfig.url}/booking/confirmed`,
  },
};

export default function BookingConfirmedPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        {/* Checkmark */}
        <div className="w-20 h-20 rounded-full bg-blue-600/10 border border-blue-500/20 flex items-center justify-center mx-auto mb-8">
          <svg className="w-10 h-10 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <p className="text-blue-400 text-sm font-semibold uppercase tracking-widest mb-3">
          You&apos;re booked
        </p>
        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-5">
          See you soon.
        </h1>
        <p className="text-slate-400 text-lg leading-relaxed mb-10">
          Your appointment is confirmed. We&apos;ll arrive with everything we need — all you have to do is give us access to a tap and an outlet.
        </p>

        <div className="p-5 rounded-xl bg-[#0f1829] border border-white/[0.06] mb-8 text-left space-y-3">
          <p className="text-slate-300 text-sm flex gap-3">
            <span className="text-blue-400 mt-0.5">✓</span>
            Check your email for a confirmation from Square
          </p>
          <p className="text-slate-300 text-sm flex gap-3">
            <span className="text-blue-400 mt-0.5">✓</span>
            We&apos;ll reach out if we have any questions before your appointment
          </p>
          <p className="text-slate-300 text-sm flex gap-3">
            <span className="text-blue-400 mt-0.5">✓</span>
            Need to reschedule? Reply to your confirmation email
          </p>
        </div>

        <Link
          href="/"
          className="inline-flex items-center justify-center px-8 py-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold transition-colors"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}
