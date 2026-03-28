import Link from "next/link";
import { services } from "@/lib/config";

export function ServicesSection() {
  return (
    <section id="services" className="py-20 sm:py-28 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-14">
          <p className="text-blue-400 text-sm font-semibold uppercase tracking-widest mb-3">
            What We Offer
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4 text-balance">
            Services & Packages
          </h2>
          <p className="text-slate-400 text-lg max-w-xl mx-auto">
            Every service is performed at your location with professional-grade products and equipment.
          </p>
        </div>

        {/* Service cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {services.map((service) => (
            <div
              key={service.id}
              className={`relative rounded-2xl border bg-card-gradient overflow-hidden flex flex-col transition-all hover:-translate-y-1 hover:shadow-xl ${
                service.badge === "Most Popular"
                  ? "border-blue-500/40 bg-[#131d30] shadow-lg shadow-blue-600/10"
                  : service.badge === "Premium"
                  ? "border-amber-500/30 bg-[#131d30]"
                  : "border-white/[0.07] bg-[#0f1829]"
              }`}
            >
              {/* Badge */}
              {service.badge && (
                <div
                  className={`absolute top-0 right-0 px-3 py-1 text-xs font-semibold rounded-bl-lg ${
                    service.badge === "Most Popular"
                      ? "bg-blue-600 text-white"
                      : "bg-amber-500 text-black"
                  }`}
                >
                  {service.badge}
                </div>
              )}

              <div className="p-6 flex flex-col flex-1">
                {/* Price & name */}
                <div className="mb-4">
                  <p className="text-slate-400 text-sm mb-1">{service.name}</p>
                  <p
                    className={`text-3xl font-bold ${
                      service.badge === "Most Popular"
                        ? "text-blue-400"
                        : service.badge === "Premium"
                        ? "text-amber-400"
                        : "text-white"
                    }`}
                  >
                    {service.price}
                  </p>
                  <p className="text-slate-500 text-xs mt-0.5">{service.duration}</p>
                </div>

                <p className="text-slate-400 text-sm mb-5 leading-relaxed">
                  {service.description}
                </p>

                {/* Features */}
                <ul className="space-y-2 mb-6 flex-1">
                  {service.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2.5">
                      <svg
                        className={`w-4 h-4 mt-0.5 shrink-0 ${
                          service.badge === "Most Popular"
                            ? "text-blue-400"
                            : service.badge === "Premium"
                            ? "text-amber-400"
                            : "text-blue-500"
                        }`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      <span className="text-slate-300 text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  href="/booking"
                  className={`w-full py-3 rounded-xl text-sm font-semibold text-center transition-colors ${
                    service.badge === "Most Popular"
                      ? "bg-blue-600 hover:bg-blue-500 text-white"
                      : service.badge === "Premium"
                      ? "bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-400"
                      : "bg-white/[0.06] hover:bg-white/[0.1] border border-white/[0.08] text-white"
                  }`}
                >
                  Book This Service
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Note */}
        <p className="text-center text-slate-500 text-sm mt-8">
          Prices vary by vehicle size (car, SUV, truck). All prices in CAD.{" "}
          <Link href="/booking" className="text-blue-400 hover:text-blue-300 underline">
            Get a custom quote
          </Link>
        </p>
      </div>
    </section>
  );
}
