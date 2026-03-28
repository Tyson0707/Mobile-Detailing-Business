export const siteConfig = {
  name: "Clear Line Auto Detail",
  tagline: "Mobile Car Detailing That Comes To You",
  description:
    "Calgary's premium mobile car detailing service. We come to your home, office, or anywhere in Calgary. Professional detailing, ceramic coatings & paint correction. Book online today.",
  domain: "clearlineautodetail.ca",
  url: "https://clearlineautodetail.ca",

  // Business contact — fill these in
  phone: "(587) 000-0000",
  phoneRaw: "+15870000000",
  email: "book@clearlineautodetail.ca",
  address: "Calgary, AB",

  // Square booking link — replace when ready
  squareBookingUrl: "#booking",

  // Service area
  city: "Calgary",
  province: "AB",
  serviceAreas: [
    "Calgary",
    "NW Calgary",
    "SW Calgary",
    "SE Calgary",
    "NE Calgary",
    "Airdrie",
    "Cochrane",
    "Okotoks",
    "Chestermere",
  ],

  // Social
  social: {
    instagram: "https://instagram.com/clearlineautodetail",
    facebook: "https://facebook.com/clearlineautodetail",
    google: "#",
  },

  // Stats shown on homepage
  stats: [
    { value: "500+", label: "Cars Detailed" },
    { value: "100%", label: "Mobile — We Come To You" },
    { value: "5★", label: "Average Google Rating" },
    { value: "Insured", label: "Fully Insured & Certified" },
  ],
} as const;

export const services = [
  {
    id: "express-exterior",
    name: "Express Exterior",
    slug: "express-exterior",
    price: "$79",
    duration: "60–90 min",
    badge: null,
    description:
      "A thorough exterior refresh to make your paint pop. Perfect for regular maintenance.",
    features: [
      "Hand wash & rinse",
      "Clay bar decontamination",
      "Tire & wheel cleaning",
      "Window cleaning (exterior)",
      "Tire dressing",
      "Spray wax protection",
    ],
  },
  {
    id: "interior-detail",
    name: "Interior Detail",
    slug: "interior-detail",
    price: "$149",
    duration: "2–3 hrs",
    badge: null,
    description:
      "Deep-clean your cabin from top to bottom. Every surface vacuumed, wiped, and treated.",
    features: [
      "Full vacuum (seats, carpet, trunk)",
      "Dashboard & console wipe-down",
      "Door jamb & panel cleaning",
      "Leather/vinyl conditioning",
      "Window cleaning (interior)",
      "Odour elimination treatment",
    ],
  },
  {
    id: "full-detail",
    name: "Full Detail",
    slug: "full-detail",
    price: "$249",
    duration: "3–5 hrs",
    badge: "Most Popular",
    description:
      "The complete package — showroom clean inside and out. Our most popular service.",
    features: [
      "Everything in Express Exterior",
      "Everything in Interior Detail",
      "Engine bay wipe-down",
      "Paint sealant application",
      "Plastic trim restoration",
      "Post-service inspection",
    ],
  },
  {
    id: "ceramic-coating",
    name: "Ceramic Coating",
    slug: "ceramic-coating",
    price: "From $799",
    duration: "1–2 days",
    badge: "Premium",
    description:
      "Professional-grade ceramic coating for years of protection. Includes full prep detail.",
    features: [
      "Full decontamination wash",
      "Paint correction (1-stage)",
      "Professional ceramic coating application",
      "2–5 year protection warranty",
      "Hydrophobic & UV protection",
      "Post-cure inspection",
    ],
  },
] as const;

export const testimonials = [
  {
    name: "Mike T.",
    location: "NW Calgary",
    rating: 5,
    text: "Absolutely blew me away. Booked the Full Detail for my F-150 and it looks better than when I drove it off the lot. So convenient having them come to my driveway.",
    vehicle: "2021 Ford F-150",
  },
  {
    name: "Sarah K.",
    location: "SW Calgary",
    rating: 5,
    text: "Used Clear Line for my SUV before a road trip. The interior was completely transformed — even got the dog smell out! Will never go to a car wash again.",
    vehicle: "2020 Toyota RAV4",
  },
  {
    name: "Jason W.",
    location: "Airdrie",
    rating: 5,
    text: "Had the ceramic coating done on my Model 3. These guys are pros — the prep work alone was worth it. Paint looks incredible and beads water like nothing I've seen.",
    vehicle: "2022 Tesla Model 3",
  },
  {
    name: "Lisa M.",
    location: "SE Calgary",
    rating: 5,
    text: "Booked them for my mom's car as a gift. She literally cried when she saw it. Incredibly detailed work, friendly service, and they were right on time.",
    vehicle: "2019 Honda Civic",
  },
] as const;

export const faqItems = [
  {
    question: "Do you bring your own water and equipment?",
    answer:
      "Yes — we are 100% self-sufficient. We bring our own water, pressure washers, vacuums, and all professional-grade products. All you need to do is give us access to your vehicle.",
  },
  {
    question: "Where do you service in Calgary?",
    answer:
      "We cover all of Calgary (NW, SW, NE, SE, and Downtown) plus surrounding areas including Airdrie, Cochrane, Okotoks, and Chestermere. Not sure if we cover your area? Just reach out — we'll make it work.",
  },
  {
    question: "How do I pay?",
    answer:
      "We accept all major credit cards, debit, and e-transfer through our secure Square payment system. Payment is collected after the service is complete and you're 100% satisfied.",
  },
  {
    question: "How long does a detail take?",
    answer:
      "Express Exterior takes 60–90 minutes, Interior Detail 2–3 hours, Full Detail 3–5 hours, and Ceramic Coating 1–2 days. We'll confirm the exact timeframe when you book.",
  },
  {
    question: "What if I'm not satisfied with the result?",
    answer:
      "We have a 100% satisfaction guarantee. If something isn't right, we'll come back and fix it — no questions asked. Your satisfaction is the only acceptable outcome.",
  },
  {
    question: "Do I need to be home during the service?",
    answer:
      "You don't need to be present the entire time — just available at the start and end to hand over keys and inspect the result. Many of our clients go to work while we detail their car in the driveway.",
  },
] as const;
