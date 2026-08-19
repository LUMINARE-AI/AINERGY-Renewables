// Central data models for AINERGY. All figures marked isPlaceholder are
// illustrative only and must not be presented as verified company data.

export type NavLink = { label: string; href: string };

export const NAV_LINKS: NavLink[] = [
  { label: "Solutions", href: "/solutions" },
  { label: "Energy OS", href: "/energy-os" },
  { label: "Projects", href: "/projects" },
  { label: "For Business", href: "/for-business" },
  { label: "Insights", href: "/insights" },
  { label: "About", href: "/about" },
];

export const FOOTER_LINKS: NavLink[] = [
  { label: "Solutions", href: "/solutions" },
  { label: "Energy OS", href: "/energy-os" },
  { label: "Projects", href: "/projects" },
  { label: "For Business", href: "/for-business" },
  { label: "Insights", href: "/insights" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export const LEGAL_LINKS: NavLink[] = [
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms", href: "/terms" },
  { label: "Disclaimer", href: "/disclaimer" },
];

export type Metric = {
  value: string;
  label: string;
  isPlaceholder?: boolean;
};

export const TRUST_METRICS: Metric[] = [
  { value: "5 MW", label: "Initial renewable project", isPlaceholder: true },
  { value: "C&I", label: "Focused energy solutions" },
  { value: "24×7", label: "Future-ready clean energy" },
  { value: "AI", label: "Energy intelligence layer" },
  { value: "25+ yrs", label: "Infrastructure mindset" },
];

export type Solution = {
  slug: string;
  name: string;
  short: string;
  description: string;
  icon: string;
  points: string[];
};

export const SOLUTIONS: Solution[] = [
  {
    slug: "solar",
    name: "On-site Solar",
    short: "Rooftop, ground-mounted and behind-the-meter generation.",
    description:
      "AINERGY designs and operates on-site solar systems sized to your load profile — rooftop, ground-mounted or carport — so generation is consumed where it's produced.",
    icon: "Sun",
    points: [
      "Rooftop, ground-mount and carport formats",
      "Sized against real load and consumption data",
      "Behind-the-meter, minimal grid dependency",
    ],
  },
  {
    slug: "open-access",
    name: "Open Access",
    short: "Off-site renewable energy for larger requirements.",
    description:
      "For businesses whose energy needs exceed available rooftop or land, Open Access routes renewable power from off-site generation assets through the grid to your facility.",
    icon: "Network",
    points: [
      "Off-site solar or wind capacity",
      "Suited to high, steady industrial loads",
      "Subject to state regulations and eligibility",
    ],
  },
  {
    slug: "hybrid",
    name: "Wind + Solar Hybrid",
    short: "Complementary generation profiles, improved utilization.",
    description:
      "Wind and solar generate on different daily and seasonal patterns. Combining them at a single site improves capacity utilization and evens out the supply curve.",
    icon: "Wind",
    points: [
      "Higher combined capacity utilization factor",
      "Smoother generation across day and season",
      "Reduced dependence on a single resource",
    ],
  },
  {
    slug: "storage",
    name: "Battery Storage",
    short: "Store energy when abundant, deploy when it matters.",
    description:
      "Battery Energy Storage Systems shift renewable generation to when your business actually needs it — smoothing demand charges and extending clean-energy hours.",
    icon: "BatteryCharging",
    points: [
      "Peak shaving and demand-charge management",
      "Extends renewable availability past daylight",
      "Grid stability and backup resilience",
    ],
  },
  {
    slug: "energy-intelligence",
    name: "Energy Intelligence",
    short: "AI-powered forecasting, optimization and decisions.",
    description:
      "AINERGY OS continuously analyzes generation, demand, tariffs and weather to recommend how a business should generate, store, procure and consume energy.",
    icon: "BrainCircuit",
    points: [
      "Generation and demand forecasting",
      "Lowest-cost energy mix recommendations",
      "Continuous, data-driven optimization",
    ],
  },
  {
    slug: "ev",
    name: "EV Energy",
    short: "Charging infrastructure connected to your energy system.",
    description:
      "EV charging is treated as a load like any other — coordinated with generation, storage and tariffs rather than managed as a disconnected add-on.",
    icon: "Zap",
    points: [
      "Fleet and workplace charging",
      "Coordinated with on-site generation",
      "Load-aware scheduling",
    ],
  },
  {
    slug: "energy-as-a-service",
    name: "Energy-as-a-Service",
    short: "Long-term energy outcomes, without managing infrastructure.",
    description:
      "AINERGY can develop, own and operate the required energy infrastructure under a service model, so businesses can focus on their core operations.",
    icon: "Handshake",
    points: [
      "No upfront capital required in most structures",
      "AINERGY develops, owns and operates",
      "Structured, long-term energy outcomes",
    ],
  },
];

export const CLOCK_247: Solution = {
  slug: "247-clean-energy",
  name: "24×7 Clean Energy",
  short: "Moving beyond daytime solar toward round-the-clock renewables.",
  description:
    "Combining generation sources, storage and grid balancing to move businesses beyond daytime-only solar and closer to continuously available clean energy.",
  icon: "Clock",
  points: [
    "Generation-storage-grid coordination",
    "Reduces reliance on any single time-of-day source",
    "A long-term direction, not a same-day guarantee",
  ],
};

export const ALL_SOLUTIONS: Solution[] = [...SOLUTIONS, CLOCK_247];

export type Project = {
  slug: string;
  name: string;
  category: "Solar" | "Wind" | "Hybrid" | "Storage" | "C&I";
  status: "In Development" | "Under Construction" | "Operational";
  capacity: string;
  location: string;
  technology: string;
  expectedGeneration: string;
  cod: string;
  description: string;
  isPlaceholder: boolean;
};

export const PROJECTS: Project[] = [
  {
    slug: "ainergy-solar-project-5mw",
    name: "AINERGY Solar Project",
    category: "Solar",
    status: "In Development",
    capacity: "5 MW",
    location: "Location to be announced",
    technology: "Ground-mounted crystalline PV",
    expectedGeneration: "To be confirmed on commissioning",
    cod: "Commercial operation date to be announced",
    description:
      "AINERGY's first ground-mounted solar project, developed as the foundation of its own renewable-energy generation base ahead of building out its C&I platform.",
    isPlaceholder: true,
  },
];

export type Industry = {
  name: string;
  icon: string;
};

export const INDUSTRIES: Industry[] = [
  { name: "Manufacturing", icon: "Factory" },
  { name: "Automotive", icon: "Car" },
  { name: "Textile", icon: "Shirt" },
  { name: "Pharmaceuticals", icon: "Pill" },
  { name: "Chemicals", icon: "FlaskConical" },
  { name: "Warehousing", icon: "Warehouse" },
  { name: "Data Centers", icon: "Server" },
  { name: "Retail", icon: "Store" },
  { name: "Hospitality", icon: "BedDouble" },
  { name: "Food & Beverage", icon: "UtensilsCrossed" },
  { name: "Engineering", icon: "Cog" },
  { name: "Commercial Real Estate", icon: "Building2" },
];

export type BusinessModel = {
  name: string;
  description: string;
};

export const BUSINESS_MODELS: BusinessModel[] = [
  {
    name: "Own",
    description: "The customer owns the energy asset outright.",
  },
  {
    name: "PPA",
    description: "Long-term renewable-energy supply under a power purchase agreement.",
  },
  {
    name: "Open Access",
    description: "Off-site renewable supply routed to eligible customers via the grid.",
  },
  {
    name: "Energy-as-a-Service",
    description: "AINERGY develops and operates the infrastructure under a service model.",
  },
  {
    name: "Hybrid",
    description: "A combination of customer-owned and third-party-owned assets.",
  },
];

export type Insight = {
  slug: string;
  title: string;
  category: string;
  excerpt: string;
  readTime: string;
  body: string[];
};

export const INSIGHTS: Insight[] = [
  {
    slug: "understanding-open-access-for-ci",
    title: "Understanding Open Access for C&I Businesses",
    category: "Open Access",
    readTime: "6 min read",
    excerpt:
      "What Open Access is, who is eligible, and how off-site renewable power actually reaches a facility.",
    body: [
      "Open Access allows eligible commercial and industrial consumers to source electricity from a generator outside their own premises, using the grid as the delivery mechanism.",
      "Eligibility, applicable charges and the approval process vary by state and consumer category. Businesses evaluating Open Access should model the full landed cost — including wheeling, banking and cross-subsidy charges — rather than the generation tariff alone.",
      "Done well, Open Access lets larger energy consumers access renewable power at a scale that on-site rooftop alone cannot provide.",
    ],
  },
  {
    slug: "battery-storage-economics-explained",
    title: "Battery Storage Economics, Explained",
    category: "BESS",
    readTime: "7 min read",
    excerpt:
      "Where BESS creates value for a C&I energy user — beyond simply storing electrons.",
    body: [
      "Battery Energy Storage Systems create value in more than one way: peak shaving, demand-charge reduction, backup resilience and extending renewable availability past daylight hours.",
      "The right battery size depends on a facility's load curve, tariff structure and renewable generation profile — oversizing wastes capital, undersizing limits the benefit.",
      "As BESS costs continue to decline, storage is increasingly evaluated alongside generation rather than as a separate, optional add-on.",
    ],
  },
  {
    slug: "ai-in-energy-what-it-actually-does",
    title: "AI in Energy: What It Actually Does",
    category: "AI in Energy",
    readTime: "5 min read",
    excerpt:
      "A grounded look at where machine learning genuinely improves energy decisions today.",
    body: [
      "Applied well, AI in energy means forecasting generation and demand, recommending an optimal mix of sources, and flagging when procurement or storage decisions should change.",
      "It is best understood as decision support for people who operate energy systems — not as autonomous control of physical infrastructure, unless a system is explicitly designed and authorized for that.",
      "The value compounds over time: the more operating data a system observes, the sharper its recommendations become.",
    ],
  },
  {
    slug: "ci-energy-economics-101",
    title: "C&I Energy Economics 101",
    category: "Energy Economics",
    readTime: "8 min read",
    excerpt:
      "The building blocks of an industrial or commercial electricity bill, and where the real savings live.",
    body: [
      "A typical C&I electricity bill is shaped by energy charges, demand charges, power factor penalties and time-of-day tariffs — not just the per-unit rate.",
      "Renewable energy addresses the energy-charge component directly. Storage and load management address demand charges and time-of-day exposure.",
      "A complete energy strategy considers all of these levers together, rather than optimizing generation in isolation.",
    ],
  },
  {
    slug: "energy-transition-for-indian-industry",
    title: "The Energy Transition for Indian Industry",
    category: "Energy Transition",
    readTime: "6 min read",
    excerpt: "Why energy is shifting from a fixed cost to a strategic variable for Indian businesses.",
    body: [
      "Rising and volatile energy costs, tightening sustainability expectations from customers and investors, and improving renewable economics are together changing how Indian businesses think about energy.",
      "What was once a fixed operating cost is increasingly treated as a strategic variable — something to be actively designed, financed and optimized.",
      "Businesses that treat energy this way gain both cost and resilience advantages over those that continue to purchase power passively from the grid.",
    ],
  },
  {
    slug: "regulatory-basics-renewable-procurement",
    title: "Regulatory Basics of Renewable Procurement",
    category: "Regulatory",
    readTime: "7 min read",
    excerpt:
      "A plain-language overview of the regulatory landscape shaping C&I renewable procurement in India.",
    body: [
      "Renewable procurement for C&I consumers in India sits at the intersection of central policy and state-level electricity regulations, which govern Open Access, banking and wheeling.",
      "Because rules differ by state and are periodically revised, project-specific regulatory diligence is essential before committing to a structure.",
      "This is general information only and does not constitute legal or regulatory advice for a specific project.",
    ],
  },
];

export type SolutionsPageSection = { title: string; body: string };

export const HOW_IT_WORKS = [
  {
    step: "01",
    title: "Understand",
    description: "Connect electricity bills, load data and business requirements.",
  },
  {
    step: "02",
    title: "Analyze",
    description: "Evaluate load profile, tariffs, renewable potential, grid conditions, demand and operating hours.",
  },
  {
    step: "03",
    title: "Design",
    description: "AI designs the optimal combination of solar, wind, storage, grid and Open Access.",
  },
  {
    step: "04",
    title: "Finance",
    description: "Choose an appropriate commercial model for the business.",
  },
  {
    step: "05",
    title: "Build",
    description: "AINERGY develops or partners to build the required energy infrastructure.",
  },
  {
    step: "06",
    title: "Operate",
    description: "Monitor and manage assets across their operating life.",
  },
  {
    step: "07",
    title: "Optimize",
    description: "AINERGY OS continuously improves energy economics.",
  },
  {
    step: "08",
    title: "Decarbonize",
    description: "Track renewable consumption and carbon impact over time.",
  },
];

export const AI_CAPABILITIES = [
  { title: "Forecast", description: "Predict generation and demand.", icon: "TrendingUp" },
  { title: "Optimize", description: "Find the lowest-cost energy mix.", icon: "SlidersHorizontal" },
  { title: "Balance", description: "Coordinate generation, storage and consumption.", icon: "Scale" },
  { title: "Procure", description: "Determine when and where to buy renewable energy.", icon: "ShoppingCart" },
  { title: "Operate", description: "Monitor renewable assets.", icon: "Activity" },
  { title: "Decarbonize", description: "Track renewable share and emissions.", icon: "Leaf" },
];

export const OS_NODES = [
  "Solar",
  "Wind",
  "BESS",
  "Grid",
  "Open Access",
  "EV",
  "Factory Load",
  "Energy Markets",
  "Weather",
  "Tariffs",
  "Carbon",
];
