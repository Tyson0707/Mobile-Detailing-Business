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
    { value: "8", label: "5★ Google Reviews", link: "GOOGLE_REVIEWS_URL" },
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
      "Full Detail is Interior Reset + Exterior Detail. Premium adds extraction for deeper stains, interior ceramic protection (which repels spills and staining), and trim/plastic restoration for a fully finished look inside.",
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
