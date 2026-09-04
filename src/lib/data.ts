// Central data models for AINERGY. All figures marked isPlaceholder are
// illustrative only and must not be presented as verified company data.

export type NavLink = { label: string; href: string };

export const NAV_LINKS: NavLink[] = [
  { label: "Solutions", href: "/solutions" },
  { label: "Services", href: "/services" },
  { label: "Products", href: "/products" },
  { label: "About", href: "/about" },
];

export const FOOTER_LINKS: NavLink[] = [
  { label: "Solutions", href: "/solutions" },
  { label: "Services", href: "/services" },
  { label: "Products", href: "/products" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export const LEGAL_LINKS: NavLink[] = [
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms", href: "/terms" },
  { label: "Disclaimer", href: "/disclaimer" },
];

export const WATTPE_URL = "https://watt-pe-two.vercel.app/";

export type InfrastructureService = {
  name: string;
  short: string;
  description: string;
  capabilities: string;
  icon: string;
};

export const INFRASTRUCTURE_SERVICES: InfrastructureService[] = [
  {
    name: "Solar EPC",
    short: "Utility-Scale Solar, Built for Performance",
    description:
      "End-to-end engineering, procurement and construction for ground-mounted and C&I solar projects — from design and procurement to commissioning.",
    capabilities: "Engineering • Procurement • Construction • Commissioning",
    icon: "Sun",
  },
  {
    name: "EHV EPC",
    short: "Power Infrastructure That Connects",
    description:
      "High-voltage evacuation and grid-interconnection infrastructure for renewable-energy projects and C&I customers.",
    capabilities: "Substations • Transmission • Evacuation • Grid Interconnection",
    icon: "Cable",
  },
  {
    name: "Rooftop EPC",
    short: "Solar Where You Operate",
    description:
      "Commercial and industrial rooftop solar designed around your available space, energy consumption and electrical infrastructure.",
    capabilities: "Design • Engineering • Installation • Commissioning",
    icon: "Building2",
  },
  {
    name: "BESS",
    short: "Store Energy. Deploy It Smarter.",
    description:
      "Battery Energy Storage System integration for energy shifting, peak management, renewable integration and evolving C&I energy needs.",
    capabilities: "BESS • EMS • Integration • Commissioning",
    icon: "BatteryCharging",
  },
  {
    name: "EV Charging",
    short: "Energy Infrastructure for Electric Mobility",
    description:
      "Commercial EV charging infrastructure integrated with your site's electrical system and broader energy strategy.",
    capabilities:
      "Charging Infrastructure • Electrical Integration • Energy Management",
    icon: "PlugZap",
  },
  {
    name: "O&M",
    short: "Keep Your Energy Assets Performing",
    description:
      "Technology-enabled monitoring, preventive maintenance and corrective support to improve reliability, availability and long-term asset performance.",
    capabilities:
      "Monitoring • Preventive Maintenance • Corrective Maintenance • Performance Support",
    icon: "Activity",
  },
];

export type Metric = {
  value: string;
  label: string;
  isPlaceholder?: boolean;
};

export const TRUST_METRICS: Metric[] = [
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
  cta?: string;
  featured?: boolean;
  /** Optional override; defaults to `/solutions/${slug}`. */
  href?: string;
};

export const SOLUTIONS: Solution[] = [
  {
    slug: "open-access",
    name: "Green Energy Open Access",
    short: "Your gateway to large-scale renewable energy",
    description:
      "Access renewable power from off-site solar and wind projects through Green Energy Open Access, with AINERGY evaluating the complete landed cost against your existing electricity cost.",
    icon: "Network",
    featured: true,
    cta: "Explore OA",
    points: [
      "Off-site solar and wind for large C&I loads",
      "Full landed-cost comparison vs current electricity cost",
      "Built for the 100 kW+ C&I proposition",
    ],
  },
  {
    slug: "captive",
    name: "Captive Energy",
    short: "Own your renewable energy",
    description:
      "Develop dedicated renewable-energy assets linked to your energy requirements, giving businesses greater control over their clean-energy supply and long-term energy economics.",
    icon: "Building2",
    cta: "Explore Captive",
    points: [
      "Dedicated assets sized to your load",
      "Greater control over clean-energy supply",
      "Long-term energy economics under your ownership",
    ],
  },
  {
    slug: "group-captive",
    name: "Group Captive",
    short: "Share ownership. Share clean energy.",
    description:
      "Participate in renewable-energy projects through a Group Captive structure, combining shared ownership with long-term renewable energy supply.",
    icon: "Users",
    cta: "Explore Group Captive",
    points: [
      "Shared ownership of renewable projects",
      "Long-term renewable energy supply",
      "Suited to businesses pooling demand",
    ],
  },
  {
    slug: "hybrid",
    name: "Solar + Wind Hybrid",
    short: "Balance generation. Strengthen supply.",
    description:
      "Combine solar and wind generation to create a more complementary renewable-energy profile and improve utilization across different generation periods.",
    icon: "Wind",
    cta: "Explore Hybrid",
    points: [
      "Complementary solar and wind profiles",
      "Improved utilization across periods",
      "Stronger, more balanced supply",
    ],
  },
  {
    slug: "storage",
    name: "Battery Energy Storage",
    short: "Store energy when it matters",
    description:
      "Use BESS to store energy, manage demand and shift consumption to the periods where energy has the greatest value.",
    icon: "BatteryCharging",
    cta: "Explore BESS",
    points: [
      "Store and shift energy to high-value periods",
      "Demand and peak management",
      "Extends clean energy beyond generation hours",
    ],
  },
  {
    slug: "247-clean-energy",
    name: "24×7 Clean Energy",
    short: "Move beyond daytime solar",
    description:
      "Combine renewable generation, storage and intelligent energy management to move toward a more reliable, round-the-clock clean-energy strategy.",
    icon: "Clock",
    cta: "Explore 24×7",
    points: [
      "Generation + storage + intelligent management",
      "Toward round-the-clock clean energy",
      "A long-term strategy, not a same-day guarantee",
    ],
  },
  {
    slug: "energy-as-a-service",
    name: "Energy-as-a-Service",
    short: "Clean energy without building everything yourself",
    description:
      "AINERGY can develop, finance, own and operate energy infrastructure, allowing businesses to access long-term clean-energy solutions without managing the entire project lifecycle.",
    icon: "Handshake",
    cta: "Explore EaaS",
    points: [
      "Develop, finance, own and operate",
      "Long-term clean-energy outcomes",
      "Without managing the full project lifecycle",
    ],
  },
  {
    slug: "integrated",
    name: "Integrated Energy Solutions",
    short: "One strategy. Multiple energy assets.",
    description:
      "Combine Solar, Wind, Open Access, Captive, Group Captive and BESS into an energy strategy designed around your consumption profile, cost and sustainability goals.",
    icon: "Layers",
    cta: "Design My Energy Strategy",
    href: "/energy-optimizer",
    points: [
      "Solar, Wind, OA, Captive, Group Captive and BESS",
      "Designed around your consumption profile",
      "Aligned to cost and sustainability goals",
    ],
  },
];

/** @deprecated Prefer SOLUTIONS — kept for older imports. */
export const CLOCK_247: Solution = SOLUTIONS.find(
  (s) => s.slug === "247-clean-energy"
)!;

export const ALL_SOLUTIONS: Solution[] = SOLUTIONS;

export type Service = {
  slug: string;
  name: string;
  short: string;
  description: string;
  icon: string;
  points: string[];
};

export const SERVICES: Service[] = [
  {
    slug: "solar-plant-development",
    name: "Solar Plant Development",
    short: "Rooftop, ground-mount and Open Access solar — designed, built and commissioned.",
    description:
      "AINERGY develops solar plants end to end — site assessment, design, EPC and commissioning — with Open Access as the primary route for businesses whose requirement outgrows on-site rooftop or land.",
    icon: "Sun",
    points: [
      "Open Access solar as the core focus — captive and group captive structures",
      "Rooftop and ground-mounted plants for on-site generation",
      "Site assessment, design, EPC and commissioning under one team",
      "Regulatory filings and DISCOM coordination handled end to end",
    ],
  },
  {
    slug: "ehv-lines-epc",
    name: "EHV Lines EPC (11 kV – 220 kV)",
    short: "Transmission and evacuation line EPC from 11 kV up to 220 kV.",
    description:
      "End-to-end EPC for extra-high-voltage transmission and evacuation lines from 11 kV to 220 kV — the infrastructure that actually connects an Open Access plant to its consumer, engineered and built in-house rather than outsourced.",
    icon: "Cable",
    points: [
      "Route survey, tower spotting and line design",
      "Turnkey construction from 11 kV to 220 kV",
      "Substation interconnection and evacuation infrastructure",
      "Statutory approvals and right-of-way coordination",
    ],
  },
  {
    slug: "ev-charger",
    name: "EV Charger Infrastructure",
    short: "Fleet and workplace EV charging, coordinated with your energy system.",
    description:
      "EV charging infrastructure supplied and installed as a load coordinated with generation, storage and tariffs — not a disconnected add-on bolted on after the fact.",
    icon: "PlugZap",
    points: [
      "Fleet, workplace and facility charging installations",
      "AC and DC charger supply, installation and commissioning",
      "Coordinated scheduling with on-site generation and tariffs",
      "Ongoing maintenance and uptime monitoring",
    ],
  },
  {
    slug: "bess",
    name: "BESS",
    short: "Battery Energy Storage Systems, sized to your load and tariff structure.",
    description:
      "Battery Energy Storage Systems supplied, installed and commissioned to shift generation to when it's actually needed — peak shaving, demand-charge management and backup resilience.",
    icon: "BatteryCharging",
    points: [
      "Sizing based on load curve, tariff structure and generation profile",
      "Peak shaving and demand-charge management",
      "Extends renewable availability past daylight hours",
      "Supply, installation and commissioning",
    ],
  },
  {
    slug: "ai-products",
    name: "AI Products",
    short: "The Energy Copilot and the AINERGY OS intelligence layer.",
    description:
      "The AI layer that sits on top of every physical asset AINERGY builds — forecasting generation and demand, recommending the lowest-cost energy mix, and turning a bill upload into a bankable plan.",
    icon: "BrainCircuit",
    points: [
      "Energy Procure Copilot — bill upload to recommended energy mix",
      "Generation and demand forecasting",
      "Landed-cost modeling across grid, Open Access, captive and group captive",
      "Continuous monitoring and optimization once assets are live",
    ],
  },
  {
    slug: "asset-om",
    name: "Asset O&M & Monitoring",
    short: "Ongoing operations, maintenance and performance monitoring.",
    description:
      "Once a plant, line or storage system is commissioned, AINERGY keeps operating it — performance monitoring, preventive maintenance and regulatory compliance across the asset's operating life.",
    icon: "Activity",
    points: [
      "Preventive and corrective maintenance",
      "Remote performance monitoring and alerting",
      "Regulatory and compliance reporting",
      "Single point of accountability across the asset lifecycle",
    ],
  },
];

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
