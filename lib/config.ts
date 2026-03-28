export const siteConfig = {
  name: "Clearline Auto Detail",
  tagline: "Premium Mobile Detailing. We Come to You.",
  description:
    "Mobile car detailing in NW Calgary and surrounding areas. We come to your driveway — professional interior resets, exterior details, and full details for busy homeowners who want it done right.",
  domain: "clearlineautodetail.ca",
  url: "https://clearlineautodetail.ca",

  // ── Update these with your real info ──────────────────────────────
  phone: "(403) 813-9276",
  phoneRaw: "+14038139276",
  email: "clearlinedetailyyc@gmail.com",
  // ──────────────────────────────────────────────────────────────────

  // Square booking link — add when you set it up
  squareBookingUrl: "#booking",

  city: "Calgary",
  province: "AB",

  primaryArea: "NW Calgary",
  serviceAreas: [
    "NW Calgary",
    "Bearspaw",
    "Watermark",
    "Rocky Ridge",
    "Tuscany",
    "Nolan Hill",
    "Evanston",
    "Sage Hill",
    "Royal Oak",
    "Sherwood",
  ],

  social: {
    instagram: "https://instagram.com/clearlineautodetail",
    facebook: "https://facebook.com/clearlineautodetail",
    google: "#",
  },

  stats: [
    { value: "500+", label: "Details Completed" },
    { value: "5★", label: "Google Rating" },
    { value: "100%", label: "Mobile — No Drop-Off" },
    { value: "Insured", label: "Fully Insured" },
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
      "A full reset for your interior. We go through every surface, crevice, and carpet — the kind of clean you can't get at a drive-through wash.",
    pricing: { Small: 170, Mid: 220, Large: 270 },
    duration: "2–3 hrs",
    features: [
      "Full vacuum — seats, carpets, trunk",
      "Deep clean: dash, doors, center console",
      "Crevice & vent cleaning",
      "Interior glass cleaning",
      "Light stain removal",
    ],
  },
  {
    id: "exterior-detail",
    name: "Exterior Detail",
    slug: "exterior-detail",
    badge: null as string | null,
    description:
      "Foam wash, hand wash, wheels, tires, and a protective sealant. Paint-safe technique every time.",
    pricing: { Small: 110, Mid: 130, Large: 150 },
    duration: "1–2 hrs",
    features: [
      "Foam pre-wash & hand wash",
      "Wheels and tires cleaned",
      "Tire shine applied",
      "Bug and tar removal",
      "Spray sealant protection",
      "Exterior glass cleaning",
    ],
  },
  {
    id: "full-detail",
    name: "Full Detail",
    slug: "full-detail",
    badge: "Most Popular" as string | null,
    description:
      "The full package. Interior Reset + Exterior Detail combined — showroom results at your driveway.",
    pricing: { Small: 240, Mid: 300, Large: 360 },
    duration: "3–4 hrs",
    features: [
      "Full Interior Reset (all items)",
      "Full Exterior Detail (all items)",
      "Door jamb cleaning",
      "Post-service inspection",
    ],
    note: "Includes everything in both packages above.",
  },
  {
    id: "premium-detail",
    name: "Premium Detail",
    slug: "premium-detail",
    badge: "Premium" as string | null,
    description:
      "Our highest-level service. Adds extraction, ceramic interior protection, and professional trim restoration on top of the Full Detail.",
    pricing: { Small: 300, Mid: 360, Large: 420 },
    duration: "4–5 hrs",
    features: [
      "Everything in Full Detail",
      "Light stain extraction",
      "Interior ceramic protection",
      "Interior trim & plastic restoration",
      "Restored, even finish on all surfaces",
    ],
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
    price: "$40",
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
] as const;

export const testimonials = [
  {
    name: "Mike T.",
    location: "Rocky Ridge, NW Calgary",
    rating: 5,
    text: "Had the Full Detail done on my truck. I've been to shops before and nothing comes close — they came to my driveway, were done in under 4 hours, and the truck looked better than when I bought it.",
    vehicle: "2021 Ford F-150",
  },
  {
    name: "Sarah K.",
    location: "Tuscany, NW Calgary",
    rating: 5,
    text: "I have two kids and a dog. My SUV was destroyed. After the Premium Detail it smelled brand new — they got every single dog hair out. Won't use anyone else.",
    vehicle: "2020 Toyota RAV4",
  },
  {
    name: "Jason W.",
    location: "Bearspaw",
    rating: 5,
    text: "Booked the Premium Detail on my Model 3. Super professional, no mess left behind, paint looks insane. The ceramic interior protection is worth every penny.",
    vehicle: "2022 Tesla Model 3",
  },
  {
    name: "Lisa M.",
    location: "Watermark",
    rating: 5,
    text: "I travel for work constantly and my car was a disaster. Booked Clearline and they came while I worked from home. Done by lunch. Looked incredible. Zero effort on my part.",
    vehicle: "2019 Honda Civic",
  },
] as const;

export const faqItems = [
  {
    question: "Do you bring your own water and equipment?",
    answer:
      "Yes — completely self-contained. We bring our own water, pressure washer, vacuums, extractors, and all professional detailing products. You don't need to provide anything.",
  },
  {
    question: "Where do you service in Calgary?",
    answer:
      "Our primary service area is NW Calgary including Bearspaw, Watermark, Rocky Ridge, Tuscany, Nolan Hill, Evanston, Sage Hill, Royal Oak, and Sherwood. Not sure if we cover your area? Message us — we're flexible.",
  },
  {
    question: "How do I pay?",
    answer:
      "We accept all major credit and debit cards via Square, plus e-transfer. Payment is collected after the service is complete and you've inspected the results.",
  },
  {
    question: "How long does a detail take?",
    answer:
      "Interior Reset: 2–3 hours. Exterior Detail: 1–2 hours. Full Detail: 3–4 hours. Premium Detail: 4–5 hours. We'll confirm the timeframe when we book based on your vehicle.",
  },
  {
    question: "What's the difference between Full Detail and Premium?",
    answer:
      "Full Detail is Interior Reset + Exterior Detail. Premium adds extraction for deeper stains, interior ceramic protection (which repels spills and staining), and trim/plastic restoration for a fully finished look inside.",
  },
  {
    question: "Do I need to be home the whole time?",
    answer:
      "No. Most of our clients go about their day — work from home, run errands, whatever. Just be available at the start to hand over keys and at the end to walk through the results.",
  },
  {
    question: "What if I'm not happy with the result?",
    answer:
      "We'll come back and fix it. 100% satisfaction guarantee — no arguments, no fees.",
  },
] as const;
