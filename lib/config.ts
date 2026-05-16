export const siteConfig = {
  name: "Clear Line Auto Detail",
  tagline: "Premium Mobile Detailing. We Come to You.",
  description:
    "Mobile car detailing in Calgary and surrounding areas. We come to your driveway — professional interior resets, exterior details, and full details for busy homeowners who want it done right.",
  domain: "clearlineautodetail.ca",
  url: "https://clearlineautodetail.ca",

  // ── Update these with your real info ──────────────────────────────
  phone: "(403) 813-9276",
  phoneRaw: "+14038139276",
  email: "clearlinedetailyyc@gmail.com",
  // ──────────────────────────────────────────────────────────────────

  squareBookingUrl: "https://app.squareup.com/appointments/book/oghl244gl4kvv8/L9CVXJSYRJZST/start",

  city: "Calgary",
  province: "AB",

  primaryArea: "Calgary",
  serviceAreas: [
    "NW Calgary",
    "NE Calgary",
    "SW Calgary",
    "SE Calgary",
    "Bearspaw",
    "Watermark",
    "Rocky Ridge",
    "Tuscany",
    "Nolan Hill",
    "Evanston",
    "Sage Hill",
    "Royal Oak",
    "Sherwood",
    "Airdrie",
    "Cochrane",
    "Chestermere",
    "Okotoks",
  ],

  social: {
    instagram: "https://instagram.com/clearlineautodetail",
    facebook: "https://facebook.com/clearlineautodetail",
    google: "#",
  },

  stats: [
    { value: "100%", label: "Satisfaction Guaranteed", link: null },
    { value: "10", label: "5★ Google Reviews", link: "https://share.google/fAlXdJXqXrLGsUCiZ" },
    { value: "Mobile", label: "No Drop-Off. Ever.", link: null },
    { value: "Flat-Rate", label: "No Hidden Fees", link: null },
  ],
} as const;

// Vehicle size labels used throughout the site
export const vehicleSizes = ["Small", "Mid", "Large"] as const;
export type VehicleSize = (typeof vehicleSizes)[number];

export const vehicleSizeLabels: Record<VehicleSize, string> = {
  Small: "Small (sedan / coupe)",
  Mid: "Mid (SUV / truck)",
  Large: "Large (3-row SUV / minivan)",
};

export const services = [
  {
    id: "interior-reset",
    name: "Interior Reset",
    slug: "interior-reset",
    badge: null as string | null,
    description:
      "A thorough reset for your interior — every surface, crevice, and carpet cleaned properly. The kind of clean that actually lasts.",
    pricing: { Small: 170, Mid: 220, Large: 270 },
    duration: "2–3 hrs",
    cta: "Book Your Detail",
    features: [
      "Full vacuum — seats, carpets, trunk",
      "Deep clean: dash, doors, centre console",
      "Crevice & vent cleaning",
      "Interior glass cleaning",
      "Light stain removal",
    ],
  },
  {
    id: "full-detail",
    name: "Full Detail",
    slug: "full-detail",
    badge: "Most Popular" as string | null,
    description:
      "The complete refresh. Interior Reset + Exterior Detail combined — showroom condition delivered to your driveway.",
    pricing: { Small: 240, Mid: 300, Large: 360 },
    duration: "3–4 hrs",
    cta: "Book Your Detail",
    features: [
      "Full Interior Reset (all items)",
      "Full Exterior Detail (all items)",
      "Door jamb cleaning",
      "Post-service walkthrough",
    ],
  },
  {
    id: "premium-detail",
    name: "Premium Detail",
    slug: "premium-detail",
    badge: "Premium" as string | null,
    description:
      "Everything in the Full Detail, plus hot water extraction, interior ceramic protection, and trim restoration for a fully refined finish.",
    pricing: { Small: 349, Mid: 429, Large: 499 },
    duration: "4–5 hrs",
    cta: "Book Your Detail",
    features: [
      "Everything in Full Detail",
      "Hot water extraction",
      "Interior ceramic protection",
      "Interior trim & plastic restoration",
      "Fully restored interior finish",
    ],
  },
  {
    id: "exterior-detail",
    name: "Exterior Detail",
    slug: "exterior-detail",
    badge: null as string | null,
    description:
      "Foam pre-wash, safe hand wash, wheel and tire cleaning, and a hydrophobic ceramic sealant. More than a wash — a proper exterior refresh.",
    pricing: { Small: 110, Mid: 130, Large: 150 },
    duration: "1–2 hrs",
    cta: "Book Your Detail",
    features: [
      "Foam pre-wash & safe hand wash",
      "Wheel & tire cleaning",
      "Tire dressing applied",
      "Bug & tar removal",
      "Ceramic spray sealant protection",
      "Exterior glass cleaning",
    ],
  },
] as const;

export const paintCorrectionServices = [
  {
    id: "enhancement-detail",
    name: "Enhancement Detail",
    badge: "Best Value" as string | null,
    description:
      "Removes light swirl marks while restoring gloss, clarity, and depth. The best value transformation for your paint's appearance.",
    pricing: { Small: 229, Mid: 299, Large: 369 },
    startingAt: false as boolean,
    cta: "Restore Your Paint",
    idealFor: "Ideal for daily drivers with light swirling looking to restore gloss." as string | null,
    features: [
      "Foam pre-wash & hand wash",
      "Iron decontamination",
      "Clay bar treatment",
      "1-step machine polish",
      "Gloss enhancement",
      "Ceramic spray sealant",
    ],
    note: null as string | null,
  },
  {
    id: "paint-correction",
    name: "Paint Correction",
    badge: null as string | null,
    description:
      "Two-stage correction for moderate to heavy paint defects — swirls, oxidation, and imperfections refined back to clarity.",
    pricing: { Small: 449, Mid: 599, Large: 749 },
    startingAt: true as boolean,
    cta: "Restore Your Paint",
    idealFor: null as string | null,
    features: [
      "Full wash & decontamination",
      "Clay bar treatment",
      "2-stage machine correction",
      "LED paint inspection",
      "Hydrophobic sealant finish",
      "Exterior glass cleaning",
    ],
    note: "Pricing varies based on paint condition and correction goals." as string | null,
  },
  {
    id: "ceramic-coating",
    name: "Ceramic Coating",
    badge: "Premium" as string | null,
    description:
      "Durable ceramic protection that delivers incredible gloss, hydrophobic performance, and easier maintenance for up to 12 months with proper care.",
    pricing: { Small: 699, Mid: 899, Large: 1099 },
    startingAt: false as boolean,
    cta: "Protect Your Vehicle",
    idealFor: null as string | null,
    features: [
      "Exterior decontamination & clay treatment",
      "1-step machine polish",
      "IPA panel prep",
      "CarPro CQUARTZ Lite 2.0 application",
      "Hydrophobic self-cleaning effect",
      "Up to 12 months protection with proper care",
    ],
    note: null as string | null,
  },
] as const;

export const addOns = [
  {
    name: "Interior Ceramic Protection",
    price: "$60",
    note: "Available on non-Premium packages only",
    description:
      "Bonds to interior surfaces to repel stains and spills — keeps your interior cleaner for longer.",
  },
  {
    name: "Interior Trim / Plastic Restoration",
    price: "$30",
    note: null,
    description:
      "Brings faded, uneven plastics and trim back to a clean, consistent finish.",
  },
  {
    name: "Excessive Pet Hair Removal",
    price: "Starting at $40",
    note: null,
    description:
      "Heavy pet hair embedded in seats and carpet — we remove it properly, not just vacuum over it.",
  },
  {
    name: "Deep Extraction",
    price: "$30–$80",
    note: "Price depends on severity",
    description:
      "Hot water extraction for stains, odours, or heavily soiled carpets and seats.",
  },
  {
    name: "Headlight Restoration",
    price: "$99/pair",
    note: null,
    description:
      "Removes yellowing and oxidation. Restores clarity and improves night visibility.",
  },
  {
    name: "Engine Bay Detail",
    price: "$50",
    note: null,
    description:
      "Safe degreasing and detailing of the engine bay. Presented clean on delivery.",
  },
] as const;

export const testimonials = [
  {
    name: "Gareth Ackroyd",
    location: "Calgary",
    rating: 5,
    text: "I recently had the interior of my car detailed by Clear Line and couldn't be more impressed. Tyson really took his time and paid attention to every detail — my car's interior genuinely looks like new again. He came to my house, which was incredibly convenient and hassle-free. Extremely polite, friendly, and helpful throughout. I'll be using them again soon.",
    vehicle: "",
  },
  {
    name: "Kevin",
    location: "Calgary",
    rating: 5,
    text: "Tyson has detailed numerous vehicles at our auto repair facility. The level of service he provides and the attention to detail are unmatched. Highly recommend anyone or any business needing vehicle detailing to give Clear Line a call.",
    vehicle: "",
  },
  {
    name: "Tim Scarrott",
    location: "Calgary",
    rating: 5,
    text: "I was a little embarrassed about how dirty my truck had gotten. Tyson actually said he enjoyed the challenge! I can't believe how well he was able to clean it — I don't know if it has ever been this clean.",
    vehicle: "",
  },
  {
    name: "April Von Platen",
    location: "Calgary",
    rating: 5,
    text: "Tyson did a great job cleaning my SUV. There was lots of pet hair and it's super clean now. He was on time and very personable. Highly recommend!",
    vehicle: "",
  },
] as const;

export const faqItems = [
  {
    question: "What do you need access to at my property?",
    answer:
      "Just a standard outdoor tap and a power outlet — that's it. We bring our own pressure washer, compressed air, vacuums, extractors, and all professional detailing products. Most driveways have everything we need.",
  },
  {
    question: "Where do you service?",
    answer:
      "We cover all of Calgary and surrounding areas including Airdrie, Cochrane, Chestermere, and Okotoks. Not sure if we cover your area? Message us — we're flexible.",
  },
  {
    question: "How do I pay?",
    answer:
      "We accept cash, e-transfer, and all major credit and debit cards via Square. Payment is collected after the service is complete and you've inspected the results.",
  },
  {
    question: "Do I need to be available the whole time?",
    answer:
      "No. Most clients go about their day — work from home, run errands, whatever. Just be available at the start to hand over keys and at the end to walk through the results.",
  },
  {
    question: "What's the difference between Full Detail and Premium?",
    answer:
      "Full Detail is Interior Reset + Exterior Detail. Premium adds hot water extraction for deeper stains, interior ceramic protection (which repels spills and staining), and trim/plastic restoration for a fully finished look inside.",
  },
  {
    question: "Can I book same-week?",
    answer:
      "Yes — we often have openings within a few days. Book online and we'll confirm quickly. If you need something urgent, call or text us directly.",
  },
  {
    question: "What if I'm not happy with the result?",
    answer:
      "We'll come back and fix it. 100% satisfaction guarantee — no arguments, no fees.",
  },
] as const;
