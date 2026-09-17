import { WATTPE_URL } from "@/lib/data";

export type ProductChallenge = {
  title: string;
  body: string;
  image: string;
};

export type ProductFaq = {
  question: string;
  answer: string;
};

type ProductListing = {
  slug: string;
  number: string;
  name: string;
  short: string;
  ctaLabel: string;
  ctaHref: string;
  ctaExternal?: boolean;
};

export type ProductPage = ProductListing & {
  kind?: "page";
  tagline: string;
  description: string;
  challengesLead: string;
  challenges: ProductChallenge[];
  howTitle: string;
  howLead: string;
  how: { title: string; body: string }[];
  heroImages: [string, string];
  faq: ProductFaq[];
};

export type ProductTool = ProductListing & {
  kind: "tool";
};

export type Product = ProductPage | ProductTool;

export function isProductPage(product: Product): product is ProductPage {
  return product.kind !== "tool";
}

export const PRODUCTS: Product[] = [
  {
    slug: "copilot",
    number: "01",
    name: "AI Energy Copilot",
    short:
      "Upload your C&I electricity bill and let AINERGY Copilot turn it into an initial energy strategy.",
    tagline: "Your Electricity Bill Is the Starting Point.",
    description:
      "AINERGY Copilot reads a commercial or industrial electricity bill and turns tariff, load and consumption into comparable energy scenarios — Open Access, Captive, Group Captive and more.",
    challengesLead:
      "Energy strategy for C&I sites often stalls because the bill is unread as a plan, and the options cannot be compared on landed cost.",
    challenges: [
      {
        title: "Bills stay unread as strategy",
        body: "Tariff, load and consumption sit on the bill, but rarely become a comparable energy plan.",
        image: "/AboutBG.avif",
      },
      {
        title: "Landed cost is hard to see",
        body: "Open Access, Captive and Group Captive look different until indicative landed cost is side by side.",
        image: "/ForBusinessBG.avif",
      },
      {
        title: "Assumptions stay hidden",
        body: "Recommendations feel opaque when the model does not show what it took from the bill.",
        image: "/solutions.png",
      },
      {
        title: "Scenarios are evaluated in isolation",
        body: "Grid, OA, Captive and hybrid paths get discussed separately instead of as one comparison.",
        image: "/HomeBG.png",
      },
      {
        title: "Effective tariff is unclear",
        body: "Headline unit rates hide demand charges, duties and the true ₹/kWh the business pays.",
        image: "/products.png",
      },
      {
        title: "The next step is undefined",
        body: "Even a useful estimate does not say whether the following action is OA, Captive or a deeper site study.",
        image: "/services.png",
      },
    ],
    howTitle: "How Copilot works",
    howLead:
      "From upload to a comparable plan, the flow stays tied to what is on the bill.",
    how: [
      {
        title: "Upload the bill",
        body: "A C&I electricity bill is the only starting input.",
      },
      {
        title: "Read tariff and load",
        body: "AI extracts state, consumer type, sanctioned load and consumption.",
      },
      {
        title: "Estimate current cost",
        body: "Effective energy cost is calculated from what the bill actually shows.",
      },
      {
        title: "Compare scenarios",
        body: "Grid, Open Access, Captive, Group Captive and hybrid paths are weighed on landed cost.",
      },
      {
        title: "Show assumptions",
        body: "Extracted fields and model choices stay visible, not buried in a black box.",
      },
      {
        title: "Name the next step",
        body: "Copilot points to the assessment that should follow the indicative result.",
      },
    ],
    heroImages: ["/products.png", "/solutions.png"],
    faq: [
      {
        question: "What is AI Energy Copilot?",
        answer:
          "Copilot is AINERGY's bill-to-strategy tool for C&I electricity consumers. It reads a bill, estimates current effective cost, compares energy paths and recommends the next assessment step.",
      },
      {
        question: "What do I need to start?",
        answer:
          "A commercial or industrial electricity bill. Copilot is built around that document as the starting input.",
      },
      {
        question: "Does Copilot replace a full energy study?",
        answer:
          "No. Results are indicative. Copilot is the first pass that makes options comparable and names the assessment that should follow.",
      },
      {
        question: "Which scenarios does it evaluate?",
        answer:
          "It evaluates Grid, Open Access, Captive, Group Captive and related hybrid paths on indicative landed cost.",
      },
      {
        question: "Will I see what the model assumed?",
        answer:
          "Yes. Extracted bill fields and key assumptions stay visible so the recommendation is not a black box.",
      },
      {
        question: "Who is it for?",
        answer:
          "C&I energy, finance, plant and sustainability teams who need a bill-backed first comparison before a longer engagement.",
      },
    ],
    ctaLabel: "Upload My Bill",
    ctaHref: "/energy-optimizer",
  },
  {
    slug: "wattpe",
    number: "02",
    name: "WattPe",
    short:
      "Community energy beyond the rooftop — solar participation for residents, renters and small businesses.",
    tagline: "You Don't Need a Roof to Participate in Solar.",
    description:
      "WattPe is AINERGY's community-energy platform. It is built for people and small businesses who want to participate in solar without owning a rooftop or a plant.",
    challengesLead:
      "Community solar has to work for people who do not own a roof, a plant or a large C&I load.",
    challenges: [
      {
        title: "No roof, no plant",
        body: "Most solar products assume you own the surface the panels sit on.",
        image: "/products.png",
      },
      {
        title: "Renters are left out",
        body: "Tenants and apartment residents cannot take a typical rooftop path.",
        image: "/AboutBG.avif",
      },
      {
        title: "Small loads still matter",
        body: "Small businesses need a participation model that is not a full infrastructure project.",
        image: "/ForBusinessBG.avif",
      },
      {
        title: "Community solar is hard to explain",
        body: "Credits, eligibility and participation need a consumer-first surface, not a C&I proposal.",
        image: "/AboutBG.avif",
      },
      {
        title: "Ownership is the wrong frame",
        body: "Many users need to participate in solar without becoming an asset owner.",
        image: "/solutions.png",
      },
      {
        title: "The journey lives elsewhere",
        body: "WattPe needs its own website. AINERGY introduces the product; WattPe hosts the experience.",
        image: "/contactBG.avif",
      },
    ],
    howTitle: "How WattPe is positioned",
    howLead:
      "AINERGY introduces WattPe here. The product experience lives on the WattPe site.",
    how: [
      {
        title: "Start from the constraint",
        body: "No roof, no plant, still a reason to participate in solar.",
      },
      {
        title: "Name the audience",
        body: "Apartment residents, renters and small businesses — not C&I HT consumers.",
      },
      {
        title: "Explain participation",
        body: "Community solar, AINERGY Credits and eligible energy uses.",
      },
      {
        title: "Keep it consumer-first",
        body: "The product is not a landed-cost model. It is a participation platform.",
      },
      {
        title: "Send people to WattPe",
        body: "The live experience is on the WattPe website, not inside this page.",
      },
    ],
    heroImages: ["/products.png", "/solutions.png"],
    faq: [
      {
        question: "What is WattPe?",
        answer:
          "WattPe is AINERGY's community-energy platform for people and small businesses who want to participate in solar without owning a rooftop or a plant.",
      },
      {
        question: "Do I need a roof?",
        answer:
          "No. WattPe is built around the idea that you do not need a roof to participate in solar.",
      },
      {
        question: "Is WattPe the same as Copilot?",
        answer:
          "No. Copilot is a C&I bill-to-strategy tool. WattPe is a separate consumer-first community solar product.",
      },
      {
        question: "Where do I use WattPe?",
        answer:
          "On the WattPe website. This AINERGY page introduces the product; the live experience is hosted separately.",
      },
      {
        question: "Who is it for?",
        answer:
          "Apartment residents, renters and small businesses — not large HT C&I consumers evaluating Open Access or Captive.",
      },
    ],
    ctaLabel: "Visit WattPe",
    ctaHref: WATTPE_URL,
    ctaExternal: true,
  },
  {
    slug: "epc-calculator",
    number: "03",
    name: "EPC Calculator",
    short:
      "Planning-grade solar EPC estimator — instant BOM cost for utility-scale plants, including modules, mounting, inverters, BOS, GST and ₹/Wp.",
    kind: "tool",
    ctaLabel: "Open calculator",
    ctaHref: "/products/epc-calculator",
  },
];

export function getProduct(slug: string) {
  return PRODUCTS.find((product) => product.slug === slug);
}

export const MOCK_EXTRACTED_FIELDS = [
  { label: "State", value: "Extracted" },
  { label: "Consumer type", value: "HT / C&I" },
  { label: "Sanctioned load", value: "From bill" },
  { label: "Monthly consumption", value: "From bill" },
  { label: "Effective tariff", value: "Calculated" },
] as const;
