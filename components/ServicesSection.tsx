import { services, vehicleSizes, siteConfig } from "@/lib/config";

export function ServicesSection() {
  return (
    <section id="services" className="py-20 sm:py-28 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-14">
          <p className="text-blue-400 text-sm font-semibold uppercase tracking-widest mb-3">
            Services & Pricing
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4 text-balance">
            What we offer
          </h2>
          <p className="text-slate-400 text-lg max-w-xl mx-auto">
            Every service is performed at your location. All pricing in CAD — select your vehicle size below.
          </p>

          {/* Size legend */}
          <div className="inline-flex items-center gap-1 mt-5 px-4 py-2 rounded-full bg-white/[0.04] border border-white/[0.07] text-xs text-slate-500 gap-4">
            <span><span className="text-slate-300 font-medium">Small</span> — sedan/coupe</span>
            <span className="text-white/20">·</span>
            <span><span className="text-slate-300 font-medium">Mid</span> — SUV/truck</span>
            <span className="text-white/20">·</span>
            <span><span className="text-slate-300 font-medium">Large</span> — 3-row SUV/van</span>
          </div>
        </div>

        {/* Service cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {services.map((service) => (
            <div
              key={service.id}
              className={`relative rounded-2xl border flex flex-col overflow-hidden transition-all hover:-translate-y-1 hover:shadow-xl ${
                service.badge === "Most Popular"
                  ? "border-blue-500/40 bg-[#0f1b2d] shadow-lg shadow-blue-600/10"
                  : service.badge === "Premium"
                  ? "border-amber-500/30 bg-[#0f1b2d]"
                  : "border-white/[0.07] bg-[#0f1829]"
              }`}
            >
              {/* Badge */}
              {service.badge && (
                <div
                  className={`absolute top-0 right-0 px-3 py-1 text-xs font-semibold rounded-bl-xl ${
                    service.badge === "Most Popular"
                      ? "bg-blue-600 text-white"
                      : "bg-amber-500 text-black"
                  }`}
                >
                  {service.badge}
                </div>
              )}

              <div className="p-5 flex flex-col flex-1">
                {/* Name + description */}
                <div className="mb-4 pr-16">
                  <h3
                    className={`text-base font-bold mb-1.5 ${
                      service.badge === "Most Popular"
                        ? "text-blue-300"
                        : service.badge === "Premium"
                        ? "text-amber-300"
                        : "text-white"
                    }`}
                  >
                    {service.name}
                  </h3>
                  <p className="text-slate-400 text-xs leading-relaxed">{service.description}</p>
                </div>

                {/* Pricing table */}
                <div className="mb-5 rounded-lg overflow-hidden border border-white/[0.07]">
                  {vehicleSizes.map((size, i) => (
                    <div
                      key={size}
                      className={`flex items-center justify-between px-3 py-2 ${
                        i < vehicleSizes.length - 1 ? "border-b border-white/[0.05]" : ""
                      } ${i === 0 ? "bg-white/[0.03]" : ""}`}
                    >
                      <span className="text-slate-400 text-xs">{size}</span>
                      <span
                        className={`font-bold text-sm ${
                          service.badge === "Most Popular"
                            ? "text-blue-400"
                            : service.badge === "Premium"
                            ? "text-amber-400"
                            : "text-white"
                        }`}
                      >
                        ${service.pricing[size]}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Features */}
                <ul className="space-y-1.5 mb-5 flex-1">
                  {service.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2">
                      <svg
                        className={`w-3.5 h-3.5 mt-0.5 shrink-0 ${
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
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-slate-300 text-xs">{feature}</span>
                    </li>
                  ))}
                </ul>

                <a
                  href={siteConfig.squareBookingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`w-full py-2.5 rounded-xl text-xs font-semibold text-center transition-colors ${
                    service.badge === "Most Popular"
                      ? "bg-blue-600 hover:bg-blue-500 text-white"
                      : service.badge === "Premium"
                      ? "bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-400"
                      : "bg-white/[0.06] hover:bg-white/[0.1] border border-white/[0.08] text-white"
                  }`}
                >
                  Book This Service
                </a>
              </div>
            </div>
          ))}
        </div>

        <p className="text-center text-slate-600 text-xs mt-7">
          Prices vary by vehicle size as shown.{" "}
          <a href="/services" className="text-blue-500 hover:text-blue-400 underline">
            View add-ons and full details
          </a>
        </p>
      </div>
    </section>
  );
}
